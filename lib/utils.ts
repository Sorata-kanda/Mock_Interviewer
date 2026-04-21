import { interviewCovers, mappings } from "@/constants"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const techIconsBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
}

const checkIconExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconsBaseURL}/${normalized}/${normalized}-original.svg`
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg"
    }))
  );
  
  return results;
}

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
}

// Deterministic cover selection based on interview ID
export const getInterviewCover = (interviewId?: string) => {
  if (!interviewId) {
    return getRandomInterviewCover();
  }
  
  // Create a simple hash from the interview ID
  let hash = 0;
  for (let i = 0; i < interviewId.length; i++) {
    hash = ((hash << 5) - hash) + interviewId.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % interviewCovers.length;
  return `/covers${interviewCovers[index]}`;
}
