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

    // Generate questions using Google Gemini
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse questions from response
    const questions = text
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((q) => q.length > 10);

    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to generate questions" },
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
