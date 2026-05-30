import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "回声书局 | 互动小说平台",
  description: "一个面向沉浸式互动叙事的阅读平台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;document.documentElement.classList.toggle('dark',d);document.documentElement.classList.toggle('light',!d)}catch(e){document.documentElement.classList.add('dark')}`,
          }}
        />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
