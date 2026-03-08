"use client";

import { useParams } from "next/navigation";

export default function ElectionPage() {
  const { address } = useParams();

  return (
    <main style={{ padding: 40 }}>
      <h1>Election</h1>

      <p>Contract Address:</p>

      <code>{address}</code>
    </main>
  );
}