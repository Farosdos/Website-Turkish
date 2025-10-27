import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mcVersion = searchParams.get('ver');
    const experimental = searchParams.get('experimental');

    // parse experimental param to boolean, null if invalid
    const isExperimental =
      experimental === null
        ? null
        : experimental.toLowerCase() === 'true'
          ? true
          : experimental.toLowerCase() === 'false'
            ? false
            : null;

    // validate at least one filter is provided
    if (mcVersion === null && isExperimental === null) {
      return NextResponse.json(
        { error: 'No valid filters provided. Use ver=<mc_version> or experimental=<true/false>.' },
        { status: 400 },
      );
    }

    // fetch job data
    const jobResponse = await fetch(JOB_API_URL);
    if (!jobResponse.ok) {
      throw new Error(`Failed to fetch Jenkins data. HTTP Status Code: ${jobResponse.status}`);
    }

    const jobData = (await jobResponse.json()) as JenkinsJobData;
    if (!jobData.builds) {
      return NextResponse.json({ error: 'No builds found.' }, { status: 404 });
    }

    // fetch and filter builds
    const filteredBuilds = await Promise.all(
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
        const isBuildExperimental = displayName.endsWith('(Experimental)');

        let buildMcVersion = 'Unknown';
        const matches = displayName.match(/-([\d.]+)( \(Experimental\))?$/);
        if (matches) {
          buildMcVersion = matches[1];
        }

        const matchVersion = mcVersion === null || buildMcVersion === mcVersion;
        const matchExperimental = isExperimental === null || isExperimental === isBuildExperimental;

        if (matchVersion && matchExperimental) {
          const artifactUrl = buildData.artifacts?.[0]
            ? `${build.url}artifact/${buildData.artifacts[0].relativePath}`
            : null;

          return {
            number: build.number,
            url: build.url,
            download: artifactUrl,
            mc_version: buildMcVersion,
            experimental: isBuildExperimental,
          };
        }
        return null;
      }),
    );

    // filter out null values and return results
    const builds = filteredBuilds.filter((build): build is NonNullable<typeof build> => build !== null);
    return NextResponse.json({ builds });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}
