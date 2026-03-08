"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { createClient } from "@/lib/supabase/client";

export default function NewInstitutionPage() {
  const router = useRouter();
  const { address } = useAccount();

  const [name, setName] = useState("");
  const [type, setType] = useState("Club");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    setError("");

    if (!name.trim()) {
      setError("Institution name is required.");
      return;
    }

    const id = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const creatorWallet =
      address || "0x0000000000000000000000000000000000000000";

    const supabase = createClient();
    setLoading(true);

    try {
      const { error: institutionError } = await supabase
        .from("institutions")
        .insert({
          id,
          name: name.trim(),
          type,
          description: description.trim(),
          creator_wallet: creatorWallet,
        });

      if (institutionError) {
        throw institutionError;
      }

      const { error: memberError } = await supabase
        .from("institution_members")
        .insert({
          institution_id: id,
          wallet_address: creatorWallet,
          role: "owner",
          status: "active",
        });

      if (memberError) {
        throw memberError;
      }

      router.push(`/institutions/${id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create institution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <section className="mx-auto max-w-3xl px-6 py-10">
        <Card>
          <h1 className="text-3xl font-bold text-white">
            Create Institution
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Set up a club, organization, or community governance group.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-slate-300">
                Institution Name
              </label>
              <input
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none"
                placeholder="Blockchain Club"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Institution Type
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option>Club</option>
                <option>Organization</option>
                <option>Community</option>
                <option>DAO</option>
                <option>Association</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">
                Description
              </label>
              <textarea
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-white outline-none"
                rows={4}
                placeholder="Describe what this institution governs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Institution"}
            </button>
          </div>
        </Card>
      </section>
    </main>
  );
}
