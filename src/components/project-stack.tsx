import { MediaDemo } from "./media-demo";

export function ProjectStack() {
  return (
    <section id="work" className="work-section section-pad">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">02 / Things made along the way</p>
        <h2>
          Selected <em>work.</em>
        </h2>
        <p>A few stops on an ongoing journey.</p>
      </div>
      <div className="project-stack" data-stack>
        <article className="project-card card-market">
          <div className="project-copy">
            <span className="eyebrow">01 — Prediction markets</span>
            <h3>
              Conviction,
              <br />
              <em>made tangible.</em>
            </h3>
            <p>
              Polymarket for Startups. Discover anonymized ideas, take a
              position, and trade on what you believe.
            </p>
            <span className="small-label">REACT / TYPESCRIPT / RUST</span>
          </div>
          <div className="project-visual">
            <MediaDemo title="Polymarket for Startups" />
          </div>
        </article>
        <article className="project-card card-fund">
          <div className="project-copy">
            <span className="eyebrow">02 — Venture infrastructure</span>
            <h3>
              A whole fund.
              <br />
              <em>One place.</em>
            </h3>
            <p>
              VC Fund OS. Deal flow, diligence, an LP portal, and
              portfolio-company dashboards.
            </p>
            <span className="small-label">REACT / GO / PYTHON</span>
          </div>
          <div className="project-visual">
            <MediaDemo
              title="GP tools"
              loom="0ebacafae02c436b8324024a3a44bebc"
              poster="/gp-tools.webp"
            />
            <a
              className="text-link"
              href="https://www.loom.com/share/de3de4a9c1b4418a87f01c9119b38025"
              target="_blank"
              rel="noreferrer"
            >
              LP portal & portfolio demo ↗
            </a>
          </div>
        </article>
        <article className="project-card card-probability">
          <div className="project-copy">
            <span className="eyebrow">03 — Models & markets</span>
            <h3>
              A sense of
              <br />
              <em>what comes next.</em>
            </h3>
            <p>
              Kalshi BTC price predictor. 50,000-path Monte Carlo simulations,
              compiled to WebAssembly.
            </p>
            <a
              className="pill"
              href="https://github.com/ryouol/Kalshi-BTC"
              target="_blank"
              rel="noreferrer"
            >
              Explore the project <span aria-hidden>↗</span>
            </a>
          </div>
          <div className="probability-visual" aria-hidden>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <span className="probability-number">
              50,000<span>POSSIBLE FUTURES</span>
            </span>
            <svg viewBox="0 0 400 160">
              <path d="M0 140C80 140 85 25 140 75S205 145 250 50 320 125 400 0M0 145C100 140 110 0 170 110S250 25 400 20M0 135C80 140 100 70 160 90S280 0 400 60" />
            </svg>
          </div>
        </article>
      </div>
      <div className="more-work" data-reveal>
        <span className="eyebrow">A little deeper in the stack</span>
        <a
          href="https://github.com/ryouol/gRPCNvidia-Work"
          target="_blank"
          rel="noreferrer"
        >
          gRPC on NVIDIA Xavier <span aria-hidden>↗</span>
        </a>
        <a
          href="https://github.com/ryouol/wla-distibutor"
          target="_blank"
          rel="noreferrer"
        >
          Distributed workload allocator <span aria-hidden>↗</span>
        </a>
      </div>
    </section>
  );
}
