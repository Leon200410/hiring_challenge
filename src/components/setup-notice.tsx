import { AlertTriangle } from "lucide-react";

type SetupNoticeProps = {
  title?: string;
  message?: string | null;
};

export function SetupNotice({
  title = "Supabase 尚未连接",
  message,
}: SetupNoticeProps) {
  return (
    <div className="rounded-lg border border-ember/35 bg-ember/10 p-5 text-paper shadow-2xl shadow-black/20 light:text-ink">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 shrink-0 text-ember" aria-hidden="true" size={20} />
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-paper/72 light:text-ink/70">
            {message ??
              "请先在 Supabase 执行 migration/seed，部署 story-api Edge Function，并在 .env.local / Vercel 中配置 NEXT_PUBLIC_SUPABASE_URL 与 NEXT_PUBLIC_SUPABASE_ANON_KEY。"}
          </p>
        </div>
      </div>
    </div>
  );
}
