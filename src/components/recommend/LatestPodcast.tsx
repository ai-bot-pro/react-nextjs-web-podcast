"use client";

import React from "react";

import type { Podcast } from "@/types/podcast";

export default function LatestPodcastCard({
  podcast,
  playPodcast,
}: {
  podcast: Podcast;
  playPodcast: (podcast: Podcast) => void;
}) {
  return (
    <div className="bg-indigo-700 rounded-2xl p-8 mb-12 text-white">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Podcast</h1>
        <p className="text-lg text-indigo-100 mb-6">{podcast.description}</p>
        <button
          onClick={() => podcast && playPodcast(podcast)}
          className="bg-white text-indigo-700 px-6 py-3 rounded-full font-semibold hover:bg-indigo-50"
        >
          Latest Podcast
        </button>
      </div>
    </div>
  );
}
