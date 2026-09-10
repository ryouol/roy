import { MediaDemo } from "./media-demo";

export function ProjectStack() {
  return (
    <section id="work" className="projects-section content-section">
      <div className="section-title">
        <span className="section-index">02</span>
        <h2>Things I’ve built before</h2>
      </div>
      <div className="project-list">
        <article className="project-row">
          <div className="project-meta">
            <span>01</span>
            <span>React · TypeScript · Postgres</span>
          </div>
          <h3>Startup prediction market</h3>
          <p>
            A swipe-based forecasting platform with an automated market maker.
          </p>
          <MediaDemo title="Startup prediction market" />
        </article>
        <article className="project-row">
          <div className="project-meta">
            <span>02</span>
            <span>React · Go · Python</span>
          </div>
          <h3>VC Fund OS</h3>
          <p>Deal flow, due diligence, and reporting for investment teams.</p>
          <div className="project-actions">
            <MediaDemo
              title="VC Fund OS"
              loom="0ebacafae02c436b8324024a3a44bebc"
            />
            <a
              href="https://www.loom.com/share/de3de4a9c1b4418a87f01c9119b38025"
              target="_blank"
              rel="noreferrer"
            >
              LP portal demo
            </a>
          </div>
        </article>
        <article className="project-row">
          <div className="project-meta">
            <span>03</span>
            <span>Rust · TypeScript · WebAssembly</span>
          </div>
          <h3>Kalshi BTC</h3>
          <p>
            Bitcoin price prediction models, tested against historical market
            data and deployed live.
          </p>
          <a
            href="https://github.com/ryouol/Kalshi-BTC"
            target="_blank"
            rel="noreferrer"
          >
            View code
          </a>
        </article>
        <div className="more-work">
          <a
            href="https://github.com/ryouol/gRPCNvidia-Work"
            target="_blank"
            rel="noreferrer"
          >
            gRPC on NVIDIA Xavier
          </a>
          <a
            href="https://github.com/ryouol/wla-distibutor"
            target="_blank"
            rel="noreferrer"
          >
            Distributed workload allocator
          </a>
        </div>
      </div>
    </section>
  );
}
