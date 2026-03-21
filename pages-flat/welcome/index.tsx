import { WelcomeHeader } from './ui/WelcomeHeader';
import { WelcomeLinks } from './ui/WelcomeLinks';

export function WelcomePage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
      <WelcomeHeader />
      <WelcomeLinks />
    </section>
  );
}
