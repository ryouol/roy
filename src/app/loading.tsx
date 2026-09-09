export default function Loading() {
  return (
    <main className="document-page" aria-busy="true">
      <p role="status" className="eyebrow">
        Finding the next view…
      </p>
      <div className="loading-shape" />
    </main>
  );
}
