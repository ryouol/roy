import Link from "@/components/site-link";
export function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} Roy Luo</span>
      <nav aria-label="Footer">
        <Link href="/privacy">Privacy</Link>
        <a href="#top">Back to top</a>
      </nav>
      <details className="terrain-credit">
        <summary>Scene credits</summary>
        <p>
          Elevation and aerial imagery:{" "}
          <a
            href="https://www.swisstopo.admin.ch/en"
            target="_blank"
            rel="noreferrer"
          >
            ©swisstopo
          </a>
          . Adapted from swissALTI3D and SWISSIMAGE for this scene.
        </p>
      </details>
    </footer>
  );
}
