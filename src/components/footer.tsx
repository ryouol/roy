import Link from "next/link";
export function Footer() {
  return (
    <footer className="footer">
      <Link href="/" className="wordmark">
        roy luo.
      </Link>
      <span>© {new Date().getFullYear()} Roy Luo</span>
      <nav aria-label="Footer">
        <Link href="/scroll-demo">Motion study</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <a href="#top">Back to top ↑</a>
      </nav>
    </footer>
  );
}
