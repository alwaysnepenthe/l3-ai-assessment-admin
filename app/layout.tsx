import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "课程智慧中台 | 半岛黄埔军校",
  description: "课程管理、资料解析、AI 内容加工、语料运营与发布记录",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
