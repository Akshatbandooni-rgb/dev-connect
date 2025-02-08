# **📌 Thought Process for Using Methods and Middleware in Mongoose & Express**

When designing an authentication system, it's important to understand **when and why** to use **schema methods, middleware, static methods, and express middleware**. Below is a structured approach to decide the best use case.

---

## **🛠️ Mongoose Methods & Middleware: When and Why?**

### **🔹 Pre-Save Middleware (`pre('save')`)**

✅ **When to use?**  
- When you need to modify data **before saving it to the database**.
- **Example Use Case:** Hashing passwords before storing them.

✅ **Why use it?**  
- Ensures passwords are always stored securely.
- Avoids manual hashing in multiple places.

✅ **Implementation:**


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


🔥 **Thought Process:**  
- You never want to store plain text passwords.  
- Instead of manually hashing them in every signup route, **automate it using `pre('save')`**.  
- This keeps your code **clean, secure, and reusable**.

---

### **🔹 Instance Methods (`userSchema.methods`)**

✅ **When to use?**  
- When you want **methods that operate on an instance of a model** (i.e., a single user document).
- **Example Use Case:**  
  - Comparing hashed passwords during login.
  - Generating a JWT token for authentication.

✅ **Why use it?**  
- Provides reusable functions for user objects.
- Encapsulates logic within the model.

✅ **Implementation:**


userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, "your_secret_key", { expiresIn: "1h" });
};


🔥 **Thought Process:**  
- Every user document should have a way to validate passwords.  
- Instead of implementing it in the login route, **attach it to the schema** so it's reusable across the application.  
- Same applies to token generation—every user should be able to generate their JWT.

---

### **🔹 Static Methods (`userSchema.statics`)**

✅ **When to use?**  
- When you need **methods that work on the entire collection** instead of individual documents.
- **Example Use Case:**  
  - Finding a user by email.

✅ **Why use it?**  
- Helps **abstract database queries** into reusable functions.
- Avoids duplicate code across controllers.

✅ **Implementation:**


userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};


🔥 **Thought Process:**  
- Instead of writing `User.findOne({ email })` every time in different places,  
- Create a **static method** to keep the logic centralized and maintainable.

---

### **🔹 Authentication Middleware (Custom Middleware)**

✅ **When to use?**  
- When you want to **protect certain routes** from unauthenticated users.
- **Example Use Case:**  
  - Checking if a user has a valid JWT token before accessing a protected route.

✅ **Why use it?**  
- Ensures only logged-in users can access protected resources.
- Reduces code duplication across multiple routes.

✅ **Implementation:**


const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "your_secret_key");
    req.user = decoded; // Attach user data to request object
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};


🔥 **Thought Process:**  
- If you have multiple protected routes, instead of checking authentication inside every route,  
- Create a **single middleware function** that does this check and attach it to the necessary routes.

✅ **Example Usage in Routes:**


app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome user ${req.user.email}` });
});



### **1️⃣ Signup (`POST /signup`)**
- **User sends signup data.**
- `pre('save')` middleware **hashes the password** before saving.
- **User is stored in the database**.

### **2️⃣ Login (`POST /login`)**
- **User enters credentials.**
- `findByEmail(email)` **fetches user from DB**.
- `comparePassword()` **checks if password is correct**.
- `generateToken()` **creates a JWT token**.
- **JWT is stored in cookies**.

### **3️⃣ Accessing a Secure Route (`GET /dashboard`)**
- `authMiddleware` **checks JWT token**.
- If valid, **user is granted access**.
- If invalid, **request is rejected**.

### **4️⃣ Logout (`POST /logout`)**
- `clearCookie()` **removes JWT token** from browser.
- **User is logged out**.

---

## **🔥 Summary: Thought Process to Follow**

1️⃣ **Think about where logic should be placed**  
   - If it’s related to **modifying data before saving**, use **pre-save middleware**.  
   - If it’s an **operation on a single document**, use **instance methods**.  
   - If it’s an **operation on the entire collection**, use **static methods**.  

2️⃣ **Think about reusability**  
   - Instead of writing authentication checks in every route, **use middleware**.  
   - Instead of writing `User.findOne({ email })` everywhere, **use a static method**.
