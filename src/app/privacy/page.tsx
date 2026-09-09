import Link from "next/link";
import { pageMetadata, email } from "@/lib/site";
export const metadata = {
  ...pageMetadata(
    "Privacy",
    "Privacy information and analytics preferences for Roy Luo’s portfolio.",
    "/privacy",
  ),
  robots: { index: false },
};
export default function Privacy() {
  return (
    <main id="top" className="document-page">
      <Link href="/" className="wordmark">
        roy luo.
      </Link>
      <p className="eyebrow">Privacy</p>
      <h1>
        Your visit.
        <br />
        <em>Your choice.</em>
      </h1>
      <p>
        This preview keeps optional analytics off until you allow them. You can
        change that choice using “Privacy choices” at any time.
      </p>
      <p>
        The site stores that preference in your browser. Demos hosted on Loom
        load only when you choose to open them. Email links open your email app;
        this site has no contact submission form.
      </p>
      <div className="needs-input">
        <strong>Full privacy policy awaiting owner review.</strong>
        <p>
          The owner must supply their approved policy, including the data
          controller, hosting/analytics processing details, retention periods,
          and applicable visitor rights before public release.
        </p>
      </div>
      {/* <!-- TODO: provide owner-approved privacy policy, controller details, retention periods, and visitor rights --> */}
      <p>
        Contact: <a href={`mailto:${email}`}>{email}</a>
      </p>
      <Link className="pill" href="/">
        Back to the journey ↗
      </Link>
    </main>
  );
}
