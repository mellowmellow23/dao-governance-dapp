"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function HomeWalletSection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
      <h3 className="text-lg font-semibold text-white">Wallet Status</h3>
      <p className="mt-1 text-sm text-slate-400">
        Use a real wallet to manage membership and participate in votes.
      </p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
        {isConnected
          ? `Connected wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}`
          : "No wallet connected"}
      </div>

      <div className="mt-4">
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-900/30 transition hover:scale-[1.02] hover:from-cyan-300 hover:to-blue-400"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Disconnect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
