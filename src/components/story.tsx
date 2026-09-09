import { Landscape } from "./landscape";

const steps = [
  [
    "01 / NOTICE",
    "Look a little closer.",
    "The interesting things are usually just beneath the surface.",
  ],
  [
    "02 / EXPLORE",
    "Follow the unknown.",
    "From inference systems to the physical world. Curiosity is the through line.",
  ],
  [
    "03 / BUILD",
    "Make something real.",
    "Small experiments. Deep systems. Things worth putting into the world.",
  ],
];
export function Story() {
  return (
    <section
      id="journey"
      className="story"
      data-story
      aria-label="A passage through the landscape"
    >
      <div className="story-frame">
        <div className="story-caption">
          <span className="eyebrow">A way of seeing</span>
          <span className="small-label">FIELD NOTES / 01—03</span>
        </div>
        <div className="story-copy">
          {steps.map(([number, title, text]) => (
            <div className="story-step" key={number}>
              <p className="eyebrow">{number}</p>
              <h2>{title}</h2>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="story-window" aria-hidden>
          <Landscape forest />
          <div className="image-shade" />
          <span className="landscape-label">The long way is the good way.</span>
        </div>
        <span className="story-bottom small-label">KEEP WANDERING ↓</span>
      </div>
    </section>
  );
}
