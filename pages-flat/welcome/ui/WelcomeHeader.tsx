export function WelcomeHeader() {
  return (
    <header className="mb-8 space-y-3">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Добро пожаловать!</h1>
      <p className="max-w-2xl whitespace-nowrap text-sm sm:text-base">
        Выбери нужное представление пользователей: ручная страница или версия, спроектированная с помощью LLM.
      </p>
    </header>
  );
}
