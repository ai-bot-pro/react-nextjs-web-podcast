import { getRequestContext } from '@cloudflare/next-on-pages';
import { Podcast } from '../types/podcast';

// see: https://developers.cloudflare.com/d1/build-with-d1/d1-client-api/
export const runtime = 'edge';

export async function getPodcastByPid(pid: string): Promise<Podcast | null> {
    if (!pid) {
        return null;
    }

    const stmt = getRequestContext().env.PODCAST_DB.prepare(
        "SELECT * from podcast where pid = ? and is_published is True;"
    ).bind(pid);

    const { results } = await stmt.all();

    if (results.length === 0) {
        return null;
    }

    // Assuming only one result will be returned for a given pid
    return formatPodcast(results[0] as Record<string, unknown>);
}

export async function getLatestPodcasts(
    page: number,
    limit: number
): Promise<{ data: Podcast[], total: number }> {
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
    const total = await getPodcastsTotal();

    //console.log(page, limit, results, total)
    if (results.length === 0) {
        return { data: [], total: total };
    }

    return { data: getPodcastsFromSqlResult(results), total: total };
}

export async function getPodcastsTotal(): Promise<number> {
    try {
        const stmt = getRequestContext().env.PODCAST_DB.prepare(
            "SELECT count(1) as total from podcast where is_published is True;"
        );
        const { results } = await stmt.all();
        if (results.length === 0) {
            return 0;
        }
        const total = Number(results[0].total);
        return total;
    } catch (error) {
        console.error("Error fetching podcasts total:", error);
        throw new Error("Failed to fetch podcasts total");
    }
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
        source: row.source as string,
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
    return podcast;
}
