/*
npx wrangler d1 execute podcast_hub --local --file=./data/podcast.sql
npx wrangler d1 execute podcast_hub  --local --command="SELECT name, type, sql FROM sqlite_schema WHERE type IN ('index');"
npx wrangler d1 execute podcast_hub  --local --command="EXPLAIN QUERY PLAN SELECT * FROM podcast where is_published is True order by create_time desc limit 10;"
*/

DROP TABLE IF EXISTS podcast;
CREATE TABLE IF NOT EXISTS podcast (
  id INTEGER PRIMARY KEY,
  pid text NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  /*speakker: use ',' split*/
  speakers text NOT NULL,
  /*source: video_youtube | pdf | text | img | audio */
  source text DEFAULT "",
  audio_url text NOT NULL,
  description text DEFAULT "",
  audio_content text DEFAULT "",
  cover_img_url text DEFAULT "",
  duration int DEFAULT 0,
  tags text DEFAULT "",
  /*category: 0: unknow 1:tech 2:education 3:food 4:travel 5:code 6:life 7:sport 8:music */
  category int DEFAULT 0,
  /*status: 0:init 1:edited 2:checking 3:passed 4:rejected 5:deleted */
  status int DEFAULT 0,
  is_published boolean DEFAULT false,
  create_time text NOT NULL,
  update_time text NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_podcast_pid ON podcast(pid);
CREATE INDEX IF NOT EXISTS idx_podcast_ctime ON podcast(create_time);
CREATE INDEX IF NOT EXISTS idx_podcast_status ON podcast(is_published,category,status) where status!=5;

insert into podcast(pid,title,author,speakers,audio_url,description,cover_img_url,duration,category,is_published,create_time,update_time) values
(
    "0a6c9d4fd4054ca0adafa59c6ee2b4e1",
    "large language model",
    "weedge",
    "zh-CN-YunjianNeural,zh-CN-XiaoxiaoNeural",
    "https://pub-f8da0a7ab3e74cc8a8081b2d4b8be851.r2.dev/LLM.mp3",
    "introduce large language model",
    "https://pub-f8da0a7ab3e74cc8a8081b2d4b8be851.r2.dev/0_0cfd92c761614d08973297de09100c71.png",
    243,
    1,
    true,
    "2024-10-08 09:00:00",
    "2024-10-11 19:00:00"
),
(
    "0a6c9d4fd4054ca0adafa59c6ee2b4e2",
    "large language model 2",
    "weedge",
    "zh-CN-YunjianNeural,zh-CN-XiaoxiaoNeural",
    "https://pub-f8da0a7ab3e74cc8a8081b2d4b8be851.r2.dev/LLM.mp3",
    "introduce large language model",
    "https://pub-f8da0a7ab3e74cc8a8081b2d4b8be851.r2.dev/0_0cfd92c761614d08973297de09100c71.png",
    243,
    1,
    true,
    "2024-11-08 10:00:00",
    "2024-11-18 09:00:00"
),
(
    "0a6c9d4fd4054ca0adafa59c6ee2b4e3",
    "large language model 3",
    "weedge",
    "zh-CN-YunjianNeural,zh-CN-XiaoxiaoNeural",
    "https://pub-f8da0a7ab3e74cc8a8081b2d4b8be851.r2.dev/LLM.mp3",
    "introduce large language model",
    "https://pub-f8da0a7ab3e74cc8a8081b2d4b8be851.r2.dev/0_0cfd92c761614d08973297de09100c71.png",
    243,
    1,
    false,
    "2024-10-01 09:00:00",
    "2024-11-12 09:00:00"
);