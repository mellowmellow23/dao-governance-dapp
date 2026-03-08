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
    <main className="min-h-screen text-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-8">
          <Card>
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
              <div className="space-y-4">
                <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                  Governance Platform
                </span>

                <h2 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Professional governance for institutions and communities
                </h2>

                <p className="max-w-2xl text-base leading-7 text-slate-300">
                  Create institutions, manage members, deploy elections on-chain,
                  and vote transparently with wallet-based identity.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    href="/institutions"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
                  >
                    Browse Institutions
                  </Link>

                  <Link
                    href="/institutions/new"
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-400 hover:to-cyan-300 active:scale-[0.99]"
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
                <h3 className="text-xl font-semibold text-white">
                  Create Institutions
                </h3>
                <p className="text-sm leading-6 text-slate-300">
                  Set up a club, organization, chama, or community governance
                  group with its own dashboard and controls.
                </p>
              </div>
            </Card>

            <Card>
              <div className="space-y-3">
                <div className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-300">
                  02
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Manage Members
                </h3>
                <p className="text-sm leading-6 text-slate-300">
                  Organize wallet-based participation, roles, and institutional
                  governance access.
                </p>
              </div>
            </Card>

            <Card>
              <div className="space-y-3">
                <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  03
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Run Elections
                </h3>
                <p className="text-sm leading-6 text-slate-300">
                  Deploy election contracts, track proposals, and publish
                  verifiable results on-chain.
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
                  Latest institutions
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Recently created governance groups on the platform.
                </p>
              </div>

              <Link
                href="/institutions"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.99]"
              >
                View All Institutions
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {!institutions || institutions.length === 0 ? (
                <div className="md:col-span-3 rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-slate-400">
                  No institutions yet. Create the first one to get started.
                </div>
              ) : (
                institutions.map((institution) => (
                  <div
                    key={institution.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white/[0.07]"
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

                    <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3 text-sm text-slate-300">
                      Creator:{" "}
                      <span className="font-semibold text-white">
                        {institution.creator_wallet.slice(0, 6)}...
                        {institution.creator_wallet.slice(-4)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/institutions/${institution.id}`}
                        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-400 hover:to-cyan-300 active:scale-[0.99]"
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