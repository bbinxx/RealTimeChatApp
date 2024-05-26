# Chat Application

A real-time chat application built using Node.js, Express, and Socket.IO.
Note:Lots of bugs exits . Still developing

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/bbinxx/RealTimeChatApp.git
    ```

2. Navigate to the project directory:
    ```sh
    cd RealTimeChatApp
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Usage

- Visit `http://localhost:3000` to access the application.
- Register a new account or log in with existing credentials.
- Navigate to the chat page to start messaging in real-time.

## Project Structure

```plaintext
chat-application/
├── controller/
│   └── chatController.js
├── models/
│   ├── firestore_services.js
│   └── user_service.js
├── public/
├── routes/
│   └── profileRoute.js
├── views/
│   ├── chat.ejs
│   ├── error.ejs
│   ├── home.ejs
│   ├── index.ejs
│   ├── login.ejs
│   └── reg.ejs
├── app.js
├── .env
├── package.json
└── README.md
