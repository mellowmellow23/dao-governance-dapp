export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      {children}
    </div>
  );
}