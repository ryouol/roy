import Link from "@/components/site-link";
export default function NotFound() {
  return (
    <main className="document-page">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>This page does not exist.</p>
      <Link href="/" className="pill">
        Back to portfolio
      </Link>
    </main>
  );
}
