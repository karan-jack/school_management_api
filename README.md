# School Management API

This is a simple backend project built using Node.js, Express.js, and MySQL for managing school data.

The main purpose of this project is to:

* add schools into a database
* fetch schools based on proximity to the user's location
* sort schools from nearest to farthest using geographical coordinates

The project was created as part of a backend assignment to demonstrate REST API development, database integration, validation, deployment, and distance-based sorting.

---

# Live Deployment

Render Deployment Link:

[https://school-management-api-udon.onrender.com](https://school-management-api-udon.onrender.com)

---

# GitHub Repository

[https://github.com/karan-jack/school_management_api](https://github.com/karan-jack/school_management_api)

---

# Technologies Used

* Node.js
* Express.js
* MySQL
* mysql2
* geolib
* Railway
* Render
* Postman

---

# Why I Used Railway for MySQL

At first, I tried setting up MySQL locally, but during deployment and testing there were connection issues related to local MySQL authentication.

To make the application easier to deploy and test online, I switched to Railway's cloud-hosted MySQL database.

Railway provides:

* a real MySQL database
* remote access
* secure environment variables
* smooth integration with Render

This made deployment easier and allowed the APIs to work consistently online.

The assignment requirement of using MySQL is still fully satisfied because Railway also uses MySQL.

---

# Project Structure

```bash
School_Management_API/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── schoolController.js
│
├── routes/
│   └── schoolRoutes.js
│
├── utils/
│   └── distance.js
│
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

# Features

* Add schools using API
* Store school data in MySQL database
* Fetch schools sorted by distance
* Validate user input
* Cloud-hosted database setup
* Live backend deployment

---

# API Endpoints

## 1. Add School

### Endpoint

```http
POST /api/addSchool
```

### Sample Request Body

```json
{
  "name": "Sunrise Public School",
  "address": "Mumbai",
  "latitude": 19.0760,
  "longitude": 72.8777
}
```

### Sample Response

```json
{
  "success": true,
  "message": "School added successfully"
}
```

---

## 2. List Schools

### Endpoint

```http
GET /api/listSchools?latitude=19.07&longitude=72.87
```

### What It Does

This API fetches all schools from the database and sorts them from nearest to farthest based on the user's latitude and longitude.

### Sample Response

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Sunrise Public School",
      "address": "Mumbai",
      "latitude": "19.0760000",
      "longitude": "72.8777000",
      "distance": 0.5
    }
  ]
}
```

---

# Validation Implemented

The following validations were added:

* all fields are required
* latitude must be between -90 and 90
* longitude must be between -180 and 180
* query parameters are validated before processing

---

# Distance Calculation

The distance between the user's location and each school is calculated using the `geolib` package.

After calculating the distances, the schools are sorted from nearest to farthest.

---

# Environment Variables

Create a `.env` file and add:

```env
PORT=3000

DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
```

---

# How to Run the Project

## 1. Clone the Repository

```bash
git clone https://github.com/karan-jack/school_management_api.git
```

## 2. Open the Project Folder

```bash
cd school_management_api
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Server

```bash
npm run dev
```

---

# Deployment

The backend is deployed on Render.

Live URL:

[https://school-management-api-udon.onrender.com](https://school-management-api-udon.onrender.com)

The database is hosted on Railway and connected securely using environment variables.

---

# Postman Testing

The APIs were tested using Postman.

Test cases included:

* successful school insertion
* sorting schools by distance
* missing field validation
* invalid latitude validation
* invalid longitude validation

---

# Sample Live API URLs

## Add School

```http
POST https://school-management-api-udon.onrender.com/api/addSchool
```

## List Schools

```http
GET https://school-management-api-udon.onrender.com/api/listSchools?latitude=19.07&longitude=72.87
```

---

# Author

Karan Jack
