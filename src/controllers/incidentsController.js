const { 
  getDistance, 
  getBearing, 
  bearingToDirection 
} = require("../utils/geoUtils");

const Incident = require("../models/Incident");
const publisher = require("../services/incidentPublisher");

// Static rescue center (can be rescuer GPS later)
const RESCUE_CENTER = {
  lat: 12.9716,   // Bengaluru (dummy)
  lng: 77.5946
};

/* =========================
   1️⃣ USER TRIGGERS SOS
========================= */
exports.createIncident = async (req, res) => {
  try {
    const { userId, type, location, message } = req.body || {};

    // Validation
    if (
      !userId ||
      !type ||
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      return res.status(400).json({
        error: "userId, type and location {lat, lng} are required",
      });
    }

    // Distance calculation
    const distanceKm = getDistance(
      location.lat,
      location.lng,
      RESCUE_CENTER.lat,
      RESCUE_CENTER.lng
    );

    // Optional radius check
    if (distanceKm > 50) {
      return res.status(200).json({
        status: "rejected",
        reason: "Outside rescue radius",
        distance_km: distanceKm.toFixed(2),
      });
    }

    // Direction calculation
    const bearing = getBearing(
      location.lat,
      location.lng,
      RESCUE_CENTER.lat,
      RESCUE_CENTER.lng
    );
    const direction = bearingToDirection(bearing);

    // Create incident
    const newIncident = await Incident.create({
      userId,
      type,
      message,
      location,
      distance: distanceKm,
      direction,
      status: "pending",
    });

    // Broadcast to mesh / crypto layer (Person C)
    publisher.broadcastIncident(newIncident);

    res.status(201).json({
      message: "SOS created successfully",
      distance_km: distanceKm.toFixed(2),
      direction,
      incident: newIncident,
    });

  } catch (error) {
    console.error("❌ createIncident error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/* =========================
   2️⃣ RESCUER DASHBOARD
========================= */
exports.getPendingIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({ status: "pending" })
      .sort({ createdAt: 1 });

    res.json({ incidents });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending incidents" });
  }
};

/* =========================
   3️⃣ RESCUER ACCEPTS SOS
========================= */
exports.acceptIncident = async (req, res) => {
  try {
    const { incidentId, rescuerId } = req.body;

    if (!incidentId || !rescuerId) {
      return res.status(400).json({
        error: "incidentId and rescuerId are required",
      });
    }

    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    // 🔒 Prevent double accept
    if (incident.status !== "pending") {
      return res.status(400).json({
        error: "Incident already assigned or closed",
      });
    }

    incident.status = "accepted";
    incident.rescuerId = rescuerId;
    await incident.save();

    res.json({
      message: "Incident accepted",
      incident,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to accept incident" });
  }
};

/* =========================
   4️⃣ RESCUER REJECTS SOS
========================= */
exports.rejectIncident = async (req, res) => {
  try {
    const { incidentId } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      incidentId,
      { status: "rejected" },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.json({
      message: "Incident rejected",
      incident,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to reject incident" });
  }
};

/* =========================
   5️⃣ RESCUER MARKS RESCUED
========================= */
exports.resolveIncident = async (req, res) => {
  try {
    const { incidentId } = req.body;

    const incident = await Incident.findByIdAndUpdate(
      incidentId,
      { status: "resolved" },
      { new: true }
    );

    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    res.json({
      message: "Incident resolved",
      incident,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to resolve incident" });
  }
};

/* =========================
   6️⃣ ADMIN / DEBUG APIs
========================= */
exports.getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .sort({ createdAt: -1 });

    res.status(200).json({ incidents });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
};

exports.getIncidentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const incidents = await Incident.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({ incidents });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user incidents" });
  }
};
