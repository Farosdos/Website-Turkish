import { Download } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { getBuilds } from '~/lib/jenkins';

import { VersionBuildsTable } from './version-builds-table';

export const dynamic = 'force-dynamic';

export default async function DownloadsPage() {
  const builds = await getBuilds();
  const groupedBuilds = builds.reduce(
    (acc, build) => ({
      ...acc,
      [build.minecraftVersion]: [...(acc[build.minecraftVersion] || []), build],
    }),
    {} as Record<string, typeof builds>,
  );
  const sortedVersions = Object.keys(groupedBuilds).sort().reverse();
  const latestBuild = groupedBuilds[sortedVersions[0]]?.[0];

  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-fuchsia-500 to-sky-600 opacity-13 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Downloads</h1>
          <p className="mt-4 text-base text-neutral-300 sm:text-lg">
            Get the latest builds of CanvasMC for your Minecraft server.
          </p>
          {latestBuild?.downloadUrl && (
            <Button size="lg" className="mt-8 h-12 px-6 text-[0.95rem] font-medium" asChild>
              <a href={latestBuild.downloadUrl} download className="flex items-center">
                <Download className="mr-2 h-4.5 w-4.5" />
                Download Latest Build
              </a>
            </Button>
          )}
        </div>

        <div className="mt-16 space-y-8">
          {sortedVersions.map((version) => (
            <VersionBuildsTable
              key={version}
              version={version}
              builds={groupedBuilds[version].sort((a, b) => b.buildNumber - a.buildNumber)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
