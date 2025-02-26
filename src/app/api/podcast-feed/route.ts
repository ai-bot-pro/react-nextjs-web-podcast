// src/app/api/podcast-feed/route.ts
import { generatePodcastFeedXml } from "@/utils/xml";
import { getLatestPodcasts } from "@/models/podcast";
import { respErr } from "@/utils/resp";

export const runtime = 'edge';
export const maxDuration = 120;

export async function GET(req: Request) {
    try {
        const { data, total } = await getLatestPodcasts(1, 100); // Get all podcasts for the feed
        const xml = await generatePodcastFeedXml(data);

        return new Response(xml, {
            status: 200,
            headers: {
                "Content-Type": "application/rss+xml; charset=utf-8"
            },
        });
    } catch (err) {
        console.error("Error generating podcast feed:", err);
        return respErr("Error generating podcast feed");
    }
}
