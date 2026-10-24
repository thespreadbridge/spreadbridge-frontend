import Link from 'next/link';
import { insightPath, type Insight } from '@/lib/insights';

export function ArticleCard({ post }: { post: Insight }) {
  return (
    <article className="insight-card">
      <span className="insight-number">{String(post.id).padStart(2, '0')} <span>· {post.readingMinutes}분 읽기</span></span>
      <h3><Link href={insightPath(post.slug)}>{post.title}</Link></h3>
      <p>{post.description}</p>
      <Link className="insight-read" href={insightPath(post.slug)} aria-label={`${post.title} 읽기`}>글 읽기 <span aria-hidden="true">↗</span></Link>
    </article>
  );
}
