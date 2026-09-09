import Link from "next/link";
export default function NotFound() {
  return (
    <main className="document-page">
      <p className="eyebrow">404 / A small detour</p>
      <h1>
        Off the
        <br />
        <em>beaten path.</em>
      </h1>
      <p>This trail doesn’t lead to a page. Let’s get you back.</p>
      <Link href="/" className="pill">
        Back to the journey ↗
      </Link>
    </main>
  );
}
