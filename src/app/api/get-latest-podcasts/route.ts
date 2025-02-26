//https://nextjs.org/docs/app/building-your-application/routing/route-handlers

import { respData, respErr } from "src/utils/resp";
import { GetLatestPodcasts } from "@/controls/podcast";
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { page, limit } = await req.json() as { page: number; limit: number };
        const { data, total } = await GetLatestPodcasts(page, limit);
        //console.log(podcasts, total)
        return respData({ data: data, total: total });
    } catch (e) {
        console.error("get latest podcasts failed:", e);
        return respErr("get latest podcasts failed");
    }
}
