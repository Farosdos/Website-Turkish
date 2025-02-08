import { z } from 'zod';
import { jenkinsConfig } from '~/config/jenkins';
import { type Build, type JenkinsBuild, JenkinsBuildSchema } from '~/lib/schemas/jenkins';

function parseBuild(build: JenkinsBuild): Build {
  const isExperimental = build.displayName.endsWith('(Experimental)');
  const versionMatch = build.displayName.match(/-([\d.]+)/);

  return {
    buildNumber: build.number,
    url: build.url,
    downloadUrl: build.artifacts?.[0] ? `${build.url}artifact/${build.artifacts[0].relativePath}` : null,
    minecraftVersion: versionMatch?.[1]?.replace('-', '') || 'unknown',
    timestamp: build.timestamp,
    isExperimental,
    commit: {
      message: build.changeSet?.items?.[0]?.msg || null,
      hash: build.changeSet?.items?.[0]?.commitId || null,
    },
  };
}

type BuildOptions = {
  minecraftVersion?: string;
  includeExperimental?: boolean;
};

export async function getBuilds(options?: BuildOptions): Promise<Build[]> {
  const url = new URL(`job/${jenkinsConfig.job}/api/json?tree=${jenkinsConfig.treeQuery}`, jenkinsConfig.baseUrl);

  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Jenkins API Error: ${res.status}`);

    const json = await res.json();
    const data = z.object({ builds: z.array(JenkinsBuildSchema) }).parse(json);

    return data.builds
      .filter((b): b is JenkinsBuild & { result: 'SUCCESS' } => !b.building && b.result === 'SUCCESS')
      .map(parseBuild)
      .filter(
        (b) =>
          (!options?.minecraftVersion || b.minecraftVersion === options.minecraftVersion) &&
          ((options?.includeExperimental ?? true) ? true : !b.isExperimental),
      );
  } catch (error) {
    throw new Error('Failed to fetch Jenkins builds', { cause: error });
  }
}

export async function getLatestBuild(includeExperimental = true): Promise<Build | null> {
  const builds = await getBuilds({ includeExperimental });
  if (!builds.length) return null;

  return builds[0];
}
