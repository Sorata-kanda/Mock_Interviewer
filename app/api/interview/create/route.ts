import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { createInterview } from "@/lib/actions/general.action";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { role, level, type, techstack, amount } = body;

    if (!role || !level || !type || !techstack || !amount) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const techStackString = Array.isArray(techstack)
      ? techstack.join(", ")
      : techstack;

    const prompt = `Generate exactly ${amount} interview questions for a ${level} ${role} position.

Tech Stack: ${techStackString}
Interview Type: ${type}

Requirements:
- Questions should be appropriate for ${level} level
- ${type === "Technical" ? "Focus on technical skills and problem-solving" : type === "Behavioral" ? "Focus on behavioral and situational questions" : "Mix of technical and behavioral questions"}
- Questions should be relevant to the tech stack: ${techStackString}
- Keep questions clear and concise
- No special characters that would break text-to-speech
- Return ONLY the questions, one per line, numbered

Format:
1. [Question 1]
2. [Question 2]
...`;

    // Try multiple models with retry logic
    const models = ["models/gemini-2.5-flash", "models/gemini-1.5-flash", "models/gemini-1.5-pro"];
    let questions: string[] = [];
    let lastError: any = null;

    for (const modelName of models) {
      try {
        console.log(`Trying model: ${modelName}`);
        
        // Generate questions using Google Gemini with retry
        const genAI = new GoogleGenerativeAI(
          process.env.GOOGLE_GENERATIVE_AI_API_KEY!
        );
        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Parse questions from response
        questions = text
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => line.replace(/^\d+\.\s*/, "").trim())
          .filter((q) => q.length > 10);

        if (questions.length >= amount) {
          console.log(`Successfully generated questions with model: ${modelName}`);
          break; // Success! Exit the loop
        }
      } catch (error: any) {
        console.error(`Error with model ${modelName}:`, error.message);
        lastError = error;
        
        // If it's a 503 error, wait a bit before trying next model
        if (error.message?.includes("503") || error.message?.includes("high demand")) {
          console.log("Waiting 2 seconds before trying next model...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        continue; // Try next model
      }
    }

    // If no model worked, try fallback questions
    if (questions.length === 0) {
      console.log("All models failed, using fallback questions");
      questions = generateFallbackQuestions(role, level, type, techStackString, amount);
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: `Failed to generate questions. Last error: ${lastError?.message || "Unknown error"}. Please try again in a few minutes.` },
        { status: 500 }
      );
    }

    // Create interview in database
    const { success, interviewId } = await createInterview({
      userId: user.id,
      role,
      level,
      type,
      techstack: Array.isArray(techstack) ? techstack : [techstack],
      questions: questions.slice(0, amount),
    });

    if (success && interviewId) {
      return NextResponse.json({
        success: true,
        interviewId,
        questions: questions.slice(0, amount),
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to create interview" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in create interview API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Fallback questions when AI is unavailable
function generateFallbackQuestions(role: string, level: string, type: string, techStack: string, amount: number): string[] {
  const baseQuestions = {
    "Frontend Developer": [
      "What is the difference between let, const, and var in JavaScript?",
      "Explain the concept of React hooks and give an example of useState.",
      "How do you optimize the performance of a React application?",
      "What is the difference between server-side rendering and client-side rendering?",
      "Describe how you would implement responsive design in a web application.",
      "What are the benefits of using TypeScript over JavaScript?",
      "Explain the concept of CSS Grid vs Flexbox and when to use each.",
      "How do you handle state management in a large React application?",
      "What is the purpose of a bundler like Webpack or Vite?",
      "Describe your approach to testing frontend applications."
    ],
    "Backend Developer": [
      "Explain the difference between SQL and NoSQL databases.",
      "What is RESTful API design and what are its principles?",
      "How do you handle authentication and authorization in web applications?",
      "Describe the concept of microservices architecture.",
      "What is database indexing and why is it important?",
      "How do you ensure data security in backend applications?",
      "Explain the concept of caching and different caching strategies.",
      "What is the difference between synchronous and asynchronous programming?",
      "How do you handle error handling and logging in backend services?",
      "Describe your approach to API versioning."
    ],
    "Full Stack Developer": [
      "How do you ensure consistency between frontend and backend data?",
      "Describe your approach to full-stack application architecture.",
      "What is your preferred tech stack and why?",
      "How do you handle real-time communication between client and server?",
      "Explain the concept of CI/CD in full-stack development.",
      "How do you approach database design for a new application?",
      "What are the security considerations in full-stack development?",
      "How do you optimize the performance of a full-stack application?",
      "Describe your testing strategy for full-stack applications.",
      "How do you handle deployment and scaling of full-stack applications?"
    ]
  };

  const behavioralQuestions = [
    "Tell me about a challenging project you worked on and how you overcame the difficulties.",
    "Describe a time when you had to learn a new technology quickly.",
    "How do you handle tight deadlines and pressure?",
    "Tell me about a time when you disagreed with a team member. How did you resolve it?",
    "Describe your approach to code reviews and giving feedback to colleagues.",
    "How do you stay updated with the latest technology trends?",
    "Tell me about a mistake you made in a project and what you learned from it.",
    "How do you prioritize tasks when working on multiple projects?",
    "Describe a time when you had to explain a technical concept to a non-technical person.",
    "What motivates you as a developer and what are your career goals?"
  ];

  let selectedQuestions: string[] = [];
  
  // Get role-specific questions or use Full Stack as default
  const roleQuestions = baseQuestions[role as keyof typeof baseQuestions] || baseQuestions["Full Stack Developer"];
  
  if (type === "Technical") {
    selectedQuestions = roleQuestions.slice(0, amount);
  } else if (type === "Behavioral") {
    selectedQuestions = behavioralQuestions.slice(0, amount);
  } else { // Mixed
    const techCount = Math.ceil(amount / 2);
    const behavioralCount = amount - techCount;
    selectedQuestions = [
      ...roleQuestions.slice(0, techCount),
      ...behavioralQuestions.slice(0, behavioralCount)
    ];
  }

  return selectedQuestions.slice(0, amount);
}
