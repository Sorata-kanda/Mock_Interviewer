import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewById, getFeedbackByInterviewId } from "@/lib/actions/general.action";
import ChatInterview from "@/components/ChatInterview";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const InterviewDetailPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/interview");

  // Check if feedback already exists
  const existingFeedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  // If feedback exists, redirect to feedback page
  if (existingFeedback) {
    redirect(`/interview/${id}/feedback`);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Interview Header */}
      <div className="flex flex-row gap-4 justify-between items-center max-sm:flex-col">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src="/logo.svg"
              alt="interview"
              width={40}
              height={40}
              className="rounded-full object-cover size-[40px]"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <div className="flex gap-2">
          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
            {interview.type}
          </p>
          <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
            {interview.level}
          </p>
        </div>
      </div>

      {/* Chat Interview Component */}
      <ChatInterview
        userName={user?.name!}
        userId={user?.id!}
        interviewId={id}
        questions={interview.questions}
      />

      {/* Back Button */}
      <div className="flex justify-center">
        <Button asChild className="btn-secondary">
          <Link href="/interview">
            Back to Interviews
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default InterviewDetailPage;
