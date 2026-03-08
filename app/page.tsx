import Link from "next/link";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import HomeWalletSection from "@/components/HomeWalletSection";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: institutions } = await supabase
    .from("institutions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_25%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_25%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_30%)]" />

      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-6">
          <Card>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div className="space-y-4">
                <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  Governance Platform
                </span>

                <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Governance for clubs, organizations, and communities
                </h2>

                <p className="max-w-2xl text-base leading-7 text-slate-300">
                  Create institutions, manage members, run elections, and vote
                  transparently with wallet-based identity. This is the start of
                  a real governance platform.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/institutions"
                    className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Browse Institutions
                  </Link>

                  <Link
                    href="/institutions/new"
                    className="rounded-2xl border border-violet-400/20 bg-violet-400/10 px-5 py-3 text-sm font-semibold text-violet-300 transition hover:bg-violet-400/15"
                  >
                    Create Institution
                  </Link>
                </div>
              </div>

              <HomeWalletSection />
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <div className="space-y-3">
                <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  01
                </div>
                <h3 className="text-xl font-semibold text-white">Create Institutions</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Set up a club, organization, chama, or governance group with its
                  own dashboard and membership controls.
                </p>
              </div>
            </Card>

            <Card>
              <div className="space-y-3">
                <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                  02
                </div>
                <h3 className="text-xl font-semibold text-white">Manage Members</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Add wallet-based members, assign roles, and make sure only the
                  right people can participate in elections.
                </p>
              </div>
            </Card>

            <Card>
              <div className="space-y-3">
                <div className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
                  03
                </div>
                <h3 className="text-xl font-semibold text-white">Run Elections</h3>
                <p className="text-sm leading-6 text-slate-300">
                  Create transparent elections, record votes on-chain, and publish
                  verifiable results for your institution.
                </p>
              </div>
            </Card>
          </div>

          <Card>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                  Institutions
                </span>
                <h3 className="mt-3 text-2xl font-semibold text-white">
                  Latest governance groups
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Real institutions from your database, not mock examples.
                </p>
              </div>

              <Link
                href="/institutions"
                className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                View All Institutions
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {!institutions || institutions.length === 0 ? (
                <div className="md:col-span-3 rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-slate-400">
                  No institutions yet. Create your first one to get started.
                </div>
              ) : (
                institutions.map((institution) => (
                  <div
                    key={institution.id}
                    className="rounded-2xl border border-white/10 bg-slate-900/60 p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-lg font-semibold text-white">
                        {institution.name}
                      </h4>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                        {institution.type}
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      {institution.description || "No description provided."}
                    </p>

                    <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-400">
                      Creator:{" "}
                      <span className="font-semibold text-white">
                        {institution.creator_wallet.slice(0, 6)}...
                        {institution.creator_wallet.slice(-4)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/institutions/${institution.id}`}
                        className="inline-flex rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/15"
                      >
                        Open Institution
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
