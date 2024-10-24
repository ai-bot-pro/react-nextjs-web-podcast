"use client";

import { useState, useRef, useEffect} from 'react';

import type { Podcast } from '@/types/podcast';

export function useAudioPlayer(Podcasts: Podcast[]) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [currentPodcast, setCurrentPodcast] = useState<Podcast>(Podcasts[0]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    if (isNaN(progress)) {
        setProgress(0)
    }

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.src = currentPodcast.audioUrl;
        }

        const audio = audioRef.current;

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.volume = volume;

        // Set the current time when audio is loaded
        audio.addEventListener('loadedmetadata', () => {
            audio.currentTime = currentTime;
        });

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
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
        playNext();
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

    const playPodcast = (Podcast: Podcast) => {
        const index = Podcasts.findIndex(ep => ep.title === Podcast.title);
        setCurrentIndex(index);
        setCurrentPodcast(Podcast);
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const playNext = () => {
        const nextIndex = (currentIndex + 1) % Podcasts.length;
        setCurrentIndex(nextIndex);
        setCurrentPodcast(Podcasts[nextIndex]);
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const playPrevious = () => {
        const previousIndex = (currentIndex - 1 + Podcasts.length) % Podcasts.length;
        setCurrentIndex(previousIndex);
        setCurrentPodcast(Podcasts[previousIndex]);
        setCurrentTime(0);
        setIsPlaying(true);
    };

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