// src/app/api/rss/route.ts
import { generatePodcastFeedXml } from "@/utils/xml";
import { getLatestPodcasts } from "@/models/podcast";

export const runtime = "edge";
export const maxDuration = 120;

export async function GET() {
  const externalRssUrl = "https://pub-f8da0a7ab3e74cc8a8081b2d4b8be851.r2.dev/rss.xml";

  try {
    const response = await fetch(externalRssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch external RSS: ${response.status} ${response.statusText}`);
      //Fallback to generate xml data
      const { data } = await getLatestPodcasts(1, 20); // Get latest 20 podcasts for the feed
      const xml = await generatePodcastFeedXml(data);
      return new Response(xml, {
        status: 200,
        headers: {
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "s-maxage=86400, stale-while-revalidate",
        },
      });
    }

    const xml = await response.text();

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching or processing external RSS:", error);
    //Fallback to generate xml data
    const { data } = await getLatestPodcasts(1, 20); // Get latest 20 podcasts for the feed
    const xml = await generatePodcastFeedXml(data);
    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate",
      },
    });
  }
}
