"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. You MUST include exactly these 5 categories:
        
        1. Communication Skills - Clarity, articulation, structured responses
        2. Technical Knowledge - Understanding of key concepts for the role
        3. Problem Solving - Ability to analyze problems and propose solutions
        4. Cultural Fit - Alignment with company values and job role
        5. Confidence and Clarity - Confidence in responses, engagement, and clarity
        
        For each category, provide:
        - name: The exact category name from above
        - score: A number from 0 to 100
        - comment: Detailed feedback (2-3 sentences)
        
        Also provide:
        - totalScore: Average of all category scores
        - strengths: Array of 3-5 specific strengths
        - areasForImprovement: Array of 3-5 specific areas to improve
        - finalAssessment: A comprehensive paragraph (4-6 sentences) summarizing the overall performance
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Always return exactly 5 categories in your categoryScores array.",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function createInterview(params: CreateInterviewParams) {
  const { userId, role, level, type, techstack, questions } = params;

  try {
    const interviewRef = db.collection("interviews").doc();

    const interview = {
      userId,
      role,
      level,
      type,
      techstack,
      questions,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

    await interviewRef.set(interview);

    return { success: true, interviewId: interviewRef.id };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const interview = await db.collection("interviews").doc(id).get();
    
    if (!interview.exists) return null;

    return { id: interview.id, ...interview.data() } as Interview;
  } catch (error) {
    console.error("Error getting interview:", error);
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  try {
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  } catch (error) {
    console.error("Error getting feedback:", error);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  try {
    const interviews = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error getting latest interviews:", error);
    return null;
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .get();

    // Sort in memory instead of in the query to avoid index requirement
    const sortedInterviews = interviews.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // Descending order (newest first)
      });

    return sortedInterviews as Interview[];
  } catch (error) {
    console.error("Error getting user interviews:", error);
    return null;
  }
}
