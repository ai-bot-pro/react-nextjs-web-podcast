"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { Podcast, PlaybackMode } from "@/types/podcast";

interface AudioContextType {
  isPlaying: boolean;
  progress: number;
  volume: number;
  currentPodcast: Podcast | null;
  togglePlay: () => void;
  seek: (value: number) => void;
  adjustVolume: (value: number) => void;
  playPodcast: (podcast: Podcast) => void;
  playNext: () => void;
  playPrevious: () => void;
  playbackMode: PlaybackMode;
  changePlaybackMode: (mode: PlaybackMode) => void;
  podcasts: Podcast[];
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>("sequential");

  if (isNaN(progress)) {
    setProgress(0);
  }

  useEffect(() => {
    const loadPodcasts = async (page: number) => {
      try {
        const params = {
          page: page,
          limit: 50,
        };

        const resp = await fetch("/api/get-latest-podcasts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        });

        const json = await resp.json();
        const { data } = json as { data: Podcast[] };
        console.log(data);
        setPodcasts(data);
      } catch (err) {
        setError("Failed to load podcasts. Please try again later.");
        console.error("Failed to load podcasts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPodcasts(1);
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.src = currentPodcast ? currentPodcast.audioUrl : "";
    }

    const audio = audioRef.current;

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.volume = volume;

    // Set the current time when audio is loaded
    audio.addEventListener("loadedmetadata", () => {
      audio.currentTime = currentTime;
    });

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTime]);

  useEffect(() => {
    if (audioRef.current && currentPodcast) {
      audioRef.current.src = currentPodcast.audioUrl;
      audioRef.current.currentTime = currentTime;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentPodcast]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };

  const handleEnded = () => {
    setCurrentTime(0);
    switch (playbackMode) {
      case "sequential":
        if (currentIndex < podcasts.length - 1) {
          playNext();
        } else {
          setIsPlaying(false);
        }
        break;
      case "loop":
        playNext();
        break;
      case "random":
        playRandom();
        break;
      case "single":
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        }
        break;
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = currentTime;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (value: number) => {
    if (!audioRef.current) return;
    const time = (value / 100) * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    setProgress(value);
  };

  const adjustVolume = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    setVolume(value);
  };

  const playPodcast = (podcast: Podcast) => {
    console.log("playPodcast", podcast);
    const index = podcasts.findIndex((ep) => ep.title === podcast.title);
    setCurrentIndex(index);
    setCurrentPodcast(podcast);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const playNext = () => {
    const nextIndex = (currentIndex + 1) % podcasts.length;
    setCurrentIndex(nextIndex);
    setCurrentPodcast(podcasts[nextIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    const previousIndex =
      (currentIndex - 1 + podcasts.length) % podcasts.length;
    setCurrentIndex(previousIndex);
    setCurrentPodcast(podcasts[previousIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const playRandom = () => {
    const randomIndex = Math.floor(Math.random() * podcasts.length);
    setCurrentIndex(randomIndex);
    setCurrentPodcast(podcasts[randomIndex]);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const changePlaybackMode = (mode: PlaybackMode) => {
    setPlaybackMode(mode);
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

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        progress,
        volume,
        currentPodcast,
        togglePlay,
        seek,
        adjustVolume,
        playPodcast,
        playNext,
        playPrevious,
        playbackMode,
        changePlaybackMode,
        podcasts,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioContextProvider");
  }
  return context;
}
