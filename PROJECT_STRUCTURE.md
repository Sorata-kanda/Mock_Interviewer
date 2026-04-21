# 📁 Project Structure Overview

## Current Project Structure

```
your-project/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   │
│   ├── (root)/
│   │   ├── interview/                    ← NEW: Main interview system
│   │   │   ├── create/
│   │   │   │   └── page.tsx             ← Create interview form
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx             ← Chat interview page
│   │   │   │   └── feedback/
│   │   │   │       └── page.tsx         ← Feedback display (EXACT copy)
│   │   │   └── page.tsx                 ← Interview dashboard
│   │   │
│   │   ├── interview-voice/              ← PRESERVED: Original voice UI
│   │   │   └── page.tsx                 ← Voice interview (proof of concept)
│   │   │
│   │   ├── interview-docs/
│   │   │   └── page.tsx                 ← Your presentation slides
│   │   │
│   │   ├── layout.tsx
│   │   └── page.tsx                     ← Homepage
│   │
│   ├── api/
│   │   ├── interview/
│   │   │   └── create/
│   │   │       └── route.ts             ← NEW: Interview creation API
│   │   └── vapi/
│   │       └── generate/
│   │           └── route.ts             ← Existing Vapi API
│   │
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── Agent.tsx                         ← Original voice agent (preserved)
│   ├── ChatInterview.tsx                 ← NEW: Chat interview component
│   ├── AuthForm.tsx
│   ├── InterviewCard.tsx
│   ├── DisplayTechIcons.tsx
│   ├── ProjectShowcase.tsx               ← Your presentation
│   └── ui/
│       ├── button.tsx
│       ├── form.tsx
│       └── ...
│
├── lib/
│   ├── actions/
│   │   ├── auth.action.ts               ← Authentication
│   │   └── general.action.ts            ← NEW: Interview & feedback actions
│   ├── utils.ts
│   └── vapi.sdk.ts                      ← Vapi SDK (preserved)
│
├── constants/
│   └── index.ts                         ← Feedback schema, mappings
│
├── types/
│   └── index.d.ts                       ← TypeScript interfaces
│
├── firebase/
│   ├── admin.ts                         ← Firebase Admin SDK
│   └── client.ts                        ← Firebase Client SDK
│
├── public/
│   ├── ai-avatar.png
│   ├── user-avatar.png
│   ├── logo.svg
│   └── ...
│
├── .env.local                           ← Environment variables
├── IMPLEMENTATION_SUMMARY.md            ← This guide
└── PROJECT_STRUCTURE.md                 ← You are here
```

---

## 🔄 User Journey Flow

### **1. Homepage** (`/`)

```
┌─────────────────────────────────────┐
│  Prepwise Homepage                  │
│                                     │
│  [Start an Interview] ──────────┐  │
│                                  │  │
│  Your Interviews:                │  │
│  - Past interview cards          │  │
└──────────────────────────────────┼──┘
                                   │
                                   ▼
```

### **2. Create Interview** (`/interview/create`)

```
┌─────────────────────────────────────┐
│  Create New Interview               │
│                                     │
│  Job Role: [Frontend Developer]    │
│  Level: [Junior ▼]                 │
│  Type: [Technical ▼]               │
│  Tech Stack: [React, TypeScript]   │
│  Questions: [5] ────────            │
│                                     │
│  [Create Interview] ────────────┐  │
└──────────────────────────────────┼──┘
                                   │
                    API generates  │
                    questions      │
                                   ▼
```

### **3. Chat Interview** (`/interview/[id]`)

```
┌─────────────────────────────────────┐
│  Frontend Developer Interview       │
│  [React] [TypeScript] [Next.js]    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🤖 AI: What is React?       │   │
│  │                             │   │
│  │         You: React is...  👤│   │
│  │                             │   │
│  │ 🤖 AI: Thank you. Next...  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Type your answer...] [Send]      │
│                                     │
│  Question 3 of 5  ●●●○○            │
└──────────────────────────────────┼──┘
                                   │
                    All questions  │
                    answered       │
                                   ▼
```

### **4. Feedback** (`/interview/[id]/feedback`)

```
┌─────────────────────────────────────┐
│  Feedback - Frontend Developer      │
│                                     │
│  ⭐ Overall: 78/100  📅 Apr 22     │
│                                     │
│  Final Assessment:                  │
│  "You demonstrated solid..."        │
│                                     │
│  Breakdown:                         │
│  1. Communication Skills (80/100)   │
│     "Clear and articulate..."       │
│  2. Technical Knowledge (75/100)    │
│     "Good understanding..."         │
│  ...                                │
│                                     │
│  Strengths:                         │
│  • Strong React fundamentals        │
│  • Clear communication              │
│                                     │
│  Areas for Improvement:             │
│  • Deepen TypeScript knowledge      │
│  • Practice system design           │
│                                     │
│  [Back to Interviews] [New Interview]│
└─────────────────────────────────────┘
```

---

## 🗄️ Database Collections

### **Firestore Structure:**

```
firestore/
├── users/
│   └── {userId}/
│       ├── name: string
│       ├── email: string
│       └── profileURL?: string
│
├── interviews/
│   └── {interviewId}/
│       ├── userId: string
│       ├── role: string
│       ├── level: string
│       ├── type: string
│       ├── techstack: string[]
│       ├── questions: string[]
│       ├── finalized: boolean
│       └── createdAt: string
│
└── feedback/
    └── {feedbackId}/
        ├── interviewId: string
        ├── userId: string
        ├── totalScore: number
        ├── categoryScores: [...]
        ├── strengths: string[]
        ├── areasForImprovement: string[]
        ├── finalAssessment: string
        └── createdAt: string
```

---

## 🎯 Key Files to Understand

### **1. ChatInterview.tsx** - The Heart of the System

```typescript
// Manages:
- Chat UI and message display
- Question progression
- User input handling
- Transcript building
- Feedback generation trigger
```

### **2. general.action.ts** - Server Actions

```typescript
// Functions:
- createInterview()      → Save interview to DB
- createFeedback()       → Generate AI feedback
- getInterviewById()     → Fetch interview
- getFeedbackByInterviewId() → Fetch feedback
- getInterviewsByUserId() → User's history
```

### **3. /api/interview/create/route.ts** - Question Generation

```typescript
// Process:
1. Receive form data
2. Call Gemini AI with prompt
3. Parse generated questions
4. Save to Firestore
5. Return interview ID
```

### **4. Feedback Page** - Display Results

```typescript
// Shows:
- Overall score
- 5 category breakdowns
- Strengths list
- Improvements list
- Final assessment
- Action buttons
```

---

## 🔐 Authentication Flow

```
User visits protected route
        ↓
Root layout checks auth
        ↓
    Authenticated?
    ├─ Yes → Show page
    └─ No  → Redirect to /sign-in
```

---

## 🎨 Styling System

### **Global Styles** (`app/globals.css`)

- Custom utility classes
- Component-specific styles
- Animation keyframes
- Color variables

### **Key Classes:**

```css
.btn-primary        → Primary action button
.btn-secondary      → Secondary button
.dark-gradient      → Dark background gradient
.card-border        → Card with gradient border
.section-feedback   → Feedback page layout
.call-view          → Interview view layout
```

---

## 🚀 Development Workflow

### **To Add a New Feature:**

1. **Create types** in `types/index.d.ts`
2. **Add server action** in `lib/actions/`
3. **Create API route** (if needed) in `app/api/`
4. **Build component** in `components/`
5. **Create page** in `app/(root)/`
6. **Test flow** end-to-end

### **To Modify Feedback:**

1. Update `feedbackSchema` in `constants/index.ts`
2. Modify prompt in `general.action.ts`
3. Update display in `feedback/page.tsx`

---

## 📦 Dependencies

### **Key Packages:**

```json
{
  "@google/generative-ai": "^0.21.0", // Gemini AI
  "ai": "^4.0.0", // Vercel AI SDK
  "@ai-sdk/google": "^1.0.0", // Google AI SDK
  "firebase-admin": "^13.0.0", // Firebase Admin
  "firebase": "^11.1.0", // Firebase Client
  "dayjs": "^1.11.13", // Date formatting
  "zod": "^3.24.1", // Schema validation
  "lucide-react": "^0.468.0", // Icons
  "next": "^15.1.4", // Next.js
  "react": "^19.0.0" // React
}
```

---

## 🎓 For Your Presentation

### **Demo Flow:**

1. **Show Original Intent:**
   - Navigate to `/interview-voice`
   - Show voice UI with Agent component
   - Explain Vapi workflow deprecation

2. **Show Adaptation:**
   - Navigate to `/interview/create`
   - Create a sample interview
   - Complete chat interview
   - Show generated feedback

3. **Highlight Key Points:**
   - Same AI analysis (Gemini)
   - Same feedback structure
   - Same database design
   - Better user control
   - No external dependencies

---

## ✅ Checklist Before Demo

- [ ] Firebase configured
- [ ] Gemini API key added
- [ ] Dev server running
- [ ] Test user account created
- [ ] Sample interview completed
- [ ] Feedback generated successfully
- [ ] All routes accessible
- [ ] No console errors

---

**You're all set! 🎉**
