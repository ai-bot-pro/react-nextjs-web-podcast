import { getLatestPodcasts } from "@/models/podcast";

export async function GetLatestPodcasts(page: number, limit: number) {
    const podcasts = await getLatestPodcasts(page, limit);
    return podcasts
}