import { Download, GitCommit } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { getBuilds } from '~/lib/jenkins';
import type { Build } from '~/lib/schemas/jenkins';

export const dynamic = 'force-dynamic';

function BuildRow({ build, isLatest }: { build: Build; isLatest: boolean }) {
  const { buildNumber, commit, downloadUrl } = build;
  const commitHash = commit.hash?.slice(0, 7);
  const commitUrl = commit.hash ? `https://github.com/CraftCanvasMC/Canvas/commit/${commit.hash}` : '#';

  return (
    <div className='flex flex-col justify-between gap-4 border-neutral-800 border-t py-4 sm:flex-row sm:items-center'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
        <span className='w-fit rounded-full bg-neutral-800 px-2.5 py-0.5 font-medium text-neutral-300 text-xs'>
          #{buildNumber}
        </span>

        <div className='space-y-1'>
          <a
            href={commitUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-neutral-500 text-sm hover:text-neutral-400'
          >
            <GitCommit className='h-3.5 w-3.5' />
            {commitHash || 'unknown'}
          </a>
          <p className='break-words text-neutral-300 text-sm'>{commit.message || 'No commit message'}</p>
        </div>
      </div>

      <Button
        size='default'
        variant={isLatest ? 'default' : 'secondary'}
        asChild={!!downloadUrl}
        disabled={!downloadUrl}
        className='w-full sm:w-auto'
      >
        {downloadUrl ? (
          <a href={downloadUrl} download className='inline-flex items-center gap-2'>
            <Download className='h-4 w-4' />
            Download
          </a>
        ) : (
          <span className='inline-flex items-center gap-2'>
            <Download className='h-4 w-4' />
            Unavailable
          </span>
        )}
      </Button>
    </div>
  );
}

export default async function DownloadsPage() {
  const builds = await getBuilds({ includeExperimental: true });

  const buildsByVersion = builds.reduce<Record<string, Build[]>>((grouped, build) => {
    grouped[build.minecraftVersion] ??= [];
    grouped[build.minecraftVersion].push(build);
    return grouped;
  }, {});

  const versions = Object.keys(buildsByVersion).sort().reverse();
  const latestVersion = versions[0];
  const latestBuilds = buildsByVersion[latestVersion]?.slice(0, 10) ?? [];

  return (
    <section className='mt-12 sm:mt-16'>
      <Card className='p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <Select defaultValue={latestVersion}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select version' />
            </SelectTrigger>
            <SelectContent>
              {versions.map(version => (
                <SelectItem key={version} value={version}>
                  Minecraft {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          {latestBuilds.map((build, index) => (
            <BuildRow key={build.buildNumber} build={build} isLatest={index === 0} />
          ))}
        </div>

        <div className='mt-8 text-center'>
          <a
            href='https://jenkins.canvasmc.io'
            target='_blank'
            rel='noopener noreferrer'
            className='text-neutral-400 text-sm hover:text-neutral-300'
          >
            Looking for older builds? Check out our Jenkins server →
          </a>
        </div>
      </Card>
    </section>
  );
}
