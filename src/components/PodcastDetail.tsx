"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Play } from "lucide-react";

import { useAudio } from "@/contexts/AudioContext";
import type { Podcast } from "@/types/podcast";
import { formatTime } from "@/utils/time";
import PodcastPlayer from "@/components/PodcastPlayer";

interface PodcastDetailProps {
  pid: string; // change to pid
  onBack: () => void;
}

export default function PodcastDetail({ pid, onBack }: PodcastDetailProps) {
  const audio = useAudio();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await fetch(`/api/get-podcast?id=${pid}`); // Fetch single podcast by pid
        if (!resp.ok) {
          throw new Error("Failed to fetch podcast");
        }
        const json = (await resp.json()) as {
          code: number;
          message?: string;
          data?: Podcast;
        };
        if (json.code !== 0) {
          throw new Error(json.message || "Failed to fetch podcast");
        }
        const { data } = json as { data: Podcast };
        setPodcast(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        console.error("Error fetching podcast:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPodcast();
  }, [pid]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!podcast) {
    return <div>Podcast not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Podcasts
      </button>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <Image
          src={podcast.image}
          alt={podcast.title}
          width={1000}
          height={500}
          priority={true}
          className="w-full h-48 object-cover"
        />

        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {podcast.title}
            </h1>
            <button
              onClick={() => audio.playPodcast(podcast)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <Play size={20} />
              <span>Play</span>
            </button>
          </div>

          <div className="flex items-center space-x-6 text-gray-500 mb-8">
            <span className="flex items-center">
              <Clock size={18} className="mr-2" />
              {formatTime(parseInt(podcast.duration))}
            </span>
            <span className="flex items-center">
              <Calendar size={18} className="mr-2" />
              {podcast.date}
            </span>
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {podcast.description}
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Source
            </h2>
            {podcast.source &&
              (podcast.source.includes("http") ? (
                <p className="text-gray-600 leading-relaxed">
                  <a href={podcast.source}>{podcast.source}</a>
                </p>
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {podcast.source}
                </p>
              ))}

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Audio Content
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {podcast.audioContent.split("\n").map((line, index) => (
                <span key={index}>
                  {line}
                  <br /> <br />
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
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
