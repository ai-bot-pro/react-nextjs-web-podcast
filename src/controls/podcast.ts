import { getLatestPodcasts, getPodcastByPid } from "@/models/podcast";
import { Podcast } from "@/types/podcast";

export async function GetLatestPodcasts(page: number, limit: number) {
    const podcasts = await getLatestPodcasts(page, limit);
    return podcasts
}
export async function GetPodcastByPid(pid: string): Promise<Podcast | null> {
    const podcast = await getPodcastByPid(pid);
    return podcast
}
