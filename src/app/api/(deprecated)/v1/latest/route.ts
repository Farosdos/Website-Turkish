import { NextResponse } from 'next/server';

const JENKINS_API_URL = 'https://jenkins.canvasmc.io/job/Canvas/lastBuild/api/json';

interface JenkinsBuildData {
  url: string;
  artifacts?: Array<{
    relativePath: string;
  }>;
}

export async function GET() {
  try {
    const response = await fetch(JENKINS_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch Jenkins data. HTTP Status Code: ${response.status}`);
    }

    const data = (await response.json()) as JenkinsBuildData;

    if (data.artifacts?.[0]) {
      const artifactUrl = `${data.url}artifact/${data.artifacts[0].relativePath}`;
      return new Response(null, {
        status: 307,
        headers: {
          Location: artifactUrl,
        },
      });
    } else {
      return NextResponse.json({ error: 'No artifacts found in the latest build.' }, { status: 404 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
