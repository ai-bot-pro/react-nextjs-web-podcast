import LatestPodcastCards from "@/components/LatestPodcastCards";
import PodcastPlayer from "@/components/PodcastPlayer";
import { getLatestPodcasts } from "@/models/podcast";

export default async function Page() {
  console.log("async page server to render");
  const podcasts = await getLatestPodcasts(1, 50);
  return (
    <>
      <LatestPodcastCards podcasts={podcasts} />
      <PodcastPlayer podcasts={podcasts} />
    </>
  );
}
