'use client';

import { ChevronLeft, ChevronRight, Download, GitCommit } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Pill } from '~/components/ui/pill';
import type { Build } from '~/lib/schemas/jenkins';
import { cn } from '~/lib/utils';

import { useState } from 'react';

const BUILDS_PER_PAGE = 6;

type TableRowProps = {
  build: Build;
  isLatest: boolean;
};

function TableRow({ build, isLatest }: TableRowProps) {
  return (
    <tr className={cn('border-neutral-700/50 border-t', isLatest && 'bg-neutral-800/50')}>
      <td className='whitespace-nowrap px-4 py-3 text-sm'>#{build.buildNumber}</td>
      <td className='whitespace-nowrap px-4 py-3'>
        {build.commit.hash && (
          <a
            href={`https://github.com/CraftCanvasMC/Canvas/commit/${build.commit.hash}`}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-1.5 text-neutral-400 text-sm hover:text-neutral-300'
          >
            <GitCommit className='h-3.5 w-3.5' />
            {build.commit.hash?.slice(0, 7)}
          </a>
        )}
      </td>
      <td className='hidden px-4 py-3 sm:table-cell'>
        <span className='line-clamp-1 text-sm'>{build.commit.message || 'No message'}</span>
      </td>
      <td className='px-4 py-3 text-right sm:text-left'>
        <Button
          size='sm'
          variant={isLatest ? 'default' : 'secondary'}
          asChild={!!build.downloadUrl}
          disabled={!build.downloadUrl}
          className='h-8 px-4 font-medium text-sm'
        >
          {build.downloadUrl ? (
            <a href={build.downloadUrl} download className='flex items-center'>
              <Download className='mr-1.5 h-3.5 w-3.5' />
              Download
            </a>
          ) : (
            <>
              <Download className='mr-1.5 h-3.5 w-3.5' />
              Unavailable
            </>
          )}
        </Button>
      </td>
    </tr>
  );
}

export function VersionBuildsTable({ version, builds }: { version: string; builds: Build[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(builds.length / BUILDS_PER_PAGE);
  const latestBuild = builds[0];

  const currentBuilds = builds.slice((page - 1) * BUILDS_PER_PAGE, page * BUILDS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Minecraft {version} <Pill variant='warning'>Experimental</Pill>
        </CardTitle>
        {totalPages > 1 && (
          <div className='flex items-center gap-3 text-neutral-400 text-sm'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className='h-8 w-8 p-0'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='h-8 w-8 p-0'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className='relative overflow-x-auto'>
          <table className='w-full text-left text-neutral-300 text-sm'>
            <thead className='text-neutral-400 text-xs uppercase tracking-wider'>
              <tr>
                <th scope='col' className='px-4 py-3'>
                  Build
                </th>
                <th scope='col' className='px-4 py-3'>
                  Commit
                </th>
                <th scope='col' className='hidden px-4 py-3 sm:table-cell'>
                  Changes
                </th>
                <th scope='col' className='px-4 py-3 text-right sm:text-left'>
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBuilds.map(build => (
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
