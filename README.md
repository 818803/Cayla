# Cayla - Am I Overreacting?

"Am I Overreacting?" is a private, AI-powered web app that helps teens make sense of emotional moments like arguments, awkward texts, or social drama. Users input a situation, and the app's AI, Cayla, breaks it down with empathy—showing their perspective, the other side, and what might be going on emotionally. 

The goal is clarity, not judgment—giving users a safe space to process feelings without needing a therapist or account.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Endpoints](#api-endpoints)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm (or yarn) installed on your machine.

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

## Running the Application

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

The application is organized as follows:

-   `src/app/`: Contains the main application logic using the Next.js App Router.
    -   `(home)/page.tsx`: The main landing page of the application.
    -   `chat/page.tsx`: The chat interface page where users interact with Cayla.
    -   `layout.tsx`: The root layout for the application, including global navigation.
    -   `api/chat/route.ts`: The API endpoint for the chat functionality.
-   `src/components/`: Contains reusable React components.
    -   `chatinterface.tsx`: The main component for the chat UI.
-   `src/lib/`: Contains the core logic for the AI assistant.
-   `public/`: Contains static assets like images and fonts.
-   `globals.css`: Global styles for the application.

## Features

-   **Homepage:** A landing page explaining the purpose of the app.
-   **AI Chat with Cayla:** A real-time chat interface to interact with the AI assistant, Cayla.
-   **Empathetic Analysis:** Cayla breaks down user-submitted situations with empathy.
-   **Privacy-Focused:** No accounts or sign-ups required.
-   **Dark Mode:** The application supports a dark mode theme.

## API Endpoints

-   `POST /api/chat`: The main endpoint for sending messages to Cayla.
    -   **Request Body:**
        ```json
        {
          "message": "Your message to the AI"
        }
        ```
    -   **Response:**
        ```json
        {
          "reply": "Cayla's response"
        }
        ```

---

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
