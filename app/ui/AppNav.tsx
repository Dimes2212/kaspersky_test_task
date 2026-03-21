'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AppNavProps = {
  className: string;
};

const links = [
  { href: '/', label: 'Welcome Page' },
  { href: '/users', label: 'Users' },
  { href: '/groups', label: 'Groups' },
] as const;

export function AppNav({ className }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link key={link.href} href={link.href} className={isActive ? 'text-[#009EE3]' : 'text-[#162155]'}>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
