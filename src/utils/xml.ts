// src/utils/xml.ts
import { Podcast } from "@/types/podcast";

export async function generatePodcastFeedXml(podcasts: Podcast[]): Promise<string> {
    // https://help.apple.com/itc/podcasts_connect/#/itcbaf351599

    const channelTitle = "AI Podcast"; // Replace with your podcast name
    const channelAuthor = "weedge";
    const channelDescription = "Latest podcasts about AI Technology and Papers."; // Replace with your podcast description
    const channelLink = "https://weedge.us.kg"; // Replace with your website URL
    const channelLanguage = "en-us";
    const channelImageUrl = "https://weedge.us.kg/an_AI_podcast_1400.jpg"; // Replace with your podcast image
    const channelCopyright = `© ${new Date().getFullYear()}-${new Date().getFullYear() + 1} ${channelAuthor}`;

    const itemsXmlPromises = podcasts.map(async (podcast) => {
        const itemTitle = escapeXml(podcast.title);
        const itemAuthor = escapeXml(podcast.author);
        const itemDescription = escapeXml(podcast.description);
        const itemLink = `https://weedge.us.kg/podcast/${podcast.pid}`; // Replace with your podcast detail page URL
        const itemPubDate = new Date(podcast.date).toUTCString();
        const itemAudioUrl = escapeXml(podcast.audioUrl);
        const itemAudioLength = podcast.audioSize;
        const itemDuration = podcast.duration;
        const itemExplicit = "false";

        return `
        <item>
          <title>${itemTitle}</title>
          <author>${itemAuthor}</author>
          <description>${itemDescription}</description>
          <link>${itemLink}</link>
          <guid>${itemLink}</guid>
          <pubDate>${itemPubDate}</pubDate>
          <enclosure url="${itemAudioUrl}" length="${itemAudioLength}" type="audio/mpeg"/>
          <itunes:duration>${itemDuration}</itunes:duration>
          <itunes:explicit>${itemExplicit}</itunes:explicit>
        </item>
      `;
    });

    const itemsXmlArray = await Promise.all(itemsXmlPromises);
    const itemsXml = itemsXmlArray.join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:podcast="https://podcastindex.org/namespace/1.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
      <channel>
        <title>${channelTitle}</title>
        <itunes:author>${channelAuthor}</itunes:author>
        <itunes:explicit>false</itunes:explicit>
        <itunes:image href="${channelImageUrl}"/>
        <itunes:category text="Technology"/>
        <link>${channelLink}</link>
        <description>${channelDescription}</description>
        <language>${channelLanguage}</language>
        <copyright>${channelCopyright}</copyright>
        <atom:link href="https://pub-f8da0a7ab3e74cc8a8081b2d4b8be851.r2.dev/rss.xml" rel="self" type="application/rss+xml"/>
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
