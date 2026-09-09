import { SiteNav } from "@/components/site-nav";
import { JourneyMotion } from "@/components/journey-motion";
import { Landscape, Ridge } from "@/components/landscape";
import { Story } from "@/components/story";
import { ProjectStack } from "@/components/project-stack";
import { Footer } from "@/components/footer";
import { Terminal } from "@/components/terminal";
import { workHistory } from "@/lib/data";
import { email, pageMetadata, socialLinks } from "@/lib/site";

export const metadata = pageMetadata(
  "A little further",
  "Roy Luo — software engineer, Waterloo EE. Explore selected projects and a scenic journey through the systems I build.",
);
export default function Home() {
  return (
    <>
      <SiteNav />
      <JourneyMotion>
        <main id="top">
          <a className="skip-link" href="#work">
            Skip to selected work
          </a>
          <section
            className="hero"
            data-parallax-scene
            aria-label="The beginning"
          >
            <div className="hero-scenery" aria-hidden>
              <Landscape priority />
              <div className="hero-shade" />
            </div>
            <div className="hero-topline">
              <span>SOFTWARE ENGINEER & CURIOUS HUMAN</span>
              <span>WATERLOO → THE WORLD</span>
            </div>
            <div className="hero-copy">
              <p className="eyebrow">Hello, I’m Roy.</p>
              <h1 data-hero-title>
                A little
                <br />
                <em>further.</em>
              </h1>
              <p className="hero-description">
                Building systems. Following curiosity.
                <br />
                Taking the scenic route.
              </p>
              <a href="#journey" className="pill hero-cta">
                Explore the journey <span aria-hidden>↓</span>
              </a>
            </div>
            <Ridge />
            <Ridge near />
            <div className="hero-bottom">
              <span>
                SCROLL TO WANDER <span aria-hidden>↓</span>
              </span>
              <span>01 — THE OPENING</span>
              <span>TAKE YOUR TIME.</span>
            </div>
          </section>
          <section className="intro section-pad">
            <p className="eyebrow" data-reveal>
              There’s always something beyond the horizon.
            </p>
            <h2 data-reveal>
              I like the places where
              <br />
              <em>curiosity becomes craft.</em>
            </h2>
            <div className="intro-bottom" data-reveal>
              <span className="compass" aria-hidden>
                ✳
              </span>
              <p>
                I’m a software engineer interested in inference systems,
                multimodal models, and the backend plumbing that brings ideas to
                life.
              </p>
              <span className="small-label">
                A FEW FIELD NOTES
                <br />
                FROM ALONG THE WAY ↓
              </span>
            </div>
          </section>
          <Story />
          <ProjectStack />
          <section id="about" className="about section-pad">
            <div data-reveal>
              <p className="eyebrow">03 / The person behind the work</p>
              <h2>
                Always a<br />
                <em>little curious.</em>
              </h2>
              <p>
                Electrical engineering at Waterloo. Six co-op terms across
                Tesla, Squint, Aditum Bio, and AES. Away from a terminal:
                sailing, skiing, mountain bikes.
              </p>
              <Terminal />
            </div>
            <div className="work-ledger" data-reveal>
              {workHistory.map((term) => (
                <details key={term.code}>
                  <summary>
                    <span className="small-label">{term.code}</span>
                    <span>
                      {term.company}
                      <small>{term.role}</small>
                    </span>
                    <span aria-hidden>+</span>
                  </summary>
                  <p>
                    {term.dates} · {term.location}
                  </p>
                  <p>{term.note}</p>
                </details>
              ))}
            </div>
          </section>
          <section id="contact" className="closing" data-parallax-scene>
            <div className="closing-scenery" aria-hidden>
              <Landscape />
              <div className="closing-shade" />
            </div>
            <div className="closing-copy" data-reveal>
              <p className="eyebrow">
                04 / Every good journey starts somewhere.
              </p>
              <h2>
                What’s on
                <br />
                <em>your horizon?</em>
              </h2>
              <a href={`mailto:${email}`} className="pill">
                Let’s make something <span aria-hidden>↗</span>
              </a>
              <a className="contact-email" href={`mailto:${email}`}>
                {email}
              </a>
            </div>
            <div className="closing-bottom">
              <a href={socialLinks.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <span>THANKS FOR WANDERING.</span>
              <a href={socialLinks.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </section>
        </main>
      </JourneyMotion>
      <Footer />
      <a className="mobile-cta" href={`mailto:${email}`}>
        Say hello ↗
      </a>
    </>
  );
}
