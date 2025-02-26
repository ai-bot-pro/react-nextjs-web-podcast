"use client";

import PodcastPlayer from "@/components/PodcastPlayer";
import { useAudio } from "@/contexts/AudioContext";
import Header from "@/components/Header";
import LatestPodcastCards from "@/components/LatestPodcastCards";
import LatestPodcastCard from "@/components/recommend/LatestPodcast";
import { useState, useEffect } from "react";
import { Podcast } from "@/types/podcast";
import { useRouter } from "next/navigation";
import { defaultPageSize } from "@/configs/locale";

export default function Page() {
  const audio = useAudio();
  const router = useRouter();
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const podcastsPerPage = defaultPageSize; // Podcasts per page
  const [currentPodcasts, setCurrentPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    if (audio.podcasts.length > 0) {
      const startIndex = (currentPage - 1) * podcastsPerPage;
      const endIndex = startIndex + podcastsPerPage;
      //console.log("audio.podcasts", audio.podcasts, startIndex, endIndex);
      //setCurrentPodcasts(audio.podcasts.slice(startIndex, endIndex));
      setCurrentPodcasts(audio.podcasts);
    } else {
      setCurrentPodcasts([]);
    }
  }, [currentPage, audio.podcasts]);

  useEffect(() => {
    audio.loadPodcasts(currentPage, podcastsPerPage);
  }, [currentPage]);

  const totalPages = Math.ceil(audio.totalPodcasts / podcastsPerPage);

  const handlePodcastSelect = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
    router.push(`/podcast/${podcast.pid}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 border rounded-md ${
            currentPage === i
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {audio.podcasts.length > 0 && (
          <>
            {/* Hero Section */}
            <LatestPodcastCard
              podcast={audio.podcasts[0]}
              playPodcast={audio.playPodcast}
            />
          </>
        )}
        {audio.isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Podcasts Grid */}
            {currentPodcasts.length > 0 ? (
              <LatestPodcastCards
                podcasts={currentPodcasts}
                playPodcast={audio.playPodcast}
                handleEpisodeSelect={handlePodcastSelect}
              />
            ) : (
              <p>No Podcasts Found</p>
            )}
            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-8">
              {currentPage > 1 && (
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-4 py-2 border rounded-md bg-white text-gray-600"
                >
                  Previous
                </button>
              )}
              {renderPageNumbers()}
              {currentPage < totalPages && (
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-4 py-2 border rounded-md bg-white text-gray-600"
                >
                  Next
                </button>
              )}
            </div>
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
