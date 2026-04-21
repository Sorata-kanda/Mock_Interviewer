import { Button } from '@/components/button'
import Link from 'next/link'
import Image from 'next/image'
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'

const page = () => {
  // Split interviews into different sections
  const yourInterviews = dummyInterviews.slice(0, 4); // First 4
  const takeInterviews = dummyInterviews.slice(0, 4); // First 4 (can be same or different)
  const popularInterviews = dummyInterviews.slice(2, 6); // Last 4
  
  return (
    <>
        <section className='card-cta'>
            <div className='flex flex-col gap-6 max-w-lg'>
                <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                <p className='text-lg'>
                    Practice on real interview questions & get instant feedback
                </p>
                <Button asChild className="btn-primary max-sm:w-full">
                    <Link href = "/interview/create">Start an Interview</Link>
                </Button>
            </div>
            <Image src="/robot.png" alt="robo-dude" width={400} height={400} className='max-sm:hidden'/>
        </section>


        <section className='flex flex-col gap-6 mt-8'>
            <h2>Your Interviews</h2>

            <div className='interviews-section'>
                {yourInterviews.map((interview) => 
                    <InterviewCard {...interview} key={interview.id}/>
                )}
            </div>
        </section>

        <section className='flex flex-col gap-6 mt-8'>
            <h2>Take an Interview</h2>
            <div className='interviews-section'>
                {takeInterviews.map((interview) => 
                    <InterviewCard {...interview} key={interview.id}/>
                )}
            </div>
        </section>

        <section className='flex flex-col gap-6 mt-8'>
            <h2>Popular Interviews</h2>
            <div className='interviews-section'>
                {popularInterviews.map((interview) => 
                    <InterviewCard {...interview} key={`popular-${interview.id}`}/>
                )}
            </div>
        </section>
    </>
  )
}

export default page