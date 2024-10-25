import React from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Play } from "lucide-react";

import { useAudio } from "@/contexts/AudioContext";
import type { Podcast } from "@/types/podcast";

interface PodcastDetailProps {
  podcast: Podcast;
  onBack: () => void;
  playPodcast: (podcast: Podcast) => void;
}

export default function PodcastDetail({
  podcast,
  onBack,
  playPodcast,
}: PodcastDetailProps) {
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
              onClick={() => playPodcast(podcast)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <Play size={20} />
              <span>Play Podcast</span>
            </button>
          </div>

          <div className="flex items-center space-x-6 text-gray-500 mb-8">
            <span className="flex items-center">
              <Clock size={18} className="mr-2" />
              {podcast.duration}
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
              Show Notes
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Join us in this fascinating episode as we explore{" "}
              {podcast.title.toLowerCase()}. Our expert guests share their
              insights and experiences, providing valuable perspectives on this
              important topic. Whether you&apos;re a beginner or an expert,
              you&apos;ll find actionable takeaways and inspiring ideas to apply
              in your own journey.
            </p>

            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">
              Resources Mentioned
            </h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Essential Guide to {podcast.title}</li>
              <li>Related Research Papers</li>
              <li>Recommended Tools and Resources</li>
              <li>Community Discussion Forum</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
