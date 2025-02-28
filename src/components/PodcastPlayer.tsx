// /Users/wuyong/project/ts/podcast/src/components/PodcastPlayer.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  Repeat1,
  X,
  Share2,
  Copy,
  Check,
  Send,
  ChevronUp,
  VolumeX, // Add VolumeX for muted state
} from "lucide-react";

import type { PlaybackMode, Podcast } from "@/types/podcast";
import { formatTime } from "@/utils/time";
import { useAudio } from "@/contexts/AudioContext";
import { SiWechat, SiX } from "@icons-pack/react-simple-icons";

interface PodcastPlayerProps {
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  playbackMode: PlaybackMode;
  onPlayPause: () => void;
  onSeek: (value: number) => void;
  onVolumeChange: (value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onChangePlaybackMode: (mode: PlaybackMode) => void;
}

export default function PodcastPlayer({
  currentPodcast,
  isPlaying,
  progress,
  volume,
  playbackMode,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onNext,
  onPrevious,
  onChangePlaybackMode,
}: PodcastPlayerProps) {
  const audio = useAudio();
  const [isCopied, setIsCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false); // State for share menu visibility
  const shareButtonRef = useRef<HTMLDivElement>(null); // Ref for share button
  const shareMenuRef = useRef<HTMLDivElement>(null); // Ref for share menu
  const volumeButtonRef = useRef<HTMLDivElement>(null);
  const volumeMenuRef = useRef<HTMLDivElement>(null);
  const [isVolumeOpen, setIsVolumeOpen] = useState(false);

  const currentTimeInSeconds = currentPodcast
    ? (progress / 100) * parseInt(currentPodcast.duration)
    : 0;

  const getPlaybackModeIcon = () => {
    switch (playbackMode) {
      case "sequential":
        return <Repeat className="text-gray-400" />;
      case "loop":
        return <Repeat className="text-indigo-600" />;
      case "random":
        return <Shuffle className="text-indigo-600" />;
      case "single":
        return <Repeat1 className="text-indigo-600" />;
    }
  };

  const handlePlaybackModeClick = () => {
    const modes: PlaybackMode[] = ["sequential", "loop", "random", "single"];
    const currentIndex = modes.indexOf(playbackMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    onChangePlaybackMode(nextMode);
  };

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
    if (typeof window !== "undefined" && currentPodcast) {
      const currentUrl = window.location.href;
      const title = encodeURIComponent(currentPodcast.title);
      const summary = encodeURIComponent(
        currentPodcast.description.substring(0, 100) + "..."
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
      if (
        volumeButtonRef.current &&
        !volumeButtonRef.current.contains(event.target as Node) &&
        volumeMenuRef.current &&
        !volumeMenuRef.current.contains(event.target as Node)
      ) {
        setIsVolumeOpen(false);
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
  const handleVolumeClick = () => {
    setIsVolumeOpen(!isVolumeOpen);
  };
  const getVolumeIcon = () => {
    if (volume === 0) {
      return <VolumeX className="text-gray-500" size={20} />;
    } else {
      return <Volume2 className="text-gray-500" size={20} />;
    }
  };

  return (
    <>
      {currentPodcast && audio.isPlayerVisible ? (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="absolute right-1 top-1">
            {/* Modified class here, for floating and right position*/}
            <button
              onClick={audio.togglePlayerVisibility}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="max-w-7xl mx-auto relative">
            {/* Add relative here */}
            {/* Close Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="ml-2">
                  {currentPodcast.image && (
                    <Image
                      src={currentPodcast.image}
                      alt={currentPodcast.title}
                      width={600}
                      height={480}
                      priority={true}
                      className="absolute -top-1  w-full h-32 rounded-full object-cover z-1 opacity-30"
                      style={{ filter: "blur(2px)" }}
                    />
                  )}

                  {currentPodcast.title}
                </span>
              </div>
              <div className="flex-1 mx-8">
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-6 mb-2 relative">
                    <button
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={onPrevious}
                    >
                      <SkipBack size={24} />
                    </button>
                    <div className="relative">
                      <button
                        className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors z-10 relative"
                        onClick={onPlayPause}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                    </div>

                    <button
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={onNext}
                    >
                      <SkipForward size={24} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      onClick={handlePlaybackModeClick}
                      title={`Current mode: ${playbackMode}`}
                    >
                      {getPlaybackModeIcon()}
                    </button>
                    {/* Share Menu */}
                    <div className="flex items-center">
                      <div className="relative" ref={shareButtonRef}>
                        <button
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                          onClick={handleShareClick}
                          aria-expanded={isShareOpen}
                          aria-haspopup="true"
                        >
                          <Share2 size={20} />
                        </button>
                        {isShareOpen && (
                          <div
                            ref={shareMenuRef}
                            className="absolute bottom-full mb-2 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10"
                            role="menu"
                            aria-label="Share Menu"
                          >
                            <button
                              onClick={() => {
                                shareToSocialMedia("wechat");
                                setIsShareOpen(false);
                              }}
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left flex items-center"
                              role="menuitem"
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
                              role="menuitem"
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
                              role="menuitem"
                            >
                              <SiX className="mr-2 h-4 w-4" />
                              X.com
                            </button>
                            <button
                              onClick={handleCopyLink}
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left flex items-center"
                              role="menuitem"
                            >
                              {isCopied ? (
                                <Check className="mr-2 h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="mr-2 h-4 w-4" />
                              )}
                              {isCopied ? "Copied!" : "Copy Link"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Volume Control */}
                    <div className="flex items-center" ref={volumeButtonRef}>
                      <button
                        onClick={handleVolumeClick}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {getVolumeIcon()}
                      </button>
                      {isVolumeOpen && (
                        <div
                          ref={volumeMenuRef}
                          className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-md shadow-lg z-10"
                          style={{ width: "100px", padding: "0px"}} // Adjust width as needed
                        >
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={(e) =>
                              onVolumeChange(Number(e.target.value))
                            }
                            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative w-full flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(currentTimeInSeconds)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progress}
                      onChange={(e) => onSeek(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full"
                    />
                    <span className="text-xs text-gray-500">
                      {formatTime(parseInt(currentPodcast.duration))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
