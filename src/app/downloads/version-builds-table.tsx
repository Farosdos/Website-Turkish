'use client';

import { ChevronLeft, ChevronRight, Download, GitCommit } from 'lucide-react';
import { z } from 'zod';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { BuildSchema } from '~/lib/jenkins';
import { cn } from '~/lib/utils';

import { useState } from 'react';

const BUILDS_PER_PAGE = 6;

type TableRowProps = {
  build: z.infer<typeof BuildSchema>;
  isLatest: boolean;
};

function TableRow({ build, isLatest }: TableRowProps) {
  return (
    <tr className={cn('border-t border-neutral-700/50', isLatest && 'bg-neutral-800/50')}>
      <td className="px-4 py-3.5 text-[0.95rem] whitespace-nowrap">#{build.buildNumber}</td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        {build.commit.hash && (
          <a
            href={`https://github.com/CraftCanvasMC/Canvas/commit/${build.commit.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-300"
          >
            <GitCommit className="h-4 w-4" />
            {build.commit.hash?.slice(0, 7)}
          </a>
        )}
      </td>
      <td className="hidden px-4 py-3.5 sm:table-cell">
        <span className="line-clamp-1 text-[0.95rem]">{build.commit.message || 'No message'}</span>
      </td>
      <td className="px-4 py-3.5 text-right sm:text-left">
        <Button
          size="sm"
          variant={isLatest ? 'default' : 'secondary'}
          asChild={!!build.downloadUrl}
          disabled={!build.downloadUrl}
          className="h-9 px-5 text-[0.95rem] font-medium"
        >
          {build.downloadUrl ? (
            <a href={build.downloadUrl} download className="flex items-center">
              <Download className="mr-1.5 h-4 w-4" />
              Download
            </a>
          ) : (
            <>
              <Download className="mr-1.5 h-4 w-4" />
              Unavailable
            </>
          )}
        </Button>
      </td>
    </tr>
  );
}

export function VersionBuildsTable({ version, builds }: { version: string; builds: z.infer<typeof BuildSchema>[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(builds.length / BUILDS_PER_PAGE);
  const latestBuild = builds[0];

  const currentBuilds = builds.slice((page - 1) * BUILDS_PER_PAGE, page * BUILDS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minecraft {version}</CardTitle>
        {totalPages > 1 && (
          <div className="flex items-center gap-3 text-[0.95rem] text-neutral-400">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 w-9 p-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-9 w-9 p-0"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-[0.95rem] text-neutral-300">
            <thead className="text-sm tracking-wider text-neutral-400 uppercase">
              <tr>
                <th scope="col" className="px-4 py-3.5">
                  Build
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Commit
                </th>
                <th scope="col" className="hidden px-4 py-3.5 sm:table-cell">
                  Changes
                </th>
                <th scope="col" className="px-4 py-3.5 text-right sm:text-left">
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBuilds.map((build) => (
                <TableRow
                  key={build.buildNumber}
                  build={build}
                  isLatest={build.buildNumber === latestBuild.buildNumber}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
