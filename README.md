# Smart Campus Energy Management System

A full-stack web application for monitoring, analyzing, and managing energy consumption across campus buildings, floors, rooms, and electrical devices.

---

## 📌 Project Overview

The **Smart Campus Energy Management System** helps administrators:

- Track buildings, floors, rooms, and devices
- Calculate daily energy consumption (kWh)
- Estimate electricity costs
- Visualize energy trends
- Identify high-consuming buildings
- Generate energy reports

The system is built with **React, Spring Boot, PostgreSQL, Docker, and AWS-ready deployment**.

---

## 🚀 Features

### Authentication
- Admin login
- Protected dashboard access

### Dashboard
- Total buildings
- Total floors
- Total rooms
- Total devices
- Daily energy consumption
- Daily cost
- Monthly cost
- Weekly energy trend chart
- High consumption alerts
- Top consuming building
- Building energy ranking

### Management Modules
- Building management
- Floor management
- Room management
- Device management (Add, Edit, Delete)

### Reports
- Total installed power
- Total daily energy
- Daily cost
- Monthly cost
- Building-wise energy consumption

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Bootstrap 5
- Chart.js
- Axios
- React Icons

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- REST API

### Database
- PostgreSQL

### DevOps / Deployment
- Docker
- Docker Compose
- Nginx
- AWS EC2

---

## 🏗️ System Architecture

```text
+-------------------+
|   React Frontend  |
|   (Nginx :80)     |
+---------+---------+
          |
          | REST API
          v
+---------+---------+
| Spring Boot API   |
|      :8080        |
+---------+---------+
          |
          | JPA
          v
+---------+---------+
| PostgreSQL DB     |
+-------------------+
```

---

## 🗄️ Database Design

### Building
- id
- name

### Floor
- id
- name
- building_id

### Room
- id
- name
- floor_id

### Device
- id
- building
- room
- deviceName
- powerRating
- hoursPerDay

---

## ⚡ Energy Calculation

### Daily Energy

```text
Energy (kWh) = (Power Rating × Hours Per Day) / 1000
```

### Daily Cost

```text
Daily Cost = Total Energy × Tariff
```

### Monthly Cost

```text
Monthly Cost = Daily Cost × 30
```

---

## 📂 Project Structure

```text
smart-campus-energy/
│
├── src/                        # React frontend
├── nginx/                      # Nginx configuration
├── energy-management/          # Spring Boot backend
│   └── src/main/java/
├── docker-compose.yml
└── README.md
```

---

## ▶️ Running Locally

### Prerequisites
- Docker Desktop

### Start the application

```bash
docker compose up -d --build
```

### Open in browser

- Frontend: http://127.0.0.1
- Backend: http://127.0.0.1:8080

---

## 🔌 API Endpoints

### Dashboard
- `GET /api/dashboard`

### Reports
- `GET /api/reports`
- `GET /api/reports/building-energy`

### Buildings
- `GET /api/buildings`
- `POST /api/buildings`

### Floors
- `GET /api/floors`
- `POST /api/floors`

### Rooms
- `GET /api/rooms`
- `POST /api/rooms`

### Devices
- `GET /api/devices`
- `POST /api/devices`
- `PUT /api/devices/{id}`
- `DELETE /api/devices/{id}`

---

## 📊 Dashboard Analytics

The dashboard provides:

- Real-time campus statistics
- Energy trend visualization
- Consumption alerts
- Building ranking by energy usage

### Alert Logic

A building is marked **Critical** when:

- It contributes more than **35%** of total campus energy
- And its consumption is at least **5 kWh/day**

---

## 🐳 Docker Services

### Frontend
- React + Nginx
- Port: 80

### Backend
- Spring Boot
- Port: 8080

### Database
- PostgreSQL
- Internal port: 5432

---

## ☁️ AWS Deployment

### Recommended Setup

- Ubuntu 24.04 EC2
- t3.micro
- Docker + Docker Compose

### Security Group

- 22 (SSH)
- 80 (HTTP)
- 8080 (API)

### Deploy

```bash
docker compose up -d --build
```

---

## 🧪 Testing

### Functional Tests
- Login
- CRUD operations
- Energy calculations
- Charts
- Alerts
- Reports

### Deployment Tests
- Docker build
- Container networking
- API connectivity

---

## 🐞 Challenges & Solutions

| Challenge | Solution |
|---|---|
| CORS errors | Configured `@CrossOrigin` |
| Docker build failures | Rebuilt containers |
| Chart.js fill warning | Registered `Filler` plugin |
| Network reset errors | Used `127.0.0.1` |
| Blank dashboard | Fixed API and state handling |

---

## 📈 Results

The system successfully:

- Centralizes energy monitoring
- Calculates energy and cost automatically
- Displays real-time analytics
- Identifies high-consuming buildings
- Supports cloud deployment

---

## 🔮 Future Improvements

- IoT smart meter integration
- Real-time power monitoring
- Email/SMS alerts
- Role-based access control
- PDF/Excel export
- Mobile application
- Machine learning prediction

---

## 🎤 Demonstration Flow

1. Login
2. Open Dashboard
3. Show statistics
4. Show weekly trend
5. Show top consuming building
6. Add a device
7. Return to Dashboard
8. Open Reports
9. Explain Docker & AWS deployment

---


---

## 📄 License

This project is developed for **academic and educational purposes**.
