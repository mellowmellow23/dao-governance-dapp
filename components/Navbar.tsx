export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-300 bg-clip-text text-xl font-bold text-transparent">
            DAO Governance
          </h1>
          <p className="text-sm text-slate-400">
            Governance for clubs, organizations, and communities
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          Sepolia
        </span>
      </div>
    </nav>
  );
}