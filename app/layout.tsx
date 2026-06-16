import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "适合我的 TA",
  description: "给奥德赛时期年轻人的亲密关系自我认知测评"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
