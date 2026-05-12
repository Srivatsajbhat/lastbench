import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        
        <p className="text-zinc-500 mb-4 tracking-[0.3em] uppercase text-sm">
          The Internet’s Last Bench
        </p>

        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          LastBench
        </h1>

        <p className="text-zinc-400 text-lg md:text-2xl leading-relaxed mb-10">
          For the thoughts that never reach the classroom.
        </p>

        <Link
          href="/feed"
          className="bg-white text-black px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition"
        >
          Enter Feed
        </Link>

      </div>
    </main>
  );
}