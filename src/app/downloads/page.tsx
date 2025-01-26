import { Download } from 'lucide-react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import GradientBackground from '~/components/ui/gradient-background';
import { BuildSchema, getBuilds } from '~/lib/jenkins';

import { VersionBuildsTable } from './version-builds-table';

export const dynamic = 'force-dynamic';

export default async function DownloadsPage() {
  const builds = await getBuilds();

  // Group builds by Minecraft version and sort them
  const buildsByVersion = builds.reduce<Record<string, z.infer<typeof BuildSchema>[]>>((grouped, build) => {
    const versionBuilds = grouped[build.minecraftVersion] || [];
    grouped[build.minecraftVersion] = [...versionBuilds, build];
    return grouped;
  }, {});

  const sortedVersions = Object.keys(buildsByVersion).sort().reverse();
  const sortedBuildsByVersion = Object.fromEntries(
    sortedVersions.map((version) => [version, buildsByVersion[version].sort((a, b) => b.buildNumber - a.buildNumber)]),
  );

  const latestBuild = sortedBuildsByVersion[sortedVersions[0]]?.[0];

  return (
    <main className='relative isolate min-h-screen' role='main' aria-label='Downloads page'>
      <GradientBackground />

      <article className='mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <header className='mx-auto max-w-3xl text-center'>
          <h1 className='text-3xl font-bold sm:text-5xl lg:text-6xl'>Downloads</h1>
          <p className='mt-6 text-neutral-300 sm:text-lg'>
            Get the latest builds of CanvasMC for your Minecraft server.
          </p>

          {latestBuild?.downloadUrl && (
            <Button size='lg' asChild className='mt-6 sm:mt-8'>
              <a
                href={latestBuild.downloadUrl}
                download
                className='inline-flex items-center gap-2'
                aria-label={`Download latest Canvas build for Minecraft ${sortedVersions[0]}`}
              >
                <Download className='h-4 w-4' aria-hidden='true' />
                <span className='text-sm sm:text-base'>Download Latest Build</span>
              </a>
            </Button>
          )}
        </header>

        <div className='mt-8 space-y-6 sm:mt-12 sm:space-y-8' role='region' aria-label='Available builds by version'>
          {sortedVersions.map((version) => (
            <VersionBuildsTable key={version} version={version} builds={sortedBuildsByVersion[version]} />
          ))}
        </div>
      </article>
    </main>
  );
}
