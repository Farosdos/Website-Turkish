import { getBuilds } from '~/lib/jenkins';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const builds = await getBuilds({
      minecraftVersion: searchParams.get('minecraft_version') || undefined,
      includeExperimental: searchParams.get('experimental') === 'true',
    });

    return NextResponse.json(builds, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
