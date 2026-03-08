"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <main style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>
        DAO Governance Voting
      </h1>

      <p style={{ marginTop: 10 }}>
        A smart-contract based voting system deployed on Ethereum Sepolia.
      </p>

      <div style={{ marginTop: 20 }}>
        {!isConnected ? (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            style={{ padding: "10px 16px", border: "1px solid black" }}
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p>
              Connected wallet: {address?.slice(0,6)}...{address?.slice(-4)}
            </p>

            <button
              onClick={() => disconnect()}
              style={{ padding: "10px 16px", border: "1px solid black", marginTop: 10 }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20 }}>Elections</h2>
        <p>No elections loaded yet.</p>
      </section>
    </main>
  );
}
