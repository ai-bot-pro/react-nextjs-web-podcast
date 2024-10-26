"use client";

import React from "react";
import Image from "next/image";
import { Play, Clock, Calendar } from "lucide-react";

import type { Podcast } from "@/types/podcast";
import { formatTime } from "@/utils/time";

interface PodcastCardProps {
  Podcast: Podcast;
  onPlay: (e: React.MouseEvent) => void;
}

export default function PodcastCard({ Podcast, onPlay }: PodcastCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Image
        src={Podcast.image}
        alt={Podcast.title}
        width={640}
        height={480}
        priority={true}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {Podcast.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{Podcast.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Clock size={16} className="mr-1" />
              {formatTime(parseInt(Podcast.duration))}
            </span>
            <span className="flex items-center">
              <Calendar size={16} className="mr-1" />
              {Podcast.date}
            </span>
          </div>
          <button
            onClick={onPlay}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
          >
            <Play size={16} />
            <span>Play</span>
          </button>
        </div>
      </div>
    </div>
  );
}
