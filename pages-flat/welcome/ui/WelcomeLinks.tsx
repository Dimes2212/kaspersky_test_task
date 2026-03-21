import Link from 'next/link';

export function WelcomeLinks() {
  return (
    <nav className="grid gap-3 sm:grid-cols-2">
      <Link
        href="/users"
        className="rounded-xl border border-blue-200 bg-blue-50 p-4 transition hover:border-blue-400 hover:bg-blue-100"
      >
        <p className="text-base font-semibold">Users</p>
        <p className="mt-1 text-sm">Страница, сделанная вручную.</p>
      </Link>

      <Link
        href="/groups"
        className="rounded-xl border border-sky-200 bg-sky-50 p-4 transition hover:border-sky-400 hover:bg-sky-100"
      >
        <p className="text-base font-semibold">Groups</p>
        <p className="mt-1 text-sm">Страница групп, спроектированная с помощью LLM.</p>
      </Link>
    </nav>
  );
}
