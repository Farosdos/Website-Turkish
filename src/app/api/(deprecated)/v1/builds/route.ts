import { NextResponse } from 'next/server';

const JENKINS_BASE_URL = 'https://jenkins.canvasmc.io';
const JOB_API_URL = `${JENKINS_BASE_URL}/job/Canvas/api/json`;

interface JenkinsBuild {
  number: number;
  url: string;
}

interface JenkinsJobData {
  builds?: JenkinsBuild[];
}

interface JenkinsBuildData {
  displayName?: string;
  artifacts?: Array<{
    relativePath: string;
  }>;
}

export async function GET() {
  try {
    // fetch job data
    const jobResponse = await fetch(JOB_API_URL);
    if (!jobResponse.ok) {
      throw new Error(`Failed to fetch Jenkins data. HTTP Status Code: ${jobResponse.status}`);
    }

    const jobData = (await jobResponse.json()) as JenkinsJobData;
    if (jobData.builds?.length === 0) {
      return NextResponse.json({ error: 'No builds found.' }, { status: 404 });
    }

    // fetch and process each build
    const builds = await Promise.all(
      jobData.builds.map(async (build: JenkinsBuild) => {
        const buildApiUrl = `${build.url}api/json`;
        const buildResponse = await fetch(buildApiUrl);

        if (!buildResponse.ok) {
          throw new Error(
            `Failed to fetch build data for build ${build.number}. HTTP Status Code: ${buildResponse.status}`,
          );
        }

        const buildData = (await buildResponse.json()) as JenkinsBuildData;
        const displayName = buildData.displayName ?? 'Unknown';
        const isExperimental = displayName.endsWith('(Experimental)');

        let mcVersion = 'Unknown';
        const matches = displayName.match(/-([\d.]+)( \(Experimental\))?$/);
        if (matches) {
          mcVersion = matches[1];
        }

        const artifactUrl = buildData.artifacts?.[0]
          ? `${build.url}artifact/${buildData.artifacts[0].relativePath}`
          : null;

        return {
          number: build.number,
          url: build.url,
          download: artifactUrl,
          mc_version: mcVersion,
          experimental: isExperimental,
        };
      }),
    );

    return NextResponse.json({ builds });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
