// src/utils/xml.ts
import { Podcast } from "@/types/podcast";

export async function generatePodcastFeedXml(podcasts: Podcast[]): Promise<string> {
    const channelTitle = "AI Podcast"; // Replace with your podcast name
    const channelDescription = "Latest podcasts about AI."; // Replace with your podcast description
    const channelLink = "https://weedge.us.kg"; // Replace with your website URL
    const channelLanguage = "en-us";
    const channelImageUrl = "https://weedge.us.kg/favicon.ico"; // Replace with your podcast image

    const itemsXmlPromises = podcasts.map(async (podcast) => {
        const itemTitle = escapeXml(podcast.title);
        const itemDescription = escapeXml(podcast.description);
        const itemLink = `https://weedge.us.kg/podcast/${podcast.pid}`; // Replace with your podcast detail page URL
        const itemPubDate = new Date(podcast.date).toUTCString();
        const itemAudioUrl = escapeXml(podcast.audioUrl);
        const itemAudioLength = podcast.audioSize;
        const itemDuration = podcast.duration;

        return `
        <item>
          <title>${itemTitle}</title>
          <description>${itemDescription}</description>
          <link>${itemLink}</link>
          <guid>${itemLink}</guid>
          <pubDate>${itemPubDate}</pubDate>
          <enclosure url="${itemAudioUrl}" length="${itemAudioLength}" type="audio/mpeg"/>
          <itunes:duration>${itemDuration}</itunes:duration>
        </item>
      `;
    });

    const itemsXmlArray = await Promise.all(itemsXmlPromises);
    const itemsXml = itemsXmlArray.join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
        <title>${channelTitle}</title>
        <link>${channelLink}</link>
        <description>${channelDescription}</description>
        <language>${channelLanguage}</language>
        <itunes:image href="${channelImageUrl}" />
        <image>
            <url>${channelImageUrl}</url>
            <title>${channelTitle}</title>
            <link>${channelLink}</link>
        </image>
        ${itemsXml}
      </channel>
    </rss>
  `;

    return xml;
}

// Helper function to escape XML characters
function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
