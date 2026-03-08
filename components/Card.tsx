export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100/60">
      {children}
    </div>
  );
}