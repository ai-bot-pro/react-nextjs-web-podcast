export interface Podcast {
    pid: string,
    title: string;
    author: string;
    speakers: string;
    description: string;
    duration: string;
    date: string;
    image: string;
    audioUrl: string;
    audioContent: string;
    tags: string;
    category: string;
    status: string;
}

export interface CurrentPodcast {
    title: string;
    duration: string;
    progress: number;
    audioUrl: string;
}
