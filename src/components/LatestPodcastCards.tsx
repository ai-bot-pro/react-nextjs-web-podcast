"use client";

import PodcastCard from "./PodcastCard";
import { Podcast } from "@/types/podcast";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export default function LatestPodcastCards({
  podcasts,
}: {
  podcasts: Podcast[];
}) {
  const { playPodcast } = useAudioPlayer(podcasts);
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Podcasts Grid */}
      <div className="mb-24">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Latest Podcasts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcasts.map((Podcast, index) => (
            <PodcastCard key={index} Podcast={Podcast} onPlay={playPodcast} />
          ))}
        </div>
      </div>
    </main>
  );
}
