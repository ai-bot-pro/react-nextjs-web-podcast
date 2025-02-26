"use client";

import PodcastPlayer from "@/components/PodcastPlayer";
import { useAudio } from "@/contexts/AudioContext";
import Header from "@/components/Header";
import LatestPodcastCards from "@/components/LatestPodcastCards";
import LatestPodcastCard from "@/components/recommend/LatestPodcast";
import { useState } from "react";
import { Podcast } from "@/types/podcast";
import { useRouter } from "next/navigation";

export default function Page() {
  const audio = useAudio();
  const router = useRouter(); // Initialize useRouter
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  const handlePodcastSelect = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    router.push(`/podcast/${podcast.pid}`); // Navigate to the detail page with pid in the URL
  };

  const handleBack = () => {
    //setSelectedPodcast(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <LatestPodcastCard
          podcast={audio.podcasts[0]}
          playPodcast={audio.playPodcast}
        />
        {/* Podcasts Grid */}
        <LatestPodcastCards
          podcasts={audio.podcasts}
          playPodcast={audio.playPodcast}
          handleEpisodeSelect={handlePodcastSelect}
        />
      </main>

      {/* Player */}
      <PodcastPlayer
        currentPodcast={audio.currentPodcast}
        isPlaying={audio.isPlaying}
        progress={audio.progress}
        volume={audio.volume}
        playbackMode={audio.playbackMode}
        onPlayPause={audio.togglePlay}
        onSeek={audio.seek}
        onVolumeChange={audio.adjustVolume}
        onNext={audio.playNext}
        onPrevious={audio.playPrevious}
        onChangePlaybackMode={audio.changePlaybackMode}
      />
    </div>
  );
}
