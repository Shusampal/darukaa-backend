## LIVE URL

https://darukaa-frontend-production.up.railway.app

---

## Credentials for Login

### email - alice@darukaa.com
### password - 123

---


## Overview

Darukaa.Earth lets users:
- Register and manage reforestation projects
- Draw and save **geospatial sites** directly on an interactive Mapbox map
- View **carbon analytics** generated dynamically from the area and vegetation type
- Navigate seamlessly between maps, projects, and analytics dashboards

---



## Tech Stack

Frontend

React + Vite
React Router v6
Axios
Mapbox GL JS (for maps)
Chart.js (for analytics)


Backend

Node.js + Express
Prisma ORM
PostgreSQL
JWT Authentication
bcrypt for hashing
Turf.js for geospatial area calculation



### NOTE-

Though for backend , it was mentioned to use python based backend , but at this point i am more comfortable in nodejs based backend. so i made this project on nodejs.
Though I am learning python based backend and surely will be able to build production level apps in near future.


---


## High-Level Architecture

### Frontend (React + Vite)
│
│── Authentication (JWT)
│── Map Visualization (Mapbox GL JS)
│── Analytics Charts (Chart.js)
│── Axios API Client (with interceptors)
│
└──> Rest APIs connection to backend


### Backend (Node.js + Express + Prisma)
│
├── PostgreSQL Database
├── JWT Authentication Middleware
├── Project / Site / Analytics Controllers
└── Carbon Calculation Service


<img width="470" height="399" alt="Screenshot 2025-11-03 221312" src="https://github.com/user-attachments/assets/ce3357bb-b4f0-458a-a017-df7333ebf5d7" />





---


## Database Schema

The project uses **PostgreSQL** with **Prisma ORM** for schema management.

### **User**
| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | User’s name |
| email | String | Unique email |
| password | String | Hashed password |
| projects | Relation | Linked projects |
| createdAt | DateTime | Account creation date |


### **Project**
| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | Project name |
| description | String | Description text |
| ownerId | Int | References User |
| sites | Relation | Linked sites |
| createdAt | DateTime | Timestamp |


### **Site**
| Field | Type | Description |
|-------|------|-------------|
| id | Int | Primary key |
| name | String | Site name |
| vegetationType | String | “forest”, “grassland”, “wetland”, “plantation” |
| projectId | Int | References Project |
| geometry | JSON | GeoJSON polygon data |
| areaSqMeters | Float | Calculated using turf.js |
| carbonEstimate | Float | Estimated carbon capture (tons/year) |
| createdAt | DateTime | Timestamp |


---


## Local Setup Guide

### **1. Clone the Repositories**


#### https://github.com/Shusampal/darukaa-backend
#### https://github.com/Shusampal/darukaa-frontend


## Setup backend:

#### You must have local postgresql



### Install dependencies:


npm install



### Create .env file:


DATABASE_URL="your_postgres_url"
JWT_SECRET="change_this_fast"
PORT=8080
CARBON_PER_SQKM=200



### Run the backend:


npm start





## Setup Frontend



### Install dependencies:


npm install


### Create .env file:


VITE_API_BASE=http://localhost:8080/api
VITE_MAPBOX_TOKEN=your_mapbox_token


### Run the frontend:


npm run dev



---


## Analytics provided

Total Site Area (sq.m), Estimated CO₂ Offset (tons/year) , Progress %





