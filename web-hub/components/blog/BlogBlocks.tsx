import { imageUrl } from "@/lib/image-base";
import { toolBySlug } from "@/lib/catalog";
import type { BlogBlock } from "@/lib/blog-posts";
import { renderInline } from "./Inline";
import { InlineCta } from "./Cta";
import styles from "./blog.module.css";

const TONE_LABEL = { tip: "Tip", warning: "Careful", note: "Note" } as const;

export function BlockView({ block, fallbackToolHref }: { block: BlogBlock & { id?: string }; fallbackToolHref: string }) {
  switch (block.type) {
    case "p":
      return <p>{renderInline(block.text)}</p>;
    case "h3":
      return <h3 id={block.id}>{block.text}</h3>;
    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return <Tag>{block.items.map((item) => <li key={item}>{renderInline(item)}</li>)}</Tag>;
    }
    case "table":
      return (
        <figure>
          <div className={styles.tableShell}>
          <div className={styles.tableWrap} role="region" aria-label={block.caption ?? "Table"} tabIndex={0}>
            <table className={styles.table}>
              {block.caption && <caption>{block.caption}</caption>}
              <thead><tr>{block.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
              <tbody>{block.rows.map((row) => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i}>{renderInline(cell)}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <span className={styles.tableFade} aria-hidden="true" />
          </div>
          <p className={styles.swipeHint} aria-hidden="true">Swipe to see more columns</p>
          {block.source && <figcaption className={styles.tableSource}>Source: {block.source.url ? <a href={block.source.url} target="_blank" rel="noopener noreferrer">{block.source.label}</a> : block.source.label}</figcaption>}
        </figure>
      );
    case "image":
      return (
        <figure className={styles.figure}>
          {/* eslint-disable-next-line @next/next/no-img-element -- blog pictures are served from R2 as-is; width and height reserve the space */}
          <img src={imageUrl(block.src)} alt={block.alt} width={block.width ?? 1200} height={block.height ?? 675} loading="lazy" decoding="async" />
          {(block.caption || block.creditText) && (
            <figcaption>
              {block.caption}
              {block.creditText && <> <span>Image: {block.creditUrl ? <a href={block.creditUrl} target="_blank" rel="noopener noreferrer">{block.creditText}</a> : block.creditText}{block.license ? `, ${block.license}` : ""}.</span></>}
            </figcaption>
          )}
        </figure>
      );
    case "callout":
      return <div role="note" className={`${styles.callout} ${styles[block.tone]}`}><strong className={styles.title}>{block.title ?? TONE_LABEL[block.tone]}</strong>{renderInline(block.text)}</div>;
    case "steps":
      return <ol className={styles.steps}>{block.items.map((item) => <li key={item.title}><strong>{item.title}</strong>{renderInline(item.text)}</li>)}</ol>;
    case "summary":
      return <div className={styles.summary}><span className={styles.label}>{block.title ?? "In short"}</span><p>{renderInline(block.text)}</p></div>;
    case "cta": {
      const tool = block.toolSlug ? toolBySlug(block.toolSlug) : undefined;
      return <InlineCta variant={block.variant} headline={block.headline} text={block.text} label={block.label} toolHref={tool ? `/${tool.slug}` : fallbackToolHref} />;
    }
  }
}
