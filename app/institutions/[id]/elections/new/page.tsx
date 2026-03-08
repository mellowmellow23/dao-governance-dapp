"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useWriteContract,
  usePublicClient,
} from "wagmi";
import { decodeEventLog, isAddress } from "viem";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { createClient } from "@/lib/supabase/client";
import { FACTORY_ADDRESS, FACTORY_ABI } from "@/app/lib/contracts";

export default function NewElectionPage() {
  const router = useRouter();
  const params = useParams();
  const institutionId = String(params.id);

  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proposalText, setProposalText] = useState("");
  const [voterText, setVoterText] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleCreate = async () => {
    setError("");
    setTxHash("");

    if (!address) {
      setError("Connect your wallet before creating an election.");
      return;
    }

    if (!publicClient) {
      setError("Public client not available.");
      return;
    }

    if (!title.trim()) {
      setError("Election title is required.");
      return;
    }

    const proposals = proposalText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (proposals.length === 0) {
      setError("Add at least one proposal, one per line.");
      return;
    }

    let voters = voterText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    if (voters.length === 0) {
      voters = [address];
    }

    const invalidVoter = voters.find((voter) => !isAddress(voter));
    if (invalidVoter) {
      setError(`Invalid voter address: ${invalidVoter}`);
      return;
    }

    if (!startTime || !endTime) {
      setError("Start time and end time are required.");
      return;
    }

    const startUnix = Math.floor(new Date(startTime).getTime() / 1000);
    const endUnix = Math.floor(new Date(endTime).getTime() / 1000);
    const nowUnix = Math.floor(Date.now() / 1000);

    if (!Number.isFinite(startUnix) || !Number.isFinite(endUnix)) {
      setError("Invalid date values.");
      return;
    }

    if (endUnix <= startUnix) {
      setError("End time must be later than start time.");
      return;
    }

    if (endUnix <= nowUnix + 60) {
      setError("End time must be at least 1 minute in the future.");
      return;
    }

    if (endUnix - startUnix < 300) {
      setError("Election must run for at least 5 minutes.");
      return;
    }

    setLoading(true);

    try {
      const hash = await writeContractAsync({
        address: FACTORY_ADDRESS,
        abi: FACTORY_ABI,
        functionName: "createElectionWithConfig",
        args: [
          proposals,
          voters as `0x${string}`[],
          BigInt(startUnix),
          BigInt(endUnix),
        ],
      });

      setTxHash(hash);

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      let deployedElectionAddress: `0x${string}` | null = null;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: FACTORY_ABI,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === "ElectionCreated") {
            deployedElectionAddress = decoded.args.election as `0x${string}`;
            break;
          }
        } catch {}
      }

      if (!deployedElectionAddress) {
        throw new Error(
          "Election was created, but the contract address could not be read."
        );
      }

      const supabase = createClient();
      const derivedStatus = startUnix > nowUnix ? "upcoming" : "active";

      const { error: insertError } = await supabase.from("elections").insert({
        institution_id: institutionId,
        title: title.trim(),
        description: description.trim(),
        contract_address: deployedElectionAddress,
        status: derivedStatus,
        start_time: new Date(startUnix * 1000).toISOString(),
        end_time: new Date(endUnix * 1000).toISOString(),
      });

      if (insertError) {
        throw insertError;
      }

      router.push(`/institutions/${institutionId}`);
    } catch (err: any) {
      const message = err?.message || "Failed to create election.";

      if (message.includes("reverted")) {
        setError(
          "The contract rejected the election setup. Check the time window, proposals, and voter addresses, then try again."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-slate-100">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-10 space-y-8">
        <Card>
          <h1 className="text-3xl font-bold text-white">Create Election</h1>
          <p className="mt-2 text-sm text-slate-400">
            Deploy a real election contract and save it to this institution.
          </p>
        </Card>

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Wallet</h2>
              <p className="mt-1 text-sm text-slate-400">
                Connect your wallet before deploying the election contract.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
              {isConnected
                ? `Connected wallet: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                : "No wallet connected"}
            </div>
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
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Election Title</label>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20"
                placeholder="Chairperson Election 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Description</label>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20"
                rows={4}
                placeholder="Describe what this election is about..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Proposals (one per line)
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20"
                rows={4}
                placeholder={"Alice\nBob"}
                value={proposalText}
                onChange={(e) => setProposalText(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Allowed Voter Wallets (one per line)
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20"
                rows={4}
                placeholder={"0x1234...\n0xabcd..."}
                value={voterText}
                onChange={(e) => setVoterText(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">
                Leave blank to default to your connected wallet only.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm text-slate-300">Start Time</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-300">End Time</label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white outline-none transition focus:border-blue-400/40 focus:ring-2 focus:ring-blue-400/20"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            {txHash && (
              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300 break-all">
                Transaction submitted: {txHash}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-400 hover:to-cyan-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Election..." : "Create Election On-Chain"}
            </button>
          </div>
        </Card>
      </section>
    </main>
  );
}