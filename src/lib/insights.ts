import content from '@/content/insights.json';
import { readingMinutes } from './reading-time';

export const siteOrigin = 'https://thespreadbridge.com';
export const insightCategories = content.categories;
export const insights = content.posts.map(post => ({ ...post, readingMinutes: readingMinutes(post.bodyHtml) }));
export type Insight = (typeof insights)[number];
export const insightPath = (slug: string) => `/blog/${slug}/`;
export const getInsight = (slug: string) => insights.find((post) => post.slug === slug);
export const formatArticleDate = (date: string) => new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul',
}).format(new Date(date));

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
