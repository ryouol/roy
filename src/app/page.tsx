"use client";

import { useEffect, useState, useCallback, useRef } from "react";

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



export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [modalVideo, setModalVideo] = useState<{ type: "local" | "loom"; src: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      // Close modal on ESC
      if (e.key === "Escape" && modalVideo) {
        setModalVideo(null);
        return;
      }
      
      // Don't navigate when modal is open
      if (modalVideo) return;
      
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
  }, [nextSlide, prevSlide, modalVideo]);

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
      <main className="h-full w-full flex items-start overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto px-8 lg:px-16 py-16 mt-8">
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
                <div className="space-y-4 opacity-0 animate-fade-in-left delay-200">
                  <p className="text-lg text-muted max-w-xl leading-relaxed">
                    Software engineer who likes to build scalable backend systems. 
                    Currently interested in <span className="text-foreground">inference systems</span> and <span className="text-foreground">multimodal models</span>.
                  </p>
                  <p className="text-lg text-muted max-w-xl leading-relaxed">
                    I study Electrical Engineering at the University of Waterloo and
                    like to sail, ski, and mountain bike :)
                  </p>
                </div>
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

            {/* Projects Slide */}
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

                {/* Project 1: Polymarket for Startups */}
                <div className="space-y-4 opacity-0 animate-fade-in-left delay-200 relative z-20">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Polymarket for Startups</h3>
                    <p className="text-sm text-muted max-w-2xl mb-2">
                      Swipe left or right on startup ideas before knowing the company. Make bets and trade positions based on conviction.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">React</span>
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">TypeScript</span>
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">Rust</span>
                    </div>
                  </div>
                  <div 
                    className="group relative bg-card rounded-lg overflow-hidden border border-border max-w-xl hover:border-foreground/20 transition-colors pointer-events-auto cursor-pointer"
                    onClick={() => setModalVideo({ type: "local", src: "/LimitlessDemo.mp4" })}
                    onMouseEnter={() => videoRef.current?.play()}
                    onMouseLeave={() => {
                      if (videoRef.current) {
                        videoRef.current.pause();
                        videoRef.current.currentTime = 0;
                      }
                    }}
                  >
                    {/* Placeholder */}
                    <div className="aspect-video flex items-center justify-center bg-card group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 z-10 pointer-events-none">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-muted" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-xs text-muted">Hover to preview · Click to expand</p>
                      </div>
                    </div>
                    {/* Video */}
                    <video 
                      ref={videoRef}
                      className="aspect-video w-full"
                      muted
                      playsInline
                      loop
                    >
                      <source src="/LimitlessDemo.mp4" type="video/mp4" />
                    </video>
                  </div>
                </div>

                {/* Project 2: VC Fund OS */}
                <div className="space-y-4 opacity-0 animate-fade-in-left delay-300 relative z-20">
                  <div>
                    <h3 className="text-xl font-semibold mb-1">VC Fund OS</h3>
                    <p className="text-sm text-muted max-w-2xl mb-2">
                      End-to-end platform for venture capital: GP tools for fund management, LP investment portal, and portfolio company dashboards.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">React</span>
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">Golang</span>
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">Python</span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Demo 1: GP Tools */}
                    <div>
                      <div className="mb-2">
                        <span className="text-sm font-medium">GP Tools</span>
                        <span className="text-xs text-muted ml-2">Deal flow & due diligence</span>
                      </div>
                      <div 
                        className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-colors pointer-events-auto cursor-pointer"
                        onClick={() => setModalVideo({ type: "loom", src: "https://www.loom.com/embed/0ebacafae02c436b8324024a3a44bebc?autoplay=1" })}
                      >
                        <div className="aspect-video flex items-center justify-center bg-card group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 z-10 pointer-events-none">
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                              <svg className="w-4 h-4 text-muted" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <p className="text-xs text-muted">Hover to preview · Click to expand</p>
                          </div>
                        </div>
                        <div className="aspect-video">
                          <iframe 
                            src="https://www.loom.com/embed/0ebacafae02c436b8324024a3a44bebc" 
                            frameBorder="0" 
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Demo 2: LP & Portco */}
                    <div>
                      <div className="mb-2">
                        <span className="text-sm font-medium">LP Portal & Portco</span>
                        <span className="text-xs text-muted ml-2">Robinhood for VC</span>
                      </div>
                      <div 
                        className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-colors pointer-events-auto cursor-pointer"
                        onClick={() => setModalVideo({ type: "loom", src: "https://www.loom.com/embed/de3de4a9c1b4418a87f01c9119b38025?autoplay=1" })}
                      >
                        <div className="aspect-video flex items-center justify-center bg-card group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 z-10 pointer-events-none">
                          <div className="text-center">
                            <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                              <svg className="w-4 h-4 text-muted" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                            <p className="text-xs text-muted">Hover to preview · Click to expand</p>
                          </div>
                        </div>
                        <div className="aspect-video">
                          <iframe 
                            src="https://www.loom.com/embed/de3de4a9c1b4418a87f01c9119b38025" 
                            frameBorder="0" 
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project 3: Kalshi BTC */}
                <div className="opacity-0 animate-fade-in-left delay-400 relative z-20">
                  <a 
                    href="https://github.com/ryouol/Kalshi-BTC" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-4 rounded-lg border border-border hover:border-foreground/20 transition-colors group pointer-events-auto"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1 group-hover:underline">Kalshi BTC Price Predictor</h3>
                        <p className="text-sm text-muted mb-3">
                          Real-time probability calculator for Kalshi BTC markets using 50k-path Monte Carlo simulations with Heston volatility and Merton jump diffusion models.
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">Next.js</span>
                          <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">TypeScript</span>
                          <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">Rust</span>
                          <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">WebAssembly</span>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-muted flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                  </a>
                </div>

                {/* Project 4: Backend Systems Work */}
                <div className="opacity-0 animate-fade-in-left delay-500 relative z-20">
                  <div className="p-4 rounded-lg border border-border">
                    <h3 className="text-lg font-semibold mb-3">Backend Systems Work</h3>
                    <div className="space-y-2">
                      <a 
                        href="https://github.com/ryouol/gRPCNvidia-Work" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group pointer-events-auto"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="group-hover:underline">gRPCNvidia-Work</span>
                        <span className="text-xs text-muted">— gRPC server for NVIDIA Xavier AGX</span>
                      </a>
                      <a 
                        href="https://github.com/ryouol/wla-distibutor" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group pointer-events-auto"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span className="group-hover:underline">wla-distributor</span>
                        <span className="text-xs text-muted">— Distributed workload allocator</span>
                      </a>
                    </div>
                    <div className="flex gap-2 flex-wrap mt-3">
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">C++</span>
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">gRPC</span>
                      <span className="px-2 py-0.5 text-xs rounded bg-foreground/5 border border-border">CUDA</span>
                    </div>
                  </div>
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

      {/* Click to advance - disabled on projects slide */}
      {slide.type !== "projects" && (
        <button
          onClick={nextSlide}
          className="fixed inset-0 z-10 cursor-pointer focus:outline-none"
          aria-label="Next slide"
        />
      )}

      {/* Video Modal */}
      {modalVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-8"
          onClick={() => setModalVideo(null)}
        >
          {/* Close button */}
          <button 
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={() => setModalVideo(null)}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Video container */}
          <div 
            className="w-full max-w-5xl aspect-video rounded-lg overflow-hidden bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            {modalVideo.type === "local" ? (
              <video 
                className="w-full h-full"
                controls
                autoPlay
                playsInline
              >
                <source src={modalVideo.src} type="video/mp4" />
              </video>
            ) : (
              <iframe 
                src={modalVideo.src}
                frameBorder="0" 
                allowFullScreen
                allow="autoplay"
                className="w-full h-full"
              />
            )}
          </div>
          
          {/* ESC hint */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-white/10 text-xs font-mono">ESC</span>
            <span>to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
