"use client";

import React from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

import type { Podcast } from "@/types/podcast";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export default function PodcastPlayer({ podcasts }: { podcasts: Podcast[] }) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const {
    isPlaying,
    progress,
    volume,
    currentPodcast,
    togglePlay,
    seek,
    adjustVolume,
    playNext,
    playPrevious,
  } = useAudioPlayer(podcasts);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Image
            src={currentPodcast.image}
            alt={currentPodcast.title}
            width={1000}
            height={500}
            priority={true}
            className="w-12 h-12 rounded object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {currentPodcast.title}
            </span>
            <span className="text-sm text-gray-500">
              {currentPodcast.duration}
            </span>
          </div>
        </div>

        <div className="flex-1 mx-8">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-6 mb-2">
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={playPrevious}
              >
                <SkipBack size={24} />
              </button>
              <button
                className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                className="text-gray-500 hover:text-gray-700 transition-colors"
                onClick={playNext}
              >
                <SkipForward size={24} />
              </button>
            </div>
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {formatTime((progress / 100) * 180)}{" "}
                {/* Assuming 3 minutes per Podcast */}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => seek(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full"
              />
              <span className="text-xs text-gray-500">
                {currentPodcast.duration}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Volume2 className="text-gray-500" size={20} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => adjustVolume(Number(e.target.value))}
            className="w-24 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
