import { z } from 'zod';

const JENKINS_BASE_URL = process.env.JENKINS_BASE_URL || 'https://jenkins.canvasmc.io';

const JenkinsBuildSchema = z.object({
  number: z.number(),
  url: z.string().url(),
  displayName: z.string(),
  result: z.enum(['SUCCESS', 'FAILURE', 'ABORTED', 'UNSTABLE']).optional(),
  timestamp: z.number(),
  building: z.boolean().default(false),
  artifacts: z.array(z.object({ relativePath: z.string() })).optional(),
  changeSet: z
    .object({
      items: z
        .array(
          z.object({
            msg: z.string(),
            commitId: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
});

export const BuildSchema = z.object({
  buildNumber: z.number(),
  url: z.string().url(),
  downloadUrl: z.string().url().nullable(),
  minecraftVersion: z.string(),
  timestamp: z.number(),
  isExperimental: z.boolean(),
  commit: z.object({
    message: z.string().nullable(),
    hash: z.string().nullable(),
  }),
});

export class JenkinsError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'JenkinsError';
  }
}

async function fetchJenkins<T>(path: string, schema: z.ZodType<T>) {
  const baseUrl = new URL(JENKINS_BASE_URL);
  const url = new URL(path.replace(/^\//, ''), baseUrl);
  url.pathname = `${url.pathname}/api/json`; // append /api/json to the path

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url.toString(), { signal: controller.signal, next: { revalidate: 60 } });

    if (!res.ok) {
      throw new JenkinsError(`Jenkins API Error: ${res.status}`, res.status);
    }

    const data = await res.json();
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new JenkinsError('Invalid API response format', 500);
    }
    if (error instanceof JenkinsError) throw error;
    throw new JenkinsError('Failed to communicate with Jenkins', 500);
  } finally {
    clearTimeout(timeout);
  }
}

function parseBuild(build: z.infer<typeof JenkinsBuildSchema>) {
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

export async function getBuilds(options?: { minecraftVersion?: string; includeExperimental?: boolean }) {
  const { builds } = await fetchJenkins(
    'job/Canvas?tree=builds[number,url,displayName,result,timestamp,artifacts[relativePath],changeSet[items[msg,commitId]]]',
    z.object({ builds: z.array(JenkinsBuildSchema) }),
  );

  return builds
    .filter(
      (b): b is z.infer<typeof JenkinsBuildSchema> & { result: 'SUCCESS' } => !b.building && b.result === 'SUCCESS',
    )
    .map(parseBuild)
    .filter(
      (b) =>
        (!options?.minecraftVersion || b.minecraftVersion === options.minecraftVersion) &&
        ((options?.includeExperimental ?? true) ? true : !b.isExperimental),
    );
}

export async function getLatestBuild(includeExperimental = true) {
  const { builds } = await fetchJenkins(
    'job/Canvas?tree=builds[number,url,displayName,result,timestamp,artifacts[relativePath],changeSet[items[msg,commitId]]]',
    z.object({ builds: z.array(JenkinsBuildSchema) }),
  );

  const validBuilds = builds
    .filter(
      (b): b is z.infer<typeof JenkinsBuildSchema> & { result: 'SUCCESS' } => !b.building && b.result === 'SUCCESS',
    )
    .map(parseBuild)
    .filter((b) => (includeExperimental ? true : !b.isExperimental));

  if (!validBuilds.length) throw new JenkinsError('No successful builds found', 404);
  return validBuilds[0];
}
