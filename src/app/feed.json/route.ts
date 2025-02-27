// src/app/feed.json/route.ts

import { Podcast } from "@/types/podcast";
import { getLatestPodcasts } from "@/models/podcast";
import { Metadata } from "next";

// Exporting metadata is optional, but recommended for better SEO
export const metadata: Metadata = {
    title: "AI Podcast Feed - JSON",
    description: "Subscribe to the AI Podcast JSON Feed.",
};

export const runtime = "edge";
export const maxDuration = 120;

export async function GET() {
    const { data } = await getLatestPodcasts(1, 100);

    const feed = {
        version: "https://jsonfeed.org/version/1.1",
        title: "AI Podcast",
        home_page_url: "https://weedge.us.kg",
        feed_url: "https://weedge.us.kg/feed.json",
        description: "Latest podcasts about AI.",
        icon: "https://weedge.us.kg/favicon.ico",
        items: data.map((podcast) => ({
            id: `https://weedge.us.kg/podcast/${podcast.pid}`,
            url: `https://weedge.us.kg/podcast/${podcast.pid}`,
            title: podcast.title,
            content_html: podcast.description,
            date_published: podcast.date,
            attachments: [
                {
                    url: podcast.audioUrl,
                    mime_type: "audio/mpeg",
                    size_in_bytes: podcast.audioSize,
                    duration_in_seconds: parseInt(podcast.duration)
                }
            ],
        })),
    };

    return new Response(JSON.stringify(feed), {
        status: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "s-maxage=86400, stale-while-revalidate",
        },
    });
}
