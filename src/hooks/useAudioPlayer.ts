"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

import type { Podcast } from '@/types/podcast';

export function useAudioPlayer(Podcasts: Podcast[]) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [currentPodcast, setCurrentPodcast] = useState<Podcast>(Podcasts[0]);
    const [currentIndex, setCurrentIndex] = useState(0);
    if (isNaN(progress)) {
        setProgress(0)
    }

    const playNext = useCallback(() => {
        const nextIndex = (currentIndex + 1) % Podcasts.length;
        setCurrentIndex(nextIndex);
        setCurrentPodcast(Podcasts[nextIndex]);
        setIsPlaying(true);
    }, [currentIndex, Podcasts]);

    const playPrevious = () => {
        const previousIndex = (currentIndex - 1 + Podcasts.length) % Podcasts.length;
        setCurrentIndex(previousIndex);
        setCurrentPodcast(Podcasts[previousIndex]);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.setAttribute("progress", progress.toString())
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const seek = (value: number) => {
        if (!audioRef.current) return;
        const time = (value / 100) * audioRef.current.duration;
        audioRef.current.currentTime = time;
        setProgress(value);
    };

    const adjustVolume = (value: number) => {
        if (!audioRef.current) return;
        audioRef.current.volume = value;
        setVolume(value);
    };

    const playPodcast = (Podcast: Podcast) => {
        const index = Podcasts.findIndex(ep => ep.title === Podcast.title);
        setCurrentIndex(index);
        setCurrentPodcast(Podcast);
        setIsPlaying(true);
    };

    useEffect(() => {
        const handleTimeUpdate = () => {
            if (audioRef.current) {
                const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setProgress(progress);
            }
        };

        const handleEnded = () => {
            playNext();
        };

        if (!audioRef.current) {
            audioRef.current = new Audio();
            if (currentPodcast && currentPodcast.audioUrl) {
                audioRef.current.src = currentPodcast.audioUrl;
            }
        }

        const audio = audioRef.current;

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.volume = volume;

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentPodcast, playNext, volume]);

    useEffect(() => {
        if (audioRef.current && currentPodcast) {
            if (currentPodcast && currentPodcast.audioUrl) {
                audioRef.current.src = currentPodcast.audioUrl;
            }
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentPodcast, isPlaying]);

    return {
        isPlaying,
        progress,
        volume,
        currentPodcast,
        togglePlay,
        seek,
        adjustVolume,
        playPodcast,
        playNext,
        playPrevious
    };
}
