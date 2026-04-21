"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CreateInterviewPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    level: "Junior",
    type: "Technical",
    techstack: "",
    amount: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call API to generate questions and create interview
      const response = await fetch("/api/interview/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          techstack: formData.techstack
            .split(",")
            .map((tech) => tech.trim())
            .filter((tech) => tech),
        }),
      });

      const data = await response.json();

      console.log("API Response:", data); // Debug log

      if (data.success && data.interviewId) {
        router.push(`/interview/${data.interviewId}`);
      } else {
        console.error("API Error:", data.error); // Debug log
        alert(`Failed to create interview: ${data.error || "Unknown error"}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      alert(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Create New Interview</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Role */}
        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Job Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            placeholder="e.g., Frontend Developer, Data Scientist"
            className="bg-dark-200 rounded-full min-h-12 px-5 text-light-100 placeholder:text-light-400 outline-none border border-input focus:border-primary-200"
            required
          />
        </div>

        {/* Level */}
        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Experience Level</label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="bg-dark-200 rounded-full min-h-12 px-5 text-light-100 outline-none border border-input focus:border-primary-200"
          >
            <option value="Junior">Junior</option>
            <option value="Mid">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">Interview Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="bg-dark-200 rounded-full min-h-12 px-5 text-light-100 outline-none border border-input focus:border-primary-200"
          >
            <option value="Technical">Technical</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">
            Tech Stack (comma-separated)
          </label>
          <input
            type="text"
            value={formData.techstack}
            onChange={(e) =>
              setFormData({ ...formData, techstack: e.target.value })
            }
            placeholder="e.g., React, TypeScript, Node.js, MongoDB"
            className="bg-dark-200 rounded-full min-h-12 px-5 text-light-100 placeholder:text-light-400 outline-none border border-input focus:border-primary-200"
            required
          />
        </div>

        {/* Number of Questions */}
        <div className="flex flex-col gap-2">
          <label className="text-light-100 font-semibold">
            Number of Questions: {formData.amount}
          </label>
          <input
            type="range"
            min="3"
            max="10"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-light-400">
            <span>3 questions</span>
            <span>10 questions</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Generating Interview...
            </>
          ) : (
            "Create Interview"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateInterviewPage;
