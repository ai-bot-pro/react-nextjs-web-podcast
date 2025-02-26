"use client";
import PodcastDetail from "@/components/PodcastDetail";
import { useRouter } from "next/navigation";
import React from "react";
import { use } from "react";

export const runtime = "edge";
export default function PodcastDetailPage({
  params,
}: {
  params: Promise<{ pid: string }>;
}) {
  const router = useRouter();
  // https://github.com/vercel/next.js/issues/71690
  const { pid } = use(params);

  const handleBack = () => {
    router.push("/");
  };

  return (
    <>
      <PodcastDetail pid={pid} onBack={handleBack} />
    </>
  );
}
