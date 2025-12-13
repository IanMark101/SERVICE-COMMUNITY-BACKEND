# 0. Tech Stack Overview

This backend uses several modern technologies:

- **Node.js**: The JavaScript runtime that executes your backend code. It allows you to run JavaScript (and TypeScript) outside the browser, on the server.
- **Express**: A web framework for Node.js. It makes it easy to define routes, handle HTTP requests, and build APIs.
- **TypeScript**: A superset of JavaScript that adds static typing. It helps catch errors early and makes your code more maintainable and readable.
- **Prisma**: An ORM (Object-Relational Mapping) tool for working with your database in a type-safe way.
- **Other libraries**: e.g., `jsonwebtoken` for JWTs, `bcryptjs` for password hashing, `nodemailer` for email, etc.

**How they work together:**
- You write your backend code in TypeScript, using Express to define routes and middleware.
- Node.js runs your TypeScript (compiled to JavaScript) on the server.
- Prisma lets you interact with your database using TypeScript objects instead of raw SQL.
- TypeScript ensures type safety and better developer experience throughout the stack.

# Backend Flow Guide: service-community-backend

This document explains the structure and flow of your backend, focusing on how requests are handled from endpoint to database, with special attention to authentication, middleware, and the separation of concerns (routes, controllers, services, repositories).

---

## 1. Project Structure Overview

- **routes/**: Defines API endpoints and attaches middleware.
- **controllers/**: Handles HTTP request/response logic.
- **services/**: Contains business logic, orchestrates data operations.
- **repositories/**: Directly interacts with the database using Prisma.
- **middlewares/**: Functions that run before controllers (e.g., authentication, authorization).
- **prisma/**: Prisma schema and migrations.

---

## 2. Request Flow Example: Auth Endpoint

### Example: User Login (`POST /api/auth/login`)

#### a. Route
- File: `src/routes/auth.ts`
- Registers the endpoint and points to the controller:
  ```js
  router.post("/login", login);
  ```

#### b. Controller
- File: `src/controllers/authController.ts`
- Receives the request, extracts data, calls the service, and returns a response:
  ```js
  export const login = async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    // ...create JWT, send response
  }
  ```

#### c. Service
- File: `src/services/authService.ts`
- Contains business logic (e.g., password check, token creation):
  ```js
  export const authService = {
    async login(email, password) {
      const user = await userRepository.findByEmail(email);
      // ...check password, mark online, return user
    }
  }
  ```

#### d. Repository
- File: `src/repositories/userRepository.ts`
- Handles direct database queries using Prisma:
  ```js
  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }
  ```

---

## 3. Middleware: How Auth Works

- **File:** `src/middlewares/authMiddleware.ts`
- Checks for a valid JWT in the `Authorization` header.
- Decodes the token, attaches `userId` to the request, and checks if the user is banned.
- If valid, calls `next()` to continue to the controller; otherwise, returns an error.

**Example:**
```js
router.get("/me", authMiddleware, getMe);
```
- This means `/api/users/me` requires a valid token.

---

## 4. Sequence of a Protected Request

1. **Client** sends a request to a protected endpoint (e.g., `/api/users/me`).
2. **Route** attaches `authMiddleware` before the controller.
3. **authMiddleware** checks the token and user status.
4. If valid, **controller** runs and calls the **service**.
5. **Service** may call one or more **repositories** to fetch/update data.
6. **Controller** sends the response back to the client.

---

## 5. Token (JWT) Flow

- On login, a JWT is created with the user's ID and a 7-day expiration.
- The client stores this token (usually in localStorage or a cookie).
- For every protected request, the client sends the token in the `Authorization: Bearer <token>` header.
- The backend verifies the token in middleware before allowing access.

---

## 6. Example: Creating a New Endpoint

Suppose you want to add `GET /api/users/profile/:id`:

1. **Route:** Add to `src/routes/userRoutes.ts`:
   ```js
   router.get("/profile/:id", getUserProfile);
   ```
2. **Controller:** Add to `src/controllers/userController.ts`:
   ```js
   export const getUserProfile = async (req, res) => {
     const { id } = req.params;
     const profile = await userService.getUserProfile(id);
     res.json(profile);
   }
   ```
3. **Service:** Add to `src/services/userService.ts`:
   ```js
   async getUserProfile(id) {
     return userRepository.getUserProfile(id);
   }
   ```
4. **Repository:** Add to `src/repositories/userRepository.ts`:
   ```js
   async getUserProfile(id) {
     return prisma.user.findUnique({ where: { id } });
   }
   ```

---

## 7. Summary Table

| Layer        | Responsibility                        | Example File                        |
|--------------|---------------------------------------|-------------------------------------|
| Route        | Define endpoint, attach middleware    | `routes/auth.ts`                    |
| Middleware   | Pre-controller checks (auth, etc)     | `middlewares/authMiddleware.ts`      |
| Controller   | Handle req/res, call service          | `controllers/authController.ts`      |
| Service      | Business logic, orchestrate DB calls  | `services/authService.ts`            |
| Repository   | Direct DB access (Prisma)             | `repositories/userRepository.ts`     |

---

## 8. Tips
- Always use middleware for authentication/authorization.
- Keep controllers thin—put logic in services.
- Use repositories for all DB access (never query Prisma directly in controllers/services).
- Use environment variables for secrets and config.
- Document new endpoints and flows in `/docs` for your team.

---
