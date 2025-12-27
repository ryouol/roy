"use client";

import { useEffect, useState, useCallback } from "react";

interface Slide {
  id: string;
  type: "intro" | "experience" | "projects" | "contact";
}

const slides: Slide[] = [
  { id: "intro", type: "intro" },
  { id: "experience", type: "experience" },
  { id: "projects", type: "projects" },
  { id: "contact", type: "contact" },
];

const experience = [
  {
    company: "Aditum Bio",
    role: "Software Engineer Intern",
    location: "Oakland, CA",
    startDate: "Jan 2026",
    endDate: "Apr 2026",
    startYear: 2026,
    endYear: 2026.33,
    current: true,
    summary: "Building AI Agents for Drug Discovery under Joe Jimenez (ex-CEO of Heinz).",
  },
  {
    company: "Squint.ai",
    role: "Software Engineer Intern",
    location: "San Francisco, CA",
    startDate: "Sept 2025",
    endDate: "Dec 2025",
    startYear: 2025.67,
    endYear: 2026,
    current: false,
    summary: "Solo-shipped the utilities vertical with the CEO, generating $10M ARR and doubling company revenue from $9.5M to $20M.",
  },
  {
    company: "Tesla",
    role: "Software Engineer Intern",
    location: "Fremont, CA",
    startDate: "Jan 2025",
    endDate: "May 2025",
    startYear: 2025,
    endYear: 2025.42,
    current: false,
    summary: "Built Tesla Skynet, an AI agent used by 500+ engineers, increasing developer productivity by 15%.",
  },
  {
    company: "Tesla",
    role: "Software Engineer Intern",
    location: "Fremont, CA",
    startDate: "Sept 2024",
    endDate: "Dec 2024",
    startYear: 2024.67,
    endYear: 2025,
    current: false,
    summary: "Contributed to Robotaxi launch by building ML pipelines powering Llama 3 and RAG integration.",
  },
  {
    company: "AES",
    role: "Software Engineer Intern",
    location: "Cambridge, ON",
    startDate: "Jan 2024",
    endDate: "Apr 2024",
    startYear: 2024,
    endYear: 2024.33,
    current: false,
    summary: "Developed iCIEF Software in C++/Python, improving researcher workflow by 30%.",
  },
];

const projects = [
  { name: "Skynet", tech: "LangChain · FastAPI · Python", description: "AI agent for Tesla engineers" },
  { name: "Robotaxi ML", tech: "Llama 3 · RAG · ChromaDB", description: "Campaign testing automation" },
  { name: "Squint Watch", tech: "Swift · SwiftUI · watchOS", description: "Apple Watch companion app" },
];


export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const totalSlides = slides.length;
  const progress = ((currentSlide + 1) / totalSlides) * 100;
  const slide = slides[currentSlide];

  const goToSlide = useCallback(
    (newSlide: number, dir: "next" | "prev") => {
      if (isAnimating || newSlide < 0 || newSlide >= totalSlides) return;
      setIsAnimating(true);
      setDirection(dir);

      setTimeout(() => {
        setCurrentSlide(newSlide);
        setIsAnimating(false);
      }, 300);
    },
    [isAnimating, totalSlides]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1, "next");
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1, "prev");
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case " ":
        case "Enter":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowUp":
        case "ArrowLeft":
          e.preventDefault();
          prevSlide();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const getAnimationClass = () => {
    if (isAnimating) {
      return direction === "next" ? "animate-fade-out-left" : "animate-fade-out-right";
    }
    return direction === "next" ? "animate-fade-in-left" : "animate-fade-in-right";
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-border z-50">
        <div className="progress-bar h-full" style={{ width: `${progress}%` }} />
      </div>

      {/* Main content */}
      <main className="h-full w-full flex items-center overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto px-8 lg:px-16 py-24">
          <div className={getAnimationClass()} key={currentSlide}>
            
            {/* Intro Slide */}
            {slide.type === "intro" && (
              <div className="space-y-6">
                <p className="font-mono text-sm text-muted opacity-0 animate-fade-in-left">
                  hey, i&apos;m
                </p>
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight opacity-0 animate-fade-in-left delay-100">
                  Roy Luo
                </h1>
                <p className="text-xl md:text-2xl text-muted max-w-lg leading-relaxed opacity-0 animate-fade-in-left delay-200">
                  Electrical Engineering @ UWaterloo.<br />
                  Building at the intersection of AI and product.
                </p>
                <div className="pt-8 opacity-0 animate-fade-in-left delay-300">
                  <p className="text-sm text-muted flex items-center gap-2">
                    press <span className="key">→</span> to continue
                  </p>
                </div>
              </div>
            )}

            {/* Experience Slide */}
            {slide.type === "experience" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="font-mono text-xs text-muted uppercase tracking-wider opacity-0 animate-fade-in-left">
                    Experience
                  </p>
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight opacity-0 animate-fade-in-left delay-100">
                    Where I&apos;ve worked
                  </h2>
                </div>

                <div className="space-y-8 pt-4">
                  {experience.map((job, index) => (
                    <div
                      key={`${job.company}-${job.startDate}`}
                      className="opacity-0 animate-fade-in-left border-l border-border pl-6"
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="flex items-baseline gap-3">
                          <span className="text-lg font-semibold">{job.company}</span>
                          <span className="text-sm text-muted">{job.role}</span>
                        </div>
                        <span className="font-mono text-xs text-muted">{job.location}</span>
                      </div>
                      <p className="font-mono text-xs text-muted mb-2">
                        {job.startDate} — {job.endDate}
                      </p>
                      <p className="text-muted text-sm leading-relaxed max-w-2xl">
                        {job.summary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Slide - Simple */}
            {slide.type === "projects" && (
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="font-mono text-xs text-muted uppercase tracking-wider opacity-0 animate-fade-in-left">
                    Projects
                  </p>
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight opacity-0 animate-fade-in-left delay-100">
                    What I&apos;ve built
                  </h2>
                </div>

                <div className="space-y-6 pt-4">
                  {projects.map((project, index) => (
                    <div
                      key={project.name}
                      className="group opacity-0 animate-fade-in-left border-l-2 border-foreground pl-6 py-2"
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-xl font-semibold">{project.name}</span>
                        <span className="font-mono text-xs text-muted">{project.tech}</span>
                      </div>
                      <p className="text-muted">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Slide */}
            {slide.type === "contact" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="font-mono text-xs text-muted uppercase tracking-wider opacity-0 animate-fade-in-left">
                    Contact
                  </p>
                  <h2 className="text-3xl md:text-4xl font-semibold tracking-tight opacity-0 animate-fade-in-left delay-100">
                    Let&apos;s connect
                  </h2>
                </div>
                <div className="space-y-3 pt-4">
                  {[
                    { label: "Email", value: "r55luo@uwaterloo.ca", href: "mailto:r55luo@uwaterloo.ca" },
                    { label: "Phone", value: "604-364-9996", href: "tel:604-364-9996" },
                    { label: "GitHub", value: "github.com/ryouol", href: "https://github.com/ryouol" },
                    { label: "LinkedIn", value: "linkedin.com/in/ee-royluo", href: "https://linkedin.com/in/ee-royluo" },
                  ].map((link, index) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 opacity-0 animate-fade-in-left hover:pl-2 transition-all"
                      style={{ animationDelay: `${(index + 2) * 100}ms` }}
                    >
                      <span className="font-mono text-sm text-muted w-20">{link.label}</span>
                      <span className="text-lg group-hover:underline">{link.value}</span>
                      <svg className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  ))}
                </div>
                <div className="pt-8 opacity-0 animate-fade-in-left delay-600">
                  <button
                    onClick={() => goToSlide(0, "prev")}
                    className="text-sm text-muted hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    <span className="key">←</span> back to start
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Slide indicator */}
      <div className="fixed bottom-8 left-8 lg:left-16 z-50 flex items-center gap-4">
        <span className="font-mono text-sm text-muted">
          {String(currentSlide + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
        </span>
        <div className="flex gap-1.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index, index > currentSlide ? "next" : "prev")}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "w-6 bg-foreground"
                  : "w-1.5 bg-border hover:bg-muted"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Keyboard hints */}
      <div className="fixed bottom-8 right-8 lg:right-16 z-50 flex items-center gap-3">
        <span className="key">↑</span>
        <span className="key">↓</span>
        <span className="text-xs text-muted">navigate</span>
      </div>

      {/* Navigation arrows (mobile) */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 md:hidden">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Click to advance */}
      <button
        onClick={nextSlide}
        className="fixed inset-0 z-10 cursor-pointer focus:outline-none"
        aria-label="Next slide"
      />
    </div>
  );
}
