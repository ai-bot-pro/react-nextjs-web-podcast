"use client";

import PodcastCard from "./PodcastCard";
import { Podcast } from "@/types/podcast";

export default function LatestPodcastCards({
  podcasts,
  playPodcast,
  handleEpisodeSelect,
}: {
  podcasts: Podcast[];
  playPodcast: (podcast: Podcast) => void;
  handleEpisodeSelect: (podcast: Podcast) => void;
}) {
  return (
    <div className="mb-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Podcasts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(podcasts) && podcasts.length > 0 ?
          podcasts.map((podcast, index) => (
            <div
              key={index}
              onClick={() => handleEpisodeSelect(podcast)}
              className="cursor-pointer"
            >
              <PodcastCard
                key={index}
                Podcast={podcast}
                onPlay={(e) => {
                  e.stopPropagation();
                  playPodcast(podcast);
                }}
              />
            </div>
          ))
          : <p>No Podcasts Found</p>}
      </div>
    </div>
  );
}
