# Interview Test REST API

A RESTful API built with TypeScript, Express, and MongoDB for user registration, profile management, and image gallery functionality.

## Features
- User registration and authentication
- Profile edit/update
- Image upload (gallery)
- Public/private image visibility
- View user profiles and images
- Image deletion

## Technology Stack & Key Integrations

### Main Packages & Versions
- **express**: ^5.1.0 — Web server framework
- **typescript**: ^5.8.3 — TypeScript support
- **mongoose**: ^8.16.4 — MongoDB object modeling
- **jsonwebtoken**: ^9.0.2 — JWT authentication
- **bcryptjs**: ^3.0.2 — Password hashing
- **multer**: ^2.0.2 — File uploads (memory storage)
- **cloudinary**: ^2.7.0 — Cloud image hosting
- **swagger-jsdoc**: ^6.2.8, **swagger-ui-express**: ^5.0.1 — API docs
- **winston**: ^3.17.0 — Logging
- **dotenv**: ^17.2.0 — Environment variables
- **eslint**, **prettier**: Linting & formatting

### Imports & Structure
- Modular code: routes, controllers, models, middlewares, utils
- Main imports in `src/app.ts`:
  - Express, dotenv, routes, DB config, Swagger, Winston logger
  - Swagger UI served at `/api-docs`
- Models (`User`, `Image`) imported in controllers/routes
- Cloudinary and Multer used for image upload
- Winston logger imported in controllers and middleware

### Cloudinary for Image Upload
- Configured in `src/utils/cloudinary.ts` using environment variables:
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Images are uploaded via Multer (memory storage) and then sent to Cloudinary
- Uploaded images are stored in MongoDB with their Cloudinary URL and public ID
- Example usage: see `uploadImage` in `src/controllers/imageController.ts`

### Swagger API Documentation
- OpenAPI 3.0 spec in `api-swagger.yaml` (and `src/api-swagger.yaml`)
- Swagger is set up in `src/config/swagger.ts` and served at `/api-docs` using `swagger-ui-express`

### Winston Logging
- Configured in `src/config/winston.ts`
- Logs to console (colorized in development) and to files:
  - `logs/combined.log` (all logs)
  - `logs/error.log` (errors only)
- Used throughout the app for info, warning, and error logs

---

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with your MongoDB URI and JWT secret:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Linting & Formatting
- Lint: `npm run lint`
- Format: `npm run format`
