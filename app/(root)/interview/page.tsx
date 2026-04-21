import { getCurrentUser } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import InterviewCard from "@/components/InterviewCard";

const InterviewPage = async () => {
  const user = await getCurrentUser();
  const userInterviews = await getInterviewsByUserId(user?.id!);

  return (
    <div className="flex flex-col gap-8">
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Start Your Mock Interview</h2>
          <p className="text-lg">
            Practice with AI-powered interviews and get detailed feedback to improve your skills
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview/create">Create New Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="AI Interview"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {userInterviews && userInterviews.length > 0 && (
        <section className="flex flex-col gap-6">
          <h2>Your Past Interviews</h2>
          <div className="interviews-section">
            {userInterviews.map((interview) => (
              <InterviewCard
                key={interview.id}
                interviewId={interview.id}
                userId={interview.userId}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default InterviewPage;
