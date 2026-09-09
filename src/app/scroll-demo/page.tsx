import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { JourneyMotion } from "@/components/journey-motion";
import { Landscape, Ridge } from "@/components/landscape";
import { Story } from "@/components/story";
import { ProjectStack } from "@/components/project-stack";
import { Footer } from "@/components/footer";
import { pageMetadata } from "@/lib/site";
export const metadata = {
  ...pageMetadata(
    "Motion study",
    "An isolated study of parallax, pinned storytelling, stacked cards, and scroll reveals.",
    "/scroll-demo",
  ),
  robots: { index: false, follow: false },
};
export default function ScrollDemo() {
  return (
    <>
      <SiteNav />
      <JourneyMotion>
        <main id="top" className="demo-page">
          <section className="demo-intro section-pad">
            <p className="eyebrow">An open sketchbook</p>
            <h1 data-hero-title>The motion study.</h1>
            <p>
              Scroll slowly, then reverse. Each section isolates a movement from
              the homepage. Small screens and reduced-motion settings use the
              natural reading flow.
            </p>
            <nav aria-label="Effect demonstrations">
              <a href="#parallax">01 Parallax</a>
              <a href="#journey">02 Pinned passage</a>
              <a href="#work">03 Card stack</a>
              <a href="#reveals">04 Reveals</a>
            </nav>
          </section>
          <section
            id="parallax"
            className="demo-parallax hero"
            data-parallax-scene
          >
            <div className="hero-scenery" aria-hidden>
              <Landscape priority />
              <div className="hero-shade" />
            </div>
            <div className="hero-copy">
              <p className="eyebrow">01 / Independent layers</p>
              <h2>
                Depth, at
                <br />
                <em>your pace.</em>
              </h2>
            </div>
            <Ridge />
            <Ridge near />
          </section>
          <Story />
          <ProjectStack />
          <section id="reveals" className="demo-reveals section-pad">
            <p className="eyebrow">04 / A quiet arrival</p>
            {[
              "A little space.",
              "A gentle arrival.",
              "Nothing in your way.",
            ].map((text) => (
              <h2 key={text} data-reveal>
                {text}
              </h2>
            ))}
            <Link className="pill" href="/">
              Back to the journey ↗
            </Link>
          </section>
        </main>
      </JourneyMotion>
      <Footer />
    </>
  );
}
