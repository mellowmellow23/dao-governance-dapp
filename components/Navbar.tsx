export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-blue-200 bg-blue-600 shadow-lg shadow-blue-900/20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white">
            DAO Governance Voting
          </h1>
          <p className="text-sm text-blue-100">
            Governance for clubs, organizations, and communities
          </p>
        </div>

        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
          Sepolia
        </span>
      </div>
    </nav>
  );
}