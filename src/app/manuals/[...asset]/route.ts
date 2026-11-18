import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, privateResponse } from '@/lib/auth/cookies';
import { resolveSession } from '@/lib/auth/session';
import { subscriberAccessStatus } from '@/lib/auth/access';

const contentTypes: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.webp': 'image/webp',
};

export async function GET(request: NextRequest, { params }: { params: Promise<{ asset: string[] }> }) {
  const status = subscriberAccessStatus(await resolveSession(request.cookies.get(ACCESS_COOKIE)?.value));
  if (status !== 200) return privateResponse(new NextResponse(null, { status }));

  const { asset } = await params;
  const contentType = contentTypes[extname(asset.at(-1) ?? '')];
  if (!contentType || asset.some(segment => !/^[a-z\d][a-z\d.-]*$/i.test(segment))) {
    return privateResponse(new NextResponse(null, { status: 404 }));
  }
  try {
    const file = await readFile(join(process.cwd(), 'src', 'content', 'manual-assets', ...asset));
    return privateResponse(new NextResponse(new Uint8Array(file), {
      headers: { 'Content-Type': contentType, 'X-Content-Type-Options': 'nosniff' },
    }));
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return privateResponse(new NextResponse(null, { status: code === 'ENOENT' || code === 'ENOTDIR' ? 404 : 503 }));
  }
}
