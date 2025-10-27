import { JenkinsError, getLatestBuild } from '~/lib/jenkins';

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const build = await getLatestBuild(searchParams.get('experimental') === 'true');

    return NextResponse.json(build, {
      headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300' },
    });
  } catch (error) {
    if (error instanceof JenkinsError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
