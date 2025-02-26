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
  loadPodcasts: (page: number, limit: number) => Promise<void>; // Add loadPodcasts
  totalPodcasts: number;
  isLoading: boolean;
  isPlayerVisible: boolean; // New state
  togglePlayerVisibility: () => void; // New function
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
  const [totalPodcasts, setTotalPodcasts] = useState<number>(0); // add total podcasts
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isPlayerVisible, setIsPlayerVisible] = useState(true); // Initialize as visible

  if (isNaN(progress)) {
    setProgress(0);
  }

  useEffect(() => {
    if (isInitialLoad) {
      //loadPodcasts(1, 10); // default load first page
      setIsInitialLoad(false);
    }
  }, [isInitialLoad]);

  const loadPodcasts = async (page: number, limit: number) => {
    setIsLoading(true);
    try {
      const params = {
        page: page,
        limit: limit,
      };

      const resp = await fetch("/api/get-latest-podcasts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!resp.ok) {
        throw new Error("Failed to fetch podcasts");
      }
      const json = await resp.json();
      const { data } = json as { data: { data: Podcast[]; total: number } };
      //console.log(data)
      setPodcasts(data.data);
      setTotalPodcasts(data.total); // Update totalPodcasts
    } catch (err) {
      setError("Failed to load podcasts. Please try again later.");
      console.error("Failed to load podcasts:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
    const index = podcasts.findIndex((ep) => ep.title === podcast.title);
    setCurrentIndex(index);
    setCurrentPodcast(podcast);
    setCurrentTime(0);
    setIsPlaying(true);
    setIsPlayerVisible(true); // Make sure player is visible when a podcast starts playing
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
  // New function to toggle player visibility
  const togglePlayerVisibility = () => {
    setIsPlayerVisible(!isPlayerVisible);
  };

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
        loadPodcasts, // Add loadPodcasts
        totalPodcasts,
        isLoading,
        isPlayerVisible, // Add isPlayerVisible
        togglePlayerVisibility, // Add togglePlayerVisibility
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
