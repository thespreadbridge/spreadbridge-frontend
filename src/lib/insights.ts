import content from '@/content/insights.json';
import { readingMinutes } from './reading-time';
import { articleEditorialNote, tradeManagementNotice } from './blog-notices';

export const siteOrigin = 'https://thespreadbridge.com';
export const insightCategories = content.categories;
export const insights = content.posts.map(post => ({
  ...post,
  readingMinutes: readingMinutes(post.bodyHtml + articleEditorialNote + (post.id >= 2 ? tradeManagementNotice.title + tradeManagementNotice.body : '')),
}));
export type Insight = (typeof insights)[number];
export const insightPath = (slug: string) => `/blog/${slug}/`;
export const getInsight = (slug: string) => insights.find((post) => post.slug === slug);
export const formatArticleDate = (date: string) => new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul',
}).format(new Date(date));

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
