import { getRequestContext } from '@cloudflare/next-on-pages'
import { Podcast } from '../types/podcast';

// see: https://developers.cloudflare.com/d1/build-with-d1/d1-client-api/
export const runtime = 'edge'

export async function getLatestPodcasts(
    page: number,
    limit: number
): Promise<Podcast[]> {
    if (page <= 0) {
        page = 1;
    }
    if (limit <= 0) {
        limit = 50;
    }
    const offset = (page - 1) * limit;

    const stmt = getRequestContext().env.PODCAST_DB.prepare(
        "SELECT * from podcast where is_published is True order by create_time desc limit ? offset ?;"
    ).bind(limit, offset);
    const { results } = await stmt.all();
    //console.log(results)

    if (results.length === 0) {
        return [];
    }

    return getPodcastsFromSqlResult(results);
}

export function getPodcastsFromSqlResult(podcasts: Record<string, unknown>[]): Podcast[] {
    let res: Podcast[] = [];
    podcasts.forEach((row) => {
        const item = formatPodcast(row)
        if (item && item.status !== "forbidden") {
            res.push(item);
        }
    })
    return res;
}

export function formatPodcast(row: Record<string, unknown>): Podcast {
    let podcast: Podcast = {
        pid: row.pid as string,
        title: row.title as string,
        author: row.author as string,
        speakers: row.speakers as string,
        description: row.description as string,
        duration: row.duration as string,
        date: row.create_time as string,
        image: row.cover_img_url as string,
        audioUrl: row.audio_url as string,
        audioContent: row.audio_content as string,
        tags: row.tags as string,
        category: row.category as string,
        status: row.status as string,
    }
    console.log(podcast)
    return podcast;
}
