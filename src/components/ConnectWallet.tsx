"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected)
    return (
      <button onClick={() => connect({ connector: connectors[0] })}>
        Connect Wallet
      </button>
    );

  return (
    <div>
      <span>
        {address?.slice(0, 6)}...{address?.slice(-4)}
      </span>

      <button onClick={() => disconnect()}>
        Disconnect
      </button>
    </div>
  );
}