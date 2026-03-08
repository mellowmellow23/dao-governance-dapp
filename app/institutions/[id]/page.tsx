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
      <main className="min-h-screen text-slate-100">
        <Navbar />
        <section className="mx-auto max-w-4xl px-6 py-10">
          <Card>
            <h1 className="text-2xl font-bold text-white">Institution not found</h1>
            <p className="mt-2 text-slate-400">
              The institution you are looking for does not exist.
            </p>
            <Link
              href="/institutions"
              className="mt-4 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
            >
              Back to Institutions
            </Link>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/institutions"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
          >
            Back to Institutions
          </Link>

          <Link
            href="/institutions/new"
            className="inline-flex items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10 px-5 py-3 text-sm font-semibold text-blue-300 transition hover:bg-blue-400/15"
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

              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
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

              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/10 p-4">
                <p className="text-xs text-emerald-200">Elections</p>
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
                <h2 className="text-2xl font-semibold text-white">Governance</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Elections linked to this institution.
                </p>
              </div>

              <Link
                href={`/institutions/${id}/elections/new`}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-400 hover:to-cyan-300 active:scale-[0.99]"
              >
                Create Election
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {electionsError ? (
                <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">
                  Failed to load elections.
                </div>
              ) : !elections || elections.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-slate-400">
                  No elections yet for this institution.
                </div>
              ) : (
                elections.map((election) => (
                  <div
                    key={election.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/40 p-5"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {election.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">
                          {election.description || "No description provided."}
                        </p>
                        <p className="mt-2 break-all font-mono text-sm text-slate-500">
                          {election.contract_address || "No contract address yet"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                          election.status === "active"
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                            : election.status === "upcoming"
                            ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
                            : election.status === "closed"
                            ? "border-slate-400/20 bg-slate-400/10 text-slate-300"
                            : "border-blue-400/20 bg-blue-400/10 text-blue-300"
                        }`}
                      >
                        {election.status}
                      </span>
                    </div>

                    {election.contract_address && (
                      <div className="mt-4">
                        <Link
                          href={`/election/${election.contract_address}`}
                          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
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
              Roles and participation controls for this institution.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm font-medium text-white">Owner</p>
                <p className="mt-1 text-sm text-slate-400">
                  Creator wallet: {institution.creator_wallet}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <p className="text-sm font-medium text-white">Members Count</p>
                <p className="mt-1 text-sm text-slate-400">
                  {memberCountError ? "Unavailable" : memberCount ?? 0} member(s)
                </p>
              </div>

              <button className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]">
                Add Members
              </button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}