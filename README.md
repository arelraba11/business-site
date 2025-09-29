# Business Site – Fullstack

A fullstack project containing a **Node.js + Express backend** and a **React frontend** for small business management.  
Includes user authentication, role-based authorization, posts management, appointments system, business details, and a React admin dashboard with multiple sections.

---

## Features
- **Backend**  
  - User Management  
    - Register new users (default: `client` role).  
    - Login with JWT authentication.  
    - Role-based access control (`client` vs `admin`).  
  - Posts  
    - Admins can create and delete posts.  
    - Everyone can view posts.  
  - Appointments  
    - Clients can create, view, and cancel their own appointments.  
    - Admins can view all appointments and approve/reject them.  
  - Business Info  
    - Admins can set/update business services & prices.  
    - Clients can only view business info.  

- **Frontend**  
  - React Admin Dashboard with tabs (Business Info, Appointments, Services, Posts).  
  - Clients can view business info, create appointments, and see posts.  
  - Admins can manage services, business info, approve/reject appointments, and create/delete posts.

---

## Project Structure

### Backend
```
business-site/
│── controllers/   # Logic for each resource
│── middleware/    # Authentication & authorization
│── models/        # Mongoose schemas
│── routes/        # API routes
│── server.js      # App entry point
```

### Frontend
```
frontend/
│── src/
    │── components/   # Reusable React components
    │── pages/        # Dashboard and page views
    │── styles/       # CSS files
│── public/
│── package.json
```

---

## Tech Stack
- **Backend**  
  - Node.js  
  - Express.js  
  - MongoDB + Mongoose  
  - JWT (JSON Web Token) for authentication  

- **Frontend**  
  - React.js  
  - CSS  
  - Axios (or fetch/apiRequest wrapper) for API calls  

---

## API Endpoints

The frontend interacts with the backend API endpoints using an `apiRequest` utility or similar Axios/fetch wrapper to handle requests and authentication tokens.

### Users
- `POST /api/users/register` → Register a new user  
- `POST /api/users/login` → Login and receive JWT  

### Posts
- `GET /api/posts` → Get all posts  
- `POST /api/posts` → Create post (**admin only**)  
- `DELETE /api/posts/:id` → Delete post (**admin only**)  

### Appointments
- `POST /api/appointments` → Create new appointment (**client**)  
- `GET /api/appointments/my` → Get client’s own appointments  
- `DELETE /api/appointments/:id` → Cancel appointment (client or admin)  
- `GET /api/appointments` → Get all appointments (**admin only**)  
- `PATCH /api/appointments/:id` → Approve/Reject appointment (**admin only**)  

### Business
- `POST /api/business` → Set business info (**admin only**)  
- `GET /api/business` → Get business info  

---

## Screenshots / UI Overview

*Add screenshots or UI overview images here to showcase the React dashboard and main features.*

---

## Getting Started

### Backend
1. Clone the repository:  
   ```bash
   git clone https://github.com/arelraba11/business-site.git
   cd business-site
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Add environment variables in `.env`:  
   ```
   MONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key
   PORT=4000
   ```

4. Run the server:  
   ```bash
   npm start
   ```

### Frontend
1. Navigate to the frontend directory:  
   ```bash
   cd frontend
   ```

2. Install dependencies:  
   ```bash
   npm install
   ```

3. Run the React development server:  
   ```bash
   npm start
   ```

---

## Status
Both backend and frontend tested locally. Stable for small business usage.