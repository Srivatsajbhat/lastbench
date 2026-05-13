export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">

      <div className="absolute top-[-150px] left-[-150px] w-[420px] h-[420px] bg-violet-600/25 rounded-full blur-[120px] animate-pulse" />

      <div className="absolute bottom-[-180px] right-[-180px] w-[420px] h-[420px] bg-blue-600/25 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="absolute top-[35%] left-[40%] w-[300px] h-[300px] bg-fuchsia-500/15 rounded-full blur-[100px] animate-pulse delay-500" />

    </div>
  );
}