import { Source_Serif_4 } from "next/font/google";

/** Reading typeface for article bodies. Headings keep the brand display font. */
const article = Source_Serif_4({ variable: "--font-article", subsets: ["latin"], display: "swap" });

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className={article.variable}>{children}</div>;
}
