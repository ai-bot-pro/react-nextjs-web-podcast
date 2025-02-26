// src/app/rss/page.tsx
import { redirect } from 'next/navigation';
import { Metadata } from "next";

// Exporting metadata is optional, but recommended for better SEO
export const metadata: Metadata = {
  title: "AI Podcast Feed",
  description: "Subscribe to the AI Podcast RSS Feed.",
};
export default function PodcastFeedPage() {
  redirect('/api/rss'); // Redirect to the API endpoint
}
