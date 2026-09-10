import { PeakNavigation } from "@/components/peak-navigation";
import { AlpineScene } from "@/components/alpine-scene";
import { ProjectStack } from "@/components/project-stack";
import { Footer } from "@/components/footer";
import { ExperienceTerm } from "@/components/experience-term";
import { workHistory } from "@/lib/data";
import { email, pageMetadata, socialLinks } from "@/lib/site";

export const metadata = pageMetadata(
  "Software engineer",
  "Roy Luo. Software engineer and Electrical Engineering student at UWaterloo. Experience at Squint, Aditum Bio, Tesla, and AES.",
);

export default function Home() {
  return (
    <>
      <AlpineScene />
      <main id="top" className="alpine-page">
        <a className="skip-link" href="#experience">
          Skip to experience
        </a>
        <section
          className="alpine-hero"
          aria-label="Roy Luo — Software engineer"
        >
          <div className="alpine-title">
            <h1>Roy Luo</h1>
            <p className="hero-role">Software engineer</p>
            <p className="hero-education">Electrical Engineering · UWaterloo</p>
          </div>
          <PeakNavigation />
        </section>
        <div className="scenic-passage scenic-approach" aria-hidden="true" />
        <section id="experience" className="experience-section content-section">
          <div className="section-title">
            <span className="section-index">01</span>
            <h2>Experience</h2>
            <p>2024 — 2026</p>
            <p className="experience-hint">Scroll sideways for details</p>
          </div>
          <div className="work-ledger">
            {workHistory.map((term) => (
              <ExperienceTerm term={term} key={term.code} />
            ))}
          </div>
        </section>
        <div className="scenic-passage scenic-pass" aria-hidden="true" />
        <ProjectStack />
        <div className="scenic-passage scenic-ascent" aria-hidden="true" />
        <section id="contact" className="contact-section content-section">
          <div className="section-title">
            <span className="section-index">03</span>
            <h2>Contact</h2>
          </div>
          <div className="contact-links">
            <a className="contact-email" href={`mailto:${email}`}>
              {email}
            </a>
            <div>
              <a href={socialLinks.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
