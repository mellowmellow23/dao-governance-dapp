"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { VOTING_ABI } from "@/app/lib/contracts";

type ProposalCardProps = {
  index: number;
  address: `0x${string}`;
};

function ProposalCard({ index, address }: ProposalCardProps) {
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const { data: proposalData, refetch } = useReadContract({
    address,
    abi: VOTING_ABI,
    functionName: "getProposal",
    args: [BigInt(index)],
  });

  const proposalName = proposalData?.[0] ?? `Proposal #${index}`;
  const proposalVotes = proposalData?.[1] ?? BigInt(0);

  const handleVote = async () => {
    if (!publicClient) return;

    try {
      const hash = await writeContractAsync({
        address,
        abi: VOTING_ABI,
        functionName: "vote",
        args: [BigInt(index)],
      });

      await publicClient.waitForTransactionReceipt({ hash });
      await refetch();
      window.location.reload();
    } catch (error: any) {
      alert(error?.message || "Vote failed.");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Proposal #{index}
        </p>
        <h3 className="text-xl font-semibold text-white">{proposalName}</h3>
        <p className="text-sm text-slate-300">
          Votes:{" "}
          <span className="font-semibold text-white">
            {proposalVotes.toString()}
          </span>
        </p>
      </div>

      <button
        onClick={handleVote}
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-400 hover:to-cyan-300 active:scale-[0.99]"
      >
        Vote
      </button>
    </div>
  );
}

export default function ElectionPage() {
  const { address } = useParams();
  const contractAddress = String(address) as `0x${string}`;

  const { address: walletAddress, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const { data: proposalCount } = useReadContract({
    address: contractAddress,
    abi: VOTING_ABI,
    functionName: "proposalCount",
  });

  const { data: winnerData } = useReadContract({
    address: contractAddress,
    abi: VOTING_ABI,
    functionName: "winner",
  });

  const { data: status } = useReadContract({
    address: contractAddress,
    abi: VOTING_ABI,
    functionName: "status",
  });

  const { data: startTime } = useReadContract({
    address: contractAddress,
    abi: VOTING_ABI,
    functionName: "startTime",
  });

  const { data: endTime } = useReadContract({
    address: contractAddress,
    abi: VOTING_ABI,
    functionName: "endTime",
  });

  const { data: allowedToVote } = useReadContract({
    address: contractAddress,
    abi: VOTING_ABI,
    functionName: "allowedVoter",
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: !!walletAddress,
    },
  });

  const { data: hasVoted } = useReadContract({
    address: contractAddress,
    abi: VOTING_ABI,
    functionName: "hasVoted",
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: !!walletAddress,
    },
  });

  const { data: votedFor } = useReadContract({
    address: contractAddress,
    abi: VOTING_ABI,
    functionName: "votedFor",
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: !!walletAddress && !!hasVoted,
    },
  });

  const proposals = useMemo(() => {
    const count = Number(proposalCount ?? BigInt(0));
    return Array.from({ length: count }, (_, i) => i);
  }, [proposalCount]);

  const numericStatus = status !== undefined ? Number(status) : -1;

  const statusLabel =
    numericStatus === 0
      ? "Draft"
      : numericStatus === 1
      ? "Open"
      : numericStatus === 2
      ? "Closed"
      : "Unknown";

  const formattedStart = startTime
    ? new Date(Number(startTime) * 1000).toLocaleString()
    : "N/A";

  const formattedEnd = endTime
    ? new Date(Number(endTime) * 1000).toLocaleString()
    : "N/A";

  return (
    <main className="min-h-screen text-slate-100">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/institutions"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
            >
              Back to Institutions
            </Link>
          </div>

          <Card>
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                Election Details
              </span>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Live Election
              </h1>

              <div>
                <p className="mb-2 text-sm text-slate-400">Contract Address</p>
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <code className="break-all text-sm text-slate-200">
                    {contractAddress}
                  </code>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/10 p-4">
                  <p className="text-xs text-cyan-200">Status</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    {statusLabel}
                  </p>
                </div>

                <div className="rounded-2xl border border-blue-400/10 bg-blue-400/10 p-4">
                  <p className="text-xs text-blue-200">Start Time</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formattedStart}
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/10 p-4">
                  <p className="text-xs text-emerald-200">End Time</p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formattedEnd}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Wallet</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Connect your wallet to vote in this election.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
                {isConnected
                  ? `Connected wallet: ${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
                  : "No wallet connected"}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
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

            {isConnected && (
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-slate-300">
                  Allowed to vote:{" "}
                  <span
                    className={`font-semibold ${
                      allowedToVote ? "text-emerald-300" : "text-rose-300"
                    }`}
                  >
                    {allowedToVote ? "Yes" : "No"}
                  </span>
                </p>
                <p className="text-slate-300">
                  Has voted:{" "}
                  <span className="font-semibold text-white">
                    {hasVoted ? "Yes" : "No"}
                  </span>
                </p>
                {hasVoted && (
                  <p className="text-slate-300">
                    Voted for proposal:{" "}
                    <span className="font-semibold text-white">
                      {votedFor?.toString()}
                    </span>
                  </p>
                )}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-white">Proposals</h2>
            <p className="mt-1 text-sm text-slate-400">
              Vote on-chain for one of the available proposals.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {proposals.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-slate-400">
                  No proposals found.
                </div>
              ) : (
                proposals.map((index) => (
                  <ProposalCard
                    key={index}
                    index={index}
                    address={contractAddress}
                  />
                ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-white">Current Winner</h2>
            <p className="mt-1 text-sm text-slate-400">
              Current leading proposal based on on-chain votes.
            </p>

            <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5">
              <p className="text-sm text-emerald-300">Winning Proposal ID</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {winnerData ? winnerData[0].toString() : "N/A"}
              </p>

              <p className="mt-3 text-sm text-slate-200">
                Votes:{" "}
                <span className="font-semibold text-white">
                  {winnerData ? winnerData[1].toString() : "N/A"}
                </span>
              </p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}