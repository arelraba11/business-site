# Business Site – Backend

A Node.js + Express backend for a small business management system.  
Includes user authentication, role-based authorization, posts management, appointments system, and business details.

---

## Features
- **User Management**  
  - Register new users (default: `client` role).  
  - Login with JWT authentication.  
  - Role-based access control (`client` vs `admin`).  

- **Posts**  
  - Admins can create and delete posts.  
  - Everyone can view posts.  

- **Appointments**  
  - Clients can create, view, and cancel their own appointments.  
  - Admins can view all appointments and approve/reject them.  

- **Business Info**  
  - Admins can set/update business services & prices.  
  - Clients can only view business info.  

---

## Project Structure
```
business-site/
│── controllers/   # Logic for each resource
│── middleware/    # Authentication & authorization
│── models/        # Mongoose schemas
│── routes/        # API routes
│── server.js      # App entry point
```

---

## Tech Stack
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT (JSON Web Token) for authentication  

---

## API Endpoints

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

## Getting Started
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

---

## Status
All backend functionality tested via `curl`:  
- User login/register  
- Post creation/deletion  
- Appointment booking/approval/cancellation  
- Business info update & retrieval  

The backend is **stable and production-ready**.