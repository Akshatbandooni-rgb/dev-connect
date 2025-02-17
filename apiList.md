# API Endpoints Documentation

This document lists all available API endpoints, their HTTP methods, descriptions, required parameters, and expected responses.

---

## 1. Authentication & User Management

### **POST /signup**
- **Description:** Creates a new user account.
- **Required Fields:** 
  - `firstName`
  - `lastName`
  - `email`
  - `age` 
  - `gender` 
  - `password` *(must be strong as per validation)*
- **Response:** 
  - **Success (201):** JSON with a success message and the created user data.
  - **Error (500):** JSON with an error message.

---

### **POST /login**
- **Description:** Logs in an existing user.
- **Required Fields:** 
  - `email`
  - `password`
- **Response:** 
  - **Success (200):** JSON with a welcome message. A JWT token is generated and sent as a cookie.
  - **Error (500):** JSON with an error message.

---

### **POST /logout**
- **Description:** Logs out the user.
- **Response:** 
  - **Success (200):** JSON with a logout confirmation message.

---

## 2. User Interaction Requests

### **POST /send/interested/:userId**
- **Description:** Sends an "interested" request to a specific user.
- **URL Parameter:**
  - `userId` – The ID of the user to whom the request is sent.
- **Response:** 
  - **Success (200):** JSON message confirming the request sent, e.g., "📩 Request sent to user `<userId>`".

---

### **POST /send/ignored/:userId**
- **Description:** Sends an "ignored" request for a specific user.
- **URL Parameter:**
  - `userId` – The ID of the user to be ignored.
- **Response:** 
  - **Success (200):** JSON message confirming the action, e.g., "🚫 Request ignored for user `<userId>`".

---

### **POST /review/accepted/:requestId**
- **Description:** Accepts a review request.
- **URL Parameter:**
  - `requestId` – The ID of the review request.
- **Response:** 
  - **Success (200):** JSON message confirming acceptance, e.g., "✅ Request `<requestId>` accepted".

---

### **POST /review/rejected/:requestId**
- **Description:** Rejects a review request.
- **URL Parameter:**
  - `requestId` – The ID of the review request.
- **Response:** 
  - **Success (200):** JSON message confirming rejection, e.g., "❌ Request `<requestId>` rejected".

---

## 3. User Profile Management

### **GET /view**
- **Description:** Retrieves the logged-in user's profile information.
- **Response:** 
  - **Success (200):** JSON containing the user's profile data.
  - **Error (400):** JSON with an error message.

---

### **PATCH /edit**
- **Description:** Updates the user's profile information.
- **Response:** 
  - **Success (200):** JSON message confirming the update, e.g., "✅ User profile updated successfully!".

---

### **PATCH /password**
- **Description:** Changes the user's password.
- **Response:** 
  - **Success (200):** JSON message confirming the password change, e.g., "🔐 Password updated successfully!".

---

## 4. User Connections & Feed

### **GET /connections**
- **Description:** Fetches the user's connections.
- **Response:** 
  - **Success (200):** JSON message, e.g., "🔗 User connections fetched".

---

### **GET /requests**
- **Description:** Fetches the user's requests.
- **Response:** 
  - **Success (200):** JSON message, e.g., "📥 User requests fetched".

---

### **GET /feed**
- **Description:** Retrieves the user feed.
- **Operation:** Fetches a list of users from the database.
- **Response:** 
  - **Success (200):** JSON containing the list of users.
  - **Error (400):** JSON with an error message.

---


