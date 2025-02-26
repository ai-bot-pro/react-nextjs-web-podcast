// pages/api/get-podcast.ts (or app/api/get-podcast/route.ts)
import type { NextApiRequest, NextApiResponse } from "next";
import { getPodcastByPid } from "@/models/podcast"; // Import the function
import { respData, respErr } from "src/utils/resp";
import { NextRequest } from "next/server";
export const runtime = 'edge';

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');

    if (typeof id !== "string") {
        return respErr("Invalid podcast ID");
    }

    try {
        const podcast = await getPodcastByPid(id); // Call the function

        if (!podcast) {
            return respErr("Podcast not found");
        }

        return respData(podcast);
    } catch (err) {
        console.error("Error fetching podcast:", err);
        return respErr("Error fetching podcast:");
    }
}
