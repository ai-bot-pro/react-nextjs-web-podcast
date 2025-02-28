"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Play,
  Share2,
  Copy,
  Check,
  Send, // Use for Weibo
} from "lucide-react";

import { useAudio } from "@/contexts/AudioContext";
import type { Podcast } from "@/types/podcast";
import { formatTime } from "@/utils/time";
import PodcastPlayer from "@/components/PodcastPlayer";
import { SiWechat, SiX } from "@icons-pack/react-simple-icons";

interface PodcastDetailProps {
  pid: string;
  onBack: () => void;
}

export default function PodcastDetail({ pid, onBack }: PodcastDetailProps) {
  const audio = useAudio();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false); // State for share menu
  const shareButtonRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPodcast = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const resp = await fetch(`/api/get-podcast?id=${pid}`);
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

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const shareToSocialMedia = (platform: "wechat" | "weibo" | "x") => {
    if (typeof window !== "undefined" && podcast) {
      const currentUrl = window.location.href;
      const title = encodeURIComponent(podcast.title);
      const summary = encodeURIComponent(
        podcast.description.substring(0, 100) + "..."
      );

      let shareUrl = "";
      switch (platform) {
        case "wechat":
          alert("Please copy the link and share it on WeChat: " + currentUrl);
          return;
        case "weibo":
          shareUrl = `http://service.weibo.com/share/share.php?url=${currentUrl}&title=${title}&summary=${summary}`;
          break;
        case "x":
          shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`;
          break;
        default:
          return;
      }
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Handle clicking outside the share menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        shareButtonRef.current &&
        !shareButtonRef.current.contains(event.target as Node) &&
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target as Node)
      ) {
        setIsShareOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShareClick = () => {
    setIsShareOpen(!isShareOpen);
  };

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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => audio.playPodcast(podcast)}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <Play size={20} />
                <span>Play</span>
              </button>
            </div>
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
            {/* Share Menu */}
            <div className="relative" ref={shareButtonRef}>
              <button
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={handleShareClick} // Use onClick
                aria-expanded={isShareOpen} //add
                aria-haspopup="true" //add
              >
                <Share2 size={20} />
                <span>Share</span>
              </button>
              {isShareOpen && (
                <div
                  ref={shareMenuRef}
                  className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                  role="menu" //add
                  aria-label="Share Menu" //add
                >
                  <button
                    onClick={() => {
                      shareToSocialMedia("wechat");
                      setIsShareOpen(false);
                    }}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left flex items-center"
                    role="menuitem" //add
                  >
                    <SiWechat className="mr-2 h-4 w-4" />
                    WeChat
                  </button>
                  <button
                    onClick={() => {
                      shareToSocialMedia("weibo");
                      setIsShareOpen(false);
                    }}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left flex items-center"
                    role="menuitem" //add
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Weibo
                  </button>
                  <button
                    onClick={() => {
                      shareToSocialMedia("x");
                      setIsShareOpen(false);
                    }}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left flex items-center"
                    role="menuitem" //add
                  >
                    <SiX className="mr-2 h-4 w-4" />
                    X.com
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left flex items-center"
                  >
                    {isCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
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
