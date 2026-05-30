# 回声书局

基于 `hiring_challenge.pdf` 实现的互动小说平台原型。前端使用 Next.js 15 App Router、React 19、TypeScript、Tailwind CSS v4 和 Framer Motion；数据层使用 Supabase PostgreSQL、RLS 与 Edge Function；部署目标为 Vercel。

## 已实现

- 首页：产品名、slogan、精选小说展示与详情跳转
- 小说详情页：封面、标题、作者、完整简介、开始阅读
- 故事阅读器：顺序阅读、上一页/下一页、结束画面、进度条、翻页动画、TTS 朗读、暗色/浅色模式
- Supabase：migration、seed、公开只读 RLS policy、`story-api` Edge Function

故事正文只放在 `supabase/seed.sql` 中，Next 前端通过 Supabase Edge Function 读取。

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` 需要填入：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# 如果没有新版 API Key，可改用旧版控制台凭据：
DOUBAO_TTS_APP_ID=your-doubao-tts-app-id
DOUBAO_TTS_ACCESS_KEY=your-doubao-tts-access-token
DOUBAO_TTS_RESOURCE_ID=volc.service_type.10029
DOUBAO_TTS_SPEAKER=zh_female_sajiaonvyou_moon_bigtts
DOUBAO_TTS_SAMPLE_RATE=24000
```

阅读器 TTS 使用火山引擎豆包语音合成大模型 V3 HTTP 接口，由 Next.js `/api/tts` 在服务端合成 MP3，前端不会暴露密钥。新版控制台推荐配置 `DOUBAO_TTS_API_KEY`；如果你只有旧版控制台的 AppID 和 Access Token，可改用 `DOUBAO_TTS_APP_ID` 与 `DOUBAO_TTS_ACCESS_KEY`。

## Supabase 设置

在 Supabase 项目中执行：

```bash
supabase db push
supabase functions deploy story-api
```

然后在 Supabase SQL Editor 里执行 `supabase/seed.sql`。如果你习惯用 `psql`，也可以执行：

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

如果不用 Supabase CLI，也可以在 SQL Editor 里依次执行：

1. `supabase/migrations/202605300001_create_story_schema.sql`
2. `supabase/seed.sql`

然后在项目的 Edge Functions 页面部署 `supabase/functions/story-api/index.ts`。

## Vercel 部署

1. 将仓库导入 Vercel
2. 配置 `NEXT_PUBLIC_SUPABASE_URL`
3. 配置 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. 配置 `DOUBAO_TTS_API_KEY`
5. 配置 `DOUBAO_TTS_RESOURCE_ID`
6. 配置 `DOUBAO_TTS_SPEAKER`
7. 使用默认 Next.js 构建即可

封面图保存在 `public/covers/midnight-library.png`，数据库中的 `cover_path` 指向该公开路径。
