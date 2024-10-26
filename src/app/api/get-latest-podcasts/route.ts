//https://nextjs.org/docs/app/building-your-application/routing/route-handlers

import { respData, respErr } from "src/utils/resp";
import { GetLatestPodcasts } from "@/controls/podcast";

export const runtime = 'edge';

export const maxDuration = 120;

export async function POST(req: Request) {
    //console.log("request",req)
    try {
        const { page, limit } = await req.json() as { page: number; limit: number };
        const podcasts = await GetLatestPodcasts(page, limit);

        return respData(podcasts);
    } catch (e) {
        console.error("get latest podcasts failed:", e);
        return respErr("get latest podcasts failed");
    }
}

