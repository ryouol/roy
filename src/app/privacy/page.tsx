import Link from "@/components/site-link";
import { PrivacyPreferences } from "@/components/consent";
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
      <h1>Privacy</h1>
      <p>
        This portfolio is hosted on Vercel, which processes requests to serve
        the site. See{" "}
        <a href="https://vercel.com/legal/privacy-notice">
          Vercel’s privacy notice
        </a>{" "}
        for its hosting practices.
      </p>
      <p>
        Vercel Web Analytics is on by default, and you can turn it off below. It
        provides aggregate visit statistics, such as page views, referrers,
        approximate location, and browser information. It does not use cookies
        or identify individual visitors. See{" "}
        <a href="https://vercel.com/docs/analytics/privacy-policy">
          Vercel’s analytics documentation
        </a>
        . Your choice is saved in this browser’s local storage when available
        and can be changed here at any time. If storage is unavailable, your
        choice lasts until the page is reloaded.
      </p>
      <PrivacyPreferences />
      <p>
        Project previews are images served by this site. Demo and project links
        open external websites, where those sites’ privacy policies apply.
      </p>
      <p>
        Email links open your email app. This site has no contact submission
        form.
      </p>
      <p>
        Contact: <a href={`mailto:${email}`}>{email}</a>
      </p>
      <Link className="pill" href="/">
        Back to portfolio
      </Link>
    </main>
  );
}
