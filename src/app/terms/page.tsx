import Link from "@/components/site-link";
import { pageMetadata, email } from "@/lib/site";
export const metadata = {
  ...pageMetadata(
    "Terms",
    "Terms information for Roy Luo’s personal portfolio.",
    "/terms",
  ),
  robots: { index: false },
};
export default function Terms() {
  return (
    <main id="top" className="document-page">
      <Link href="/" className="wordmark">
        roy luo.
      </Link>
      <p className="eyebrow">Terms</p>
      <h1>
        A note
        <br />
        <em>before you go.</em>
      </h1>
      <div className="needs-input">
        <strong>Terms awaiting owner review.</strong>
        <p>
          This page is a scaffold. The owner must provide approved terms before
          public release. It does not establish invented warranties, licences,
          or governing law.
        </p>
      </div>
      {/* <!-- TODO: provide owner-approved terms, applicable jurisdiction, and project/media usage permissions --> */}
      <p>
        Questions: <a href={`mailto:${email}`}>{email}</a>
      </p>
      <Link className="pill" href="/">
        Back to the journey ↗
      </Link>
    </main>
  );
}
