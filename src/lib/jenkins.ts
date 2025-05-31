import { z } from 'zod';
import { jenkinsConfig } from '~/config/jenkins';
import { type Build, type JenkinsBuild, JenkinsBuildSchema } from '~/lib/schemas/jenkins';

export class JenkinsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'JenkinsError';
  }
}

function parseBuild(build: JenkinsBuild): Build {
  const isExperimental = build.displayName.endsWith('(Experimental)');
  const versionMatch = build.displayName.match(/\s*-\s*([\d.]+)/);

  const commits =
    build.changeSet?.items
      ?.map(item => ({
        message: item.msg || null,
        hash: item.commitId || null,
      }))
      ?.reverse() || [];

  return {
    result: build.result,
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
    commits,
  };
}

type BuildOptions = {
  minecraftVersion?: string;
  includeExperimental?: boolean;
};

export async function getAllBuilds(options?: BuildOptions): Promise<Build[]> {
  const url = new URL(`job/${jenkinsConfig.job}/api/json?tree=${jenkinsConfig.treeQuery}`, jenkinsConfig.baseUrl);

  const res = await fetch(url.toString()).catch(() => {
    throw new JenkinsError('Failed to connect to Jenkins API');
  });

  if (!res.ok) {
    throw new JenkinsError(`Jenkins API returned ${res.status}${res.statusText ? ` ${res.statusText}` : ''}`);
  }

  const json = await res.json().catch(() => {
    throw new JenkinsError('Jenkins API returned invalid JSON');
  });
  const parseResult = z.object({ builds: z.array(JenkinsBuildSchema) }).safeParse(json);

  if (!parseResult.success) {
    throw new JenkinsError('Jenkins API returned invalid data format');
  }

  return parseResult.data.builds
    .filter(b => !b.building)
    .map(parseBuild)
    .filter(
      b =>
        (!options?.minecraftVersion || b.minecraftVersion === options.minecraftVersion) &&
        (!b.isExperimental || options?.includeExperimental === true),
    );
}

export async function getBuilds(options?: BuildOptions): Promise<Build[]> {
  const url = new URL(`job/${jenkinsConfig.job}/api/json?tree=${jenkinsConfig.treeQuery}`, jenkinsConfig.baseUrl);

  const res = await fetch(url.toString()).catch(() => {
    throw new JenkinsError('Failed to connect to Jenkins API');
  });

  if (!res.ok) {
    throw new JenkinsError(`Jenkins API returned ${res.status}${res.statusText ? ` ${res.statusText}` : ''}`);
  }

  const json = await res.json().catch(() => {
    throw new JenkinsError('Jenkins API returned invalid JSON');
  });
  const parseResult = z.object({ builds: z.array(JenkinsBuildSchema) }).safeParse(json);

  if (!parseResult.success) {
    throw new JenkinsError('Jenkins API returned invalid data format');
  }

  return parseResult.data.builds
    .filter((b): b is JenkinsBuild & { result: 'SUCCESS' } => !b.building && b.result === 'SUCCESS')
    .map(parseBuild)
    .filter(
      b =>
        (!options?.minecraftVersion || b.minecraftVersion === options.minecraftVersion) &&
        (!b.isExperimental || options?.includeExperimental === true),
    );
}

export async function getLatestBuild(includeExperimental = false): Promise<Build | null> {
  const builds = await getBuilds({
    includeExperimental,
  });

  if (builds.length === 0) throw new JenkinsError('No builds found');

  return builds[0];
}
