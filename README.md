# 🤖 Prepwise - AI-Powered Mock Interview Platform

An intelligent interview preparation platform that uses AI to generate personalized interview questions and provide detailed performance feedback. Built with Next.js 15, Firebase, and Google Gemini AI.

![Next.js](https://img.shields.io/badge/Next.js-15.1.4-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-11.1.0-orange?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [Environment Variables](#-environment-variables)
- [Firebase Setup](#-firebase-setup)
- [API Routes](#-api-routes)
- [Development Notes](#-development-notes)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Features

- **AI-Generated Questions** - Google Gemini AI creates personalized interview questions based on role, experience level, and tech stack
- **Chat-Based Interviews** - Interactive text-based interview experience with real-time question progression
- **Intelligent Feedback** - Comprehensive AI-powered performance analysis with scores and actionable insights
- **User Authentication** - Secure Firebase authentication with session cookies
- **Interview History** - Track all past interviews and feedback in your personal dashboard
- **Interactive Presentation** - 15-slide showcase explaining the project with electron cursor effects

### 📊 Feedback System

- Overall performance score (0-100)
- 5 category breakdowns:
  - Communication Skills
  - Technical Knowledge
  - Problem Solving
  - Cultural Fit
  - Confidence and Clarity
- Detailed strengths and areas for improvement
- Comprehensive final assessment

### 🎨 UI/UX Features

- Modern, responsive design with Tailwind CSS
- Dark theme with gradient accents
- Smooth animations and transitions
- Keyboard navigation support
- Auto-hiding navigation controls
- Deterministic interview cover images

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend

- **Next.js API Routes** - Serverless functions
- **Firebase Admin SDK** - Server-side Firebase operations
- **Google Gemini AI** - Question generation and feedback analysis
- **Vercel AI SDK** - AI integration utilities

### Database & Auth

- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User management
- **Session Cookies** - Secure authentication

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **dayjs** - Date formatting

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Google Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd prepwise
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Firebase Admin SDK
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=your_client_email

   # Google Gemini AI
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

   # Vapi (Optional - for voice interview proof of concept)
   NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_token
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
prepwise/
├── app/
│   ├── (auth)/                    # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/                    # Protected routes
│   │   ├── interview/             # Interview system
│   │   │   ├── create/           # Create interview form
│   │   │   └── [id]/             # Interview detail & feedback
│   │   ├── interview-voice/       # Original voice UI (preserved)
│   │   └── interview-docs/        # Project presentation
│   ├── api/                       # API routes
│   │   └── interview/
│   │       └── create/           # Question generation API
│   └── globals.css               # Global styles
│
├── components/
│   ├── ChatInterview.tsx         # Chat interview component
│   ├── InterviewCard.tsx         # Interview card display
│   ├── ProjectShowcase.tsx       # Presentation slides
│   ├── Agent.tsx                 # Voice agent (preserved)
│   └── ui/                       # UI components
│
├── lib/
│   ├── actions/
│   │   ├── auth.action.ts        # Authentication logic
│   │   └── general.action.ts     # Interview & feedback logic
│   ├── utils.ts                  # Utility functions
│   └── vapi.sdk.ts              # Vapi SDK (preserved)
│
├── firebase/
│   ├── admin.ts                  # Firebase Admin SDK
│   └── client.ts                 # Firebase Client SDK
│
├── constants/
│   └── index.ts                  # Constants & schemas
│
├── types/
│   └── index.d.ts               # TypeScript definitions
│
└── public/                       # Static assets
```

---

## 🔄 How It Works

### 1. User Registration & Login

```
User signs up → Firebase creates account → Session cookie set → Redirect to dashboard
```

### 2. Create Interview

```
Fill form (role, level, tech stack)
    ↓
API calls Gemini AI
    ↓
AI generates personalized questions
    ↓
Save to Firestore
    ↓
Redirect to interview page
```

### 3. Take Interview

```
Start interview → AI asks first question
    ↓
User types answer → Submit
    ↓
AI acknowledges → Next question
    ↓
Repeat until all questions answered
    ↓
Generate feedback
```

### 4. View Feedback

```
Transcript sent to Gemini AI
    ↓
AI analyzes responses
    ↓
Generate structured feedback
    ↓
Save to Firestore
    ↓
Display comprehensive report
```

---

## 🔐 Environment Variables

| Variable                       | Description                 | Required |
| ------------------------------ | --------------------------- | -------- |
| `FIREBASE_PROJECT_ID`          | Firebase project ID         | ✅       |
| `FIREBASE_PRIVATE_KEY`         | Firebase Admin private key  | ✅       |
| `FIREBASE_CLIENT_EMAIL`        | Firebase Admin client email | ✅       |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google Gemini API key       | ✅       |
| `NEXT_PUBLIC_VAPI_WEB_TOKEN`   | Vapi web token (optional)   | ❌       |

---

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (Email/Password)

### 2. Get Admin SDK Credentials

1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Extract values for `.env.local`

### 3. Firestore Collections

The app uses three main collections:

#### `users`

```typescript
{
  name: string,
  email: string,
  profileURL?: string
}
```

#### `interviews`

```typescript
{
  userId: string,
  role: string,
  level: string,
  type: string,
  techstack: string[],
  questions: string[],
  finalized: boolean,
  createdAt: string
}
```

#### `feedback`

```typescript
{
  interviewId: string,
  userId: string,
  totalScore: number,
  categoryScores: Array<{
    name: string,
    score: number,
    comment: string
  }>,
  strengths: string[],
  areasForImprovement: string[],
  finalAssessment: string,
  createdAt: string
}
```

### 4. Create Composite Index (Optional but Recommended)

For better query performance, create a composite index:

- Collection: `interviews`
- Fields: `userId` (Ascending), `createdAt` (Descending)

---

## 🌐 API Routes

### `POST /api/interview/create`

Creates a new interview with AI-generated questions.

**Request Body:**

```json
{
  "role": "Frontend Developer",
  "level": "Junior",
  "type": "Technical",
  "techstack": ["React", "TypeScript"],
  "amount": 5
}
```

**Response:**

```json
{
  "success": true,
  "interviewId": "abc123",
  "questions": ["Question 1", "Question 2", ...]
}
```

---

## 💡 Development Notes

### Original Intent vs Current Implementation

**Original Plan:** Voice-based interviews using Vapi AI workflows

**Challenge:** Vapi deprecated their workflow feature during development

**Solution:** Adapted to chat-based interviews while maintaining:

- Same AI-powered question generation
- Same comprehensive feedback system
- Same database structure
- Better user control and accessibility

**Proof of Original Intent:** The voice interview UI is preserved at `/interview-voice`

### Key Design Decisions

1. **Pre-generated Questions** - Questions are generated when creating an interview (not during) for:
   - Faster interview experience
   - Consistent question set
   - Ability to review questions before starting

2. **In-Memory Sorting** - To avoid Firebase composite index requirement temporarily
   - Works fine for small datasets
   - Create index for production use

3. **Deterministic Cover Images** - Interview cards use hash-based image selection
   - Same interview always shows same image
   - Different interviews show different images

---

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

3. **Configure Environment Variables**
   - Add all variables from `.env.local`
   - Ensure Firebase credentials are properly formatted

### Post-Deployment

1. Update Firebase authorized domains
2. Create Firestore composite index
3. Test authentication flow
4. Test interview creation and feedback

---

## 🎓 For Academic Presentation

### Project Highlights

1. **Problem Solved:** Traditional interview prep lacks personalization and feedback
2. **Solution:** AI-powered platform with custom questions and detailed analysis
3. **Technologies:** Modern stack with Next.js, Firebase, and Google Gemini AI
4. **Adaptation:** Successfully pivoted from voice to chat when facing API limitations
5. **Results:** Fully functional interview platform with comprehensive feedback

### Demo Flow

1. Show original voice UI (`/interview-voice`)
2. Explain Vapi workflow deprecation
3. Demonstrate chat-based interview
4. Show AI-generated questions
5. Display comprehensive feedback
6. Highlight identical feedback structure

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend services
- [Google Gemini AI](https://ai.google.dev/) - AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Hosting platform

---

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact via email
- Check the documentation files:
  - `IMPLEMENTATION_SUMMARY.md`
  - `PROJECT_STRUCTURE.md`
  - `FIREBASE_INDEX_SETUP.md`

---

**Made with ❤️ for better interview preparation**
