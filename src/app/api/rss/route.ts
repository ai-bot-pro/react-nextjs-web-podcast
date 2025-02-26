// src/app/api/rss/route.ts
import { generatePodcastFeedXml } from "@/utils/xml";
import { getLatestPodcasts } from "@/models/podcast";
//import { Metadata } from "next"; // Remove this import

// Remove the metadata export as it's not allowed in route handlers
// // Exporting metadata is optional, but recommended for better SEO
// export const metadata: Metadata = {
//   title: "AI Podcast Feed",
//   description: "Subscribe to the AI Podcast RSS Feed.",
// };

export const runtime = "edge";
export const maxDuration = 120;

export async function GET() {
    const { data } = await getLatestPodcasts(1, 100); // Get all podcasts for the feed
    const xml = await generatePodcastFeedXml(data);

    return new Response(xml, {
        status: 200,
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "s-maxage=86400, stale-while-revalidate",
        },
    });
}
