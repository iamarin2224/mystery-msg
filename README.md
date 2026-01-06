# Mystery Message

![Mystery Message Logo](https://res.cloudinary.com/dtifoskmg/image/upload/v1766647632/mystryMsg_j6rsk5.png)

## Overview

Mystery Message is a fun and interactive web platform that allows users to send and receive anonymous "mystery" messages. Users can create accounts, share unique links for receiving messages, and enjoy AI-generated suggestions to add creativity and surprise. Built with modern technologies, it emphasizes security, user experience, and seamless email integrations for verifications and notifications.

Visit the live site at [mysterymsg.online](https://mysterymsg.online).

Key features:
- Anonymous messaging system
- AI-powered message generation using Groq and Google AI models
- User authentication with email OTP verification and password reset
- Responsive dashboard for managing messages

## Tech Stack

- **Frontend/Backend**: Next.js (v14+), React (v18+), TypeScript
- **Authentication**: Next-Auth
- **Database**: MongoDB with Mongoose
- **Email**: Resend and React-Email for templated emails
- **AI Integration**: Groq and Google AI using Vercel AI SDK
- **Styling**: Tailwind CSS, Radix UI, Lucide React Icons
- **Forms & Validation**: React Hook Form, Zod
- **Other**: Axios for API calls, Day.js for date handling, Sonner for toasts, Embla Carousel for sliders

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB instance (local or cloud, e.g., MongoDB Atlas)
- Accounts/API keys for:
  - Resend (for emails)
  - Groq and/or Google AI (for AI features)
  - Next-Auth providers (e.g., Google, if using OAuth)

### Installation

1. Clone the repository: `git clone https://github.com/iamarin2224/mystery-msg.git`
2. Install dependencies: `npm install`
3. Set up environment variables: Create a `.env.local` file in the root directory and add the following (replace with your values):
- MONGODB_URI=mongodb://localhost:27017/mystery-msg
- NEXTAUTH_SECRET=your-secret-key
- NEXTAUTH_URL=http://localhost:3000
- RESEND_API_KEY=your-resend-key
- GROQ_API_KEY=your-groq-key
- GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key
4. Run the development server: `npm run dev`
Open [http://localhost:3000](http://localhost:3000) in your browser.

Deploy easily to Vercel (recommended for Next.js apps).

## Usage

- **Sign Up/Sign In**: Create an account or log in via the homepage.
- **Verification**: Check your email for OTP codes during registration or password reset.
- **Dashboard**: View and manage received messages
- **Shareable Anonymous Inbox**: Users get a unique public link from their dashboard where anyone can anonymously submit messages via a public form, which are then privately accessible to the user.
- **AI Features**: Use integrated AI to generate mystery message ideas or enhancements.

## Contributing

Contributions are welcome! Please fork the repo, create a feature branch, and submit a pull request. Ensure code is linted with `npm run lint`.

## Acknowledgments

- Built by Arin
- Inspired by anonymous messaging platforms with an AI twist

Made with ❤️ by Arin