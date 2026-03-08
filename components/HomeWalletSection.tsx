"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function HomeWalletSection() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-white">Wallet Status</h3>
      <p className="mt-1 text-sm text-slate-400">
        Connect your wallet to create institutions, deploy elections, and vote.
      </p>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
        {isConnected
          ? `Connected wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}`
          : "No wallet connected"}
      </div>

      <div className="mt-4">
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-400 hover:to-cyan-300 active:scale-[0.99]"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={() => disconnect()}
            className="inline-flex items-center justify-center rounded-xl border border-rose-400/20 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/15"
          >
            Disconnect Wallet
          </button>
        )}
      </div>
    </div>
  );
}