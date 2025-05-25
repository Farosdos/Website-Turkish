'use client';

import { useState } from 'react';
import { Download, GitCommit } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import type { Build } from '~/lib/schemas/jenkins';

function BuildRow({ build, isLatest }: { build: Build; isLatest: boolean }) {
  const { buildNumber, commits, downloadUrl } = build;
  const publishDate = new Date(build.timestamp);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(publishDate);
  const MAX_COMMITS = 100;

  return (
    <div className="flex flex-col justify-between gap-4 border-neutral-800 border-t py-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="w-fit shrink-0 rounded-full bg-neutral-800 px-2.5 py-0.5 font-medium text-neutral-300 text-xs">
            #{buildNumber}
          </span>
          {build.isExperimental && (
            <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
              Experimental
            </span>
          )}
        </div>
        <span className="text-neutral-500 text-xs">{formattedDate}</span>

        <div className="min-w-0 flex-1 space-y-2">
          {commits.length === 0 ? (
            <span className="text-neutral-300 text-sm">No changes</span>
          ) : (
            commits.slice(0, MAX_COMMITS).map((commit) => (
              <div key={commit.hash} className="min-w-0 space-y-1">
                <div className="flex min-w-0 items-center gap-1.5">
                  <a
                    href={`https://github.com/CraftCanvasMC/Canvas/commit/${commit.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 text-neutral-500 text-sm hover:text-neutral-400"
                  >
                    <GitCommit className="size-3.5" />
                    {commit.hash?.slice(0, 7)}
                  </a>
                  <p className="min-w-0 break-words text-neutral-300 text-sm">
                    {commit.message || 'No commit message'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Button
        variant={isLatest ? 'default' : 'secondary'}
        asChild={!!downloadUrl}
        disabled={!downloadUrl}
        className="w-full shrink-0 sm:w-auto"
      >
        {downloadUrl ? (
          <a href={downloadUrl} download className="inline-flex items-center gap-2">
            <Download className="size-4" />
            Download
          </a>
        ) : (
          <span className="inline-flex items-center gap-2">
            <Download className="size-4" />
            Unavailable
          </span>
        )}
      </Button>
    </div>
  );
}

export default function DownloadsPage({
  buildsByVersion,
  versions,
}: {
  buildsByVersion: Record<string, Build[]>;
  versions: string[];
}) {
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);

  const builds = buildsByVersion[selectedVersion] ?? [];

  return (
    <section className="mt-12 sm:mt-16">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <Select
            value={selectedVersion}
            onValueChange={(value) => {
              if (value && versions.includes(value)) {
                setSelectedVersion(value);
              }
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select version" />
            </SelectTrigger>
            <SelectContent>
              {versions.map((version) => (
                <SelectItem key={version} value={version}>
                  Minecraft {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {builds.length === 0 ? (
            <p className="text-neutral-300 text-center">No builds available for this version.</p>
          ) : (
            builds.map((build, index) => (
              <BuildRow key={build.buildNumber} build={build} isLatest={index === 0} />
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <a
            href="https://jenkins.canvasmc.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 text-sm hover:text-neutral-300"
          >
            Looking for older builds? Check out our Jenkins server →
          </a>
        </div>
      </Card>
    </section>
  );
}
