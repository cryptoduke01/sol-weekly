import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-light text-text-primary mb-4">404</h1>
      <p className="text-text-secondary font-light mb-8">Page not found</p>
      <Link
        href="/"
        className="text-sm text-text-muted hover:text-text-primary transition-colors font-light"
      >
        ← Back home
      </Link>
    </div>
  );
}
