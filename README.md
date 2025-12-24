# 🚨 SOS Incident Management Backend (Person B)

This repository contains the **backend system for SOS incident management and rescuer assignment**, developed as part of a **mesh-network–based emergency response project**.

This module represents **Person B’s contribution**, responsible for handling the **core emergency flow**, incident lifecycle, and rescuer coordination.

---

## 📌 Project Overview

The system handles emergency SOS requests generated from a mobile application and manages:

* Incident creation
* Distance and direction calculation
* Rescuer assignment
* Incident status tracking
* Integration with a mesh-network broadcast layer

The backend is designed to work in **two modes**:

1. **With network** → data is stored in the database and forwarded to rescuers
2. **Without network** → SOS is broadcast via mesh networking until it reaches:

   * a rescuer **OR**
   * a device with internet access

---

## 👤 Role: Person B (Backend & Incident Flow)

Person B is responsible for **all backend logic related to SOS handling**, including APIs, database operations, and incident lifecycle management.

Without this module, **no SOS flow or rescuer coordination exists**.

---

## ⭐ Core Features Implemented

### 1️⃣ SOS Creation API

* Receives SOS data from the mobile app
* Stores:

  * User ID
  * Emergency type
  * Location (latitude & longitude)
  * Timestamp
  * Message
* Calculates:

  * Distance from rescue center
  * Direction (N, NE, E, etc.)
* Rejects SOS outside 50 km radius
* Broadcasts SOS to mesh network layer

---

### 2️⃣ Incident Broadcasting

* Newly created SOS incidents are encrypted and broadcasted
* Used by **Person C (mesh networking module)**
* Ensures offline-first emergency propagation

---

### 3️⃣ Rescuer Dashboard APIs

* Fetch all **pending SOS incidents**
* Sorted by creation time
* Used by rescuer mobile dashboard

---

### 4️⃣ Accept / Reject Incident

* Rescuer can accept an SOS
* Prevents duplicate handling
* Assigns rescuer ID to incident
* Supports admin-style accept/reject flows

---

### 5️⃣ Resolve / Close Incident

* Marks SOS as **resolved**
* Updates incident status
* Removes it from active rescuer dashboard

---

### 6️⃣ Incident History

* Fetch all incidents
* Fetch incidents by user
* Useful for audit, logs, and reports

---

## 🧠 Incident Lifecycle

```
SOS Triggered
      ↓
Incident Created (Pending)
      ↓
Broadcast via Mesh Network
      ↓
Rescuer Accepts
      ↓
Incident Assigned
      ↓
Rescue Completed
      ↓
Incident Resolved
```

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB (Mongoose)**
* **REST APIs**
* **Geospatial Calculations**
* **Mesh-network integration (external module)**

---

## 📁 Project Structure

```
src/
 ├── controllers/
 │    └── incidentController.js
 ├── models/
 │    └── Incident.js
 ├── routes/
 │    └── incidentRoutes.js
 ├── services/
 │    └── incidentPublisher.js
 ├── utils/
 │    └── geoUtils.js
 └── app.js
```

---

## 🔐 Environment Variables

Create a `.env` file (not committed to GitHub):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

---

## ▶️ How to Run Locally

```bash
npm install
npm start
```

Server will start on:

```
http://localhost:5000
```

---

## 🔍 API Testing

All APIs were tested using **Postman**.

Key endpoints include:

* Create SOS
* Fetch pending incidents
* Accept / Reject SOS
* Resolve incident
* Fetch incident history

---

## 📄 Documentation

* `API_CONTRACT_PERSONB.md`
  → Contains full API request/response documentation

---

## 🎯 Impact

Person B’s backend ensures:

* Reliable SOS handling
* Correct rescuer assignment
* Incident lifecycle integrity
* Seamless coordination with mesh networking

This module forms the **central decision-making brain** of the emergency response system.

---

## ✨ Final Note

This backend is designed to be **scalable**, **offline-aware**, and **modular**, allowing seamless integration with:

* Flutter mobile app
* Mesh networking layer
* Rescuer applications

