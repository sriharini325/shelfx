export default function Footer() {
  return (
    <footer className="border-t border-ink-600/60 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-ink-500">
          © {new Date().getFullYear()} ShelfX — Library Management &amp; Book Discovery
        </p>
        <p className="text-xs text-ink-600 font-mono">Built for readers, run by librarians.</p>
      </div>
    </footer>
  );
}
