import Link from "next/link";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";
import { createClient } from "@/lib/supabase/server";

export default async function InstitutionsPage() {
  const supabase = await createClient();

  const { data: institutions, error } = await supabase
    .from("institutions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen text-slate-100">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Institutions</h2>
              <p className="mt-1 text-sm text-slate-400">
                Browse governance groups and organizations.
              </p>
            </div>

            <Link
              href="/institutions/new"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-400 hover:to-cyan-300 active:scale-[0.99]"
            >
              Create Institution
            </Link>
          </div>
        </Card>

        {error ? (
          <Card>
            <p className="text-rose-300">Failed to load institutions.</p>
            <p className="mt-2 text-sm text-slate-400">{error.message}</p>
          </Card>
        ) : !institutions || institutions.length === 0 ? (
          <Card>
            <p className="text-slate-300">No institutions yet.</p>
            <p className="mt-2 text-sm text-slate-400">
              Create your first institution to get started.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {institutions.map((institution) => (
              <Card key={institution.id}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold text-white">
                      {institution.name}
                    </h3>

                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300">
                      {institution.type}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-300">
                    {institution.description || "No description provided."}
                  </p>

                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3 text-sm text-slate-300">
                    Creator:{" "}
                    <span className="font-semibold text-white">
                      {institution.creator_wallet.slice(0, 6)}...
                      {institution.creator_wallet.slice(-4)}
                    </span>
                  </div>

                  <Link
                    href={`/institutions/${institution.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-blue-950/30 transition hover:scale-[1.01] hover:from-blue-400 hover:to-cyan-300 active:scale-[0.99]"
                  >
                    Open Institution
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}