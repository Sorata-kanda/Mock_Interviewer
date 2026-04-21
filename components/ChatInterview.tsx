"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, Loader2 } from "lucide-react";
import { createFeedback } from "@/lib/actions/general.action";

const ChatInterview = ({
  userName,
  userId,
  interviewId,
  questions,
}: ChatInterviewProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewEnded, setIsInterviewEnded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = () => {
    setIsInterviewStarted(true);
    const welcomeMessage: ChatMessage = {
      role: "assistant",
      content:
        "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience. Let's begin with the first question.",
      timestamp: Date.now(),
    };
    const firstQuestion: ChatMessage = {
      role: "assistant",
      content: questions[0],
      timestamp: Date.now() + 100,
    };
    setMessages([welcomeMessage, firstQuestion]);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: currentInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentInput("");
    setIsProcessing(true);

    // Simulate AI thinking time
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        const nextIndex = currentQuestionIndex + 1;
        const acknowledgment: ChatMessage = {
          role: "assistant",
          content: "Thank you for your answer. Let's move to the next question.",
          timestamp: Date.now(),
        };
        const nextQuestion: ChatMessage = {
          role: "assistant",
          content: questions[nextIndex],
          timestamp: Date.now() + 100,
        };
        setMessages((prev) => [...prev, acknowledgment, nextQuestion]);
        setCurrentQuestionIndex(nextIndex);
        setIsProcessing(false);
      } else {
        // Interview complete
        const closingMessage: ChatMessage = {
          role: "assistant",
          content:
            "Thank you for completing the interview! We'll now analyze your responses and generate detailed feedback. Please wait a moment...",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, closingMessage]);
        setIsInterviewEnded(true);
        setIsProcessing(false);
      }
    }, 1500);
  };

  useEffect(() => {
    const generateFeedback = async () => {
      if (isInterviewEnded && messages.length > 0) {
        // Format transcript for feedback generation
        const transcript = messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        const { success, feedbackId } = await createFeedback({
          interviewId,
          userId,
          transcript,
        });

        if (success && feedbackId) {
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          console.error("Error generating feedback");
          router.push("/");
        }
      }
    };

    generateFeedback();
  }, [isInterviewEnded, messages, interviewId, userId, router]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isInterviewStarted) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-12">
        <div className="call-view">
          <div className="card-interviewer">
            <div className="avatar">
              <Image
                src="/bot_image_white_transparent.png"
                alt="AI Interviewer"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h3>AI Interviewer</h3>
          </div>

          <div className="card-border">
            <div className="card-content">
              <Image
                src="/user-avatar.png"
                alt="user avatar"
                width={120}
                height={120}
                className="rounded-full object-cover size-[120px]"
              />
              <h3>{userName}</h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-2xl text-center">
          <p className="text-lg text-light-100">
            Ready to start your interview? You'll be asked {questions.length}{" "}
            questions. Take your time to provide thoughtful answers.
          </p>
          <button onClick={startInterview} className="btn-call">
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Chat Messages Container */}
      <div className="dark-gradient rounded-2xl p-6 min-h-[500px] max-h-[600px] overflow-y-auto flex flex-col gap-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="flex-shrink-0">
              <Image
                src={
                  message.role === "assistant"
                    ? "/bot_image_white_transparent.png"
                    : "/user-avatar.png"
                }
                alt={message.role}
                width={40}
                height={40}
                className={`${message.role === "assistant" ? "object-contain" : "rounded-full object-cover"} size-[40px]`}
              />
            </div>
            <div
              className={`flex flex-col gap-1 max-w-[70%] ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "bg-dark-200 text-light-100"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Image
                src="/bot_image_white_transparent.png"
                alt="AI"
                width={40}
                height={40}
                className="object-contain size-[40px]"
              />
            </div>
            <div className="bg-dark-200 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary-200" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isInterviewEnded && (
        <div className="flex gap-3 items-end">
          <div className="flex-1 bg-dark-200 rounded-2xl px-5 py-3 border border-input">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer here..."
              className="w-full bg-transparent text-light-100 placeholder:text-light-400 outline-none resize-none min-h-[60px] max-h-[200px]"
              disabled={isProcessing}
              rows={2}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!currentInput.trim() || isProcessing}
            className="btn-primary flex items-center gap-2 px-6 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-sm text-light-400">
        <span>
          Question {Math.min(currentQuestionIndex + 1, questions.length)} of{" "}
          {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentQuestionIndex
                  ? "bg-primary-200"
                  : "bg-dark-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterview;
