import { Download } from 'lucide-react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import GradientBackground from '~/components/ui/gradient-background';
import { BuildSchema, getBuilds } from '~/lib/jenkins';

import { VersionBuildsTable } from './version-builds-table';

export const dynamic = 'force-dynamic';

export default async function DownloadsPage() {
  const builds = await getBuilds();

  // group builds by version using direct object mutation
  const buildsByVersion: Record<string, z.infer<typeof BuildSchema>[]> = {};
  for (const build of builds) {
    const version = build.minecraftVersion;
    buildsByVersion[version] = buildsByVersion[version] || [];
    buildsByVersion[version].push(build);
  }

  // sort versions descending and prepare build lists
  const sortedVersions = Object.keys(buildsByVersion).sort().reverse();
  const sortedBuilds = Object.fromEntries(
    sortedVersions.map((version) => [
      version,
      [...buildsByVersion[version]].sort((a, b) => b.buildNumber - a.buildNumber),
    ]),
  );

  const latestBuild = sortedBuilds[sortedVersions[0]]?.[0];

  return (
    <div className='relative isolate'>
      <GradientBackground />

      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-white sm:text-5xl'>Downloads</h1>
          <p className='mt-4 text-base text-neutral-300 sm:text-lg'>
            Get the latest builds of CanvasMC for your Minecraft server.
          </p>

          {latestBuild?.downloadUrl && (
            <Button size='lg' className='mt-8 h-12 px-6 text-[0.95rem] font-medium' asChild>
              <a href={latestBuild.downloadUrl} download className='flex items-center'>
                <Download className='mr-2 h-4.5 w-4.5' />
                Download Latest Build
              </a>
            </Button>
          )}
        </div>

        <div className='mt-16 space-y-8'>
          {sortedVersions.map((version) => (
            <VersionBuildsTable key={version} version={version} builds={sortedBuilds[version]} />
          ))}
        </div>
      </div>
    </div>
  );
}
