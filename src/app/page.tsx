"use client";

import PodcastPlayer from "@/components/PodcastPlayer";
import { useAudio } from "@/contexts/AudioContext";
import Header from "@/components/Header";
import LatestPodcastCards from "@/components/LatestPodcastCards";
import LatestPodcastCard from "@/components/recommend/LatestPodcast";
import { useState } from "react";
import { Podcast } from "@/types/podcast";
import PodcastDetail from "@/components/PodcastDetail";

export default function Page() {
  //console.log("sync page client to render with api data");

  const audio = useAudio();
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);

  const handlePodcastSelect = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
  };

  const handleBack = () => {
    setSelectedPodcast(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPodcast ? (
          <PodcastDetail
            podcast={selectedPodcast}
            onBack={handleBack}
            playPodcast={audio.playPodcast}
          />
        ) : (
          <>
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
          </>
        )}
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
