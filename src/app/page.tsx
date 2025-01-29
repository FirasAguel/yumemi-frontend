export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-5 text-center text-xl font-semibold">
        <h1>Welcome to my Yumemi frontend test submission</h1>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">
          This is a minimal Next.js setup.
        </p>
      </main>
      <footer className="p-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Firas. All rights reserved.
      </footer>
    </div>
  );
}
