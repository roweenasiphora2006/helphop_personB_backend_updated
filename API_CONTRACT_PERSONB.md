# 📘 API CONTRACT – PERSON B  
## SOS System & Rescuer Assignment Backend

**Owner:** Person B  
**Tech Stack:** Node.js, Express.js, MongoDB  
**Status:** 🔒 FROZEN (No breaking changes allowed)

---

## 🔗 Base URL


http://localhost:5000/api/incidents


---

## 1️⃣ Create SOS Incident

### Endpoint


POST /create


### Description
Triggered when a user sends an SOS.  
The backend validates location, calculates distance and direction, rejects if outside the rescue radius, otherwise stores and broadcasts the SOS.

---

### Request Body
```json
{
  "userId": "string",
  "type": "string",
  "message": "string",
  "location": {
    "lat": number,
    "lng": number
  }
}

Success Response (201)
{
  "message": "SOS created & broadcasted",
  "distance_km": "string",
  "direction": "string",
  "incident": {
    "_id": "string",
    "userId": "string",
    "status": "pending"
  }
}

Rejected Response (200)
{
  "status": "rejected",
  "reason": "User is outside the 50 km rescue radius",
  "distance_km": "string"
}

Error Response (400 / 500)
{
  "error": "string"
}

2️⃣ Get Pending SOS Incidents
Endpoint
GET /pending

Description

Used by rescuers to fetch all active SOS requests.

Success Response (200)
[
  {
    "_id": "string",
    "userId": "string",
    "type": "string",
    "location": {
      "lat": number,
      "lng": number
    },
    "distance": number,
    "direction": "string",
    "status": "pending"
  }
]

3️⃣ Accept SOS
Endpoint
POST /accept

Description

A rescuer accepts responsibility for an SOS.

Request Body
{
  "incidentId": "string",
  "rescuerId": "string"
}

Success Response (200)
{
  "message": "Incident accepted",
  "incident": {
    "_id": "string",
    "status": "broadcasted",
    "rescuerId": "string"
  }
}

4️⃣ Reject SOS
Endpoint
PATCH /:id/reject

Description

Explicitly rejects an SOS (manual or system-triggered).

URL Params
id → Incident ID

Success Response (200)
{
  "message": "Incident rejected",
  "incident": {
    "_id": "string",
    "status": "rejected"
  }
}

5️⃣ Resolve SOS
Endpoint
POST /resolve

Description

Marks an SOS as successfully resolved.

Request Body
{
  "incidentId": "string"
}

Success Response (200)
{
  "message": "Incident resolved",
  "incident": {
    "_id": "string",
    "status": "resolved"
  }
}

6️⃣ Get All Incidents
Endpoint
GET /all

Description

Fetches all SOS incidents for monitoring and reporting.

Success Response (200)
{
  "incidents": [
    {
      "_id": "string",
      "userId": "string",
      "status": "string",
      "createdAt": "timestamp"
    }
  ]
}

7️⃣ Get Incidents by User
Endpoint
GET /user/:userId

Description

Fetches SOS history for a specific user.

URL Params
userId → User ID

Success Response (200)
{
  "incidents": [
    {
      "_id": "string",
      "status": "string",
      "createdAt": "timestamp"
    }
  ]
}