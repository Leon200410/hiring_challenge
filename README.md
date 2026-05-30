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
```

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
4. 使用默认 Next.js 构建即可

封面图保存在 `public/covers/midnight-library.png`，数据库中的 `cover_path` 指向该公开路径。
