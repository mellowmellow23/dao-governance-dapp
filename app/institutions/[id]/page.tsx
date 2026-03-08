import Link from "next/link";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { createClient } from "@/lib/supabase/server";

export default async function InstitutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: institution, error: institutionError } = await supabase
    .from("institutions")
    .select("*")
    .eq("id", id)
    .single();

  const { data: elections, error: electionsError } = await supabase
    .from("elections")
    .select("*")
    .eq("institution_id", id)
    .order("created_at", { ascending: false });

  const { count: memberCount, error: memberCountError } = await supabase
    .from("institution_members")
    .select("*", { count: "exact", head: true })
    .eq("institution_id", id);

  if (institutionError || !institution) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-10">
          <Card>
            <h1 className="text-2xl font-bold text-white">Institution not found</h1>
            <p className="mt-2 text-slate-400">
              The institution you are looking for does not exist.
            </p>
            <Link
              href="/institutions"
              className="mt-4 inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Back to Institutions
            </Link>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.10),transparent_30%)]" />
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/institutions"
            className="inline-flex rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Back to Institutions
          </Link>

          <Link
            href="/institutions/new"
            className="inline-flex rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-300 transition hover:bg-violet-400/15"
          >
            Create Institution
          </Link>
        </div>

        <Card>
          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
            <div>
              <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                {institution.type}
              </span>

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
                {institution.name}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
                {institution.description || "No description provided."}
              </p>

              <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-400">
                Creator:{" "}
                <span className="font-semibold text-white">
                  {institution.creator_wallet.slice(0, 6)}...
                  {institution.creator_wallet.slice(-4)}
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-blue-400/10 bg-blue-400/10 p-4">
                <p className="text-xs text-blue-200">Members</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {memberCountError ? "-" : memberCount ?? 0}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-400/10 bg-violet-400/10 p-4">
                <p className="text-xs text-violet-200">Elections</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {electionsError ? "-" : elections?.length ?? 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-white">Active Governance</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Elections linked to this institution.
                </p>
              </div>

              <Link
                href={`/institutions/${id}/elections/new`}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Create Election
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {electionsError ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
                  Failed to load elections.
                </div>
              ) : !elections || elections.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-slate-400">
                  No elections yet for this institution.
                </div>
              ) : (
                elections.map((election) => (
                  <div
                    key={election.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {election.title}
                        </h3>
                        <p className="mt-2 text-sm text-slate-400">
                          {election.description || "No description provided."}
                        </p>
                        <p className="mt-2 break-all font-mono text-sm text-slate-500">
                          {election.contract_address || "No contract address yet"}
                        </p>
                      </div>

                      <span className="inline-flex rounded-full border border-slate-400/20 bg-slate-400/10 px-3 py-1 text-xs font-medium text-slate-300">
                        {election.status}
                      </span>
                    </div>

                    {election.contract_address && (
                      <div className="mt-4">
                        <Link
                          href={`/election/${election.contract_address}`}
                          className="inline-flex rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
                        >
                          Open Election
                        </Link>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-2xl font-semibold text-white">Membership</h2>
            <p className="mt-1 text-sm text-slate-400">
              Institution membership and role controls will live here.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-sm font-medium text-white">Owner</p>
                <p className="mt-1 text-sm text-slate-400">
                  Creator wallet: {institution.creator_wallet}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <p className="text-sm font-medium text-white">Members Count</p>
                <p className="mt-1 text-sm text-slate-400">
                  {memberCountError ? "Unavailable" : memberCount ?? 0} member(s)
                </p>
              </div>

              <button className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                Add Members
              </button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
