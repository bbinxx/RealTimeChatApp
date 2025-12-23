# RealTimeChatApp

A robust real-time chat application built with Node.js, Express, Socket.IO, and Firebase. This application features user authentication, persistent chat history using Cloud Firestore, profile management, and comprehensive server-side logging.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.IO.
- **Persistent Storage**: Chat history and user data are securely stored in Firebase Cloud Firestore.
- **Authentication**: Secure user Sign Up, Login, and Logout functionality powered by Firebase Authentication.
- **Profile Management**: Users can update their display names and view profile details.
- **Session Security**: Server-side session validation to prevent unauthorized access and cross-user modifications.
- **Logging**: Integrated centralized logging utility for tracking requests, errors, and application events.

## Prerequisites

Before running the application, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

You also need a Firebase project set up with Authentication (Email/Password) and Cloud Firestore enabled.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bbinxx/RealTimeChatApp.git
   ```

2. Navigate to the project directory:
   ```bash
   cd RealTimeChatApp
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory and add your Firebase configuration and session secret. You can obtain these details from your Firebase Project Settings.

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
SESSION_SECRET=your_secure_session_secret_key
```

## Running the Application

### Development Mode
Use `nodemon` to watch for file changes during development:
```bash
npm run dev
```

### Production Mode
Start the application normally:
```bash
npm start
```

Access the application in your browser at `http://localhost:3000`.

## Project Structure

```plaintext
RealTimeChatApp/
├── controller/         # Application logic (Chat, Profile)
│   ├── chatController.js
│   └── profileController.js
├── models/             # Database interaction layers
│   ├── firestore_services.js
│   └── user_service.js
├── public/             # Static assets (CSS, client-side JS)
│   ├── css/
│   └── js/
├── routes/             # Express routes
│   └── profileRoute.js
├── utils/              # Utility functions
│   └── logger.js
├── views/              # EJS templates
│   ├── chat.ejs
│   ├── error.ejs
│   ├── home.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   └── reg.ejs
├── app.js              # Main application entry point
├── firebase_config.js  # Firebase initialization
├── package.json        # Project metadata and dependencies
└── README.md           # Documentation
```

## Troubleshooting

- **Broadcast Storms**: If you see duplicated messages or loops, check `chatController.js` to ensure the logic distinguishes between historical data load and new message events.
- **Session Errors**: If you encounter "Session mismatch" errors, ensure you are logged in as the user you are trying to modify. The app prevents one valid session from modifying another user's data.
- **Connection Issues**: Ensure your `.env` file contains valid Firebase credentials and that your internet connection is active.
