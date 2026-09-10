/** The scene projects these native links onto visible ridges as the camera moves. */
export function PeakNavigation() {
  return (
    <nav className="peak-navigation" aria-label="Explore the mountains">
      <a className="peak-link peak-experience" href="#experience">
        <span className="peak-label">Experience</span>
        <span className="peak-leader" aria-hidden="true" />
      </a>
      <a className="peak-link peak-work" href="#work">
        <span className="peak-label">Work</span>
        <span className="peak-leader" aria-hidden="true" />
      </a>
      <a className="peak-link peak-contact" href="#contact">
        <span className="peak-label">Contact</span>
        <span className="peak-leader" aria-hidden="true" />
      </a>
    </nav>
  );
}
