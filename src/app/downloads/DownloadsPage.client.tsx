'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, GitCommit, LayoutList, PanelsTopLeft, BookOpenText } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { CodeBlock } from '~/components/ui/code-block';
import { Card } from '~/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Redirecting } from '~/components/redirecting';
import type { Build } from '~/lib/schemas/jenkins';

function BuildRow({ build, isLatest }: { build: Build; isLatest: boolean }) {
  const { buildNumber, commits, downloadUrl } = build;
  const publishDate = new Date(build.timestamp);

  const formattedDate = `${String(publishDate.getDate()).padStart(2, '0')}.${String(
    publishDate.getMonth() + 1
  ).padStart(2, '0')}.${publishDate.getFullYear()} ${String(
    publishDate.getHours()
  ).padStart(2, '0')}:${String(publishDate.getMinutes()).padStart(2, '0')}`;

  const now = new Date();
  const diffMs = now.getTime() - publishDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  let relativeTime;
  if (diffYears > 0) relativeTime = `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  else if (diffMonths > 0) relativeTime = `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  else if (diffDays > 0) relativeTime = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  else if (diffHours > 0) relativeTime = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  else if (diffMins > 0) relativeTime = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  else relativeTime = 'just now';

  const MAX_COMMITS = 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group flex flex-col justify-between gap-4 border-neutral-800 border-t py-4 px-4 sm:px-6 sm:flex-row sm:items-center
                 transition-transform duration-200 ease-out transform
                 hover:scale-[1.02] hover:shadow-lg hover:border hover:border-white/20 hover:rounded-lg"
    >
      <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center">
        <div className="flex flex-col justify-center pr-6 sm:pr-8 border-r border-white/10 min-w-[120px] sm:min-w-[140px]">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-neutral-100">#{buildNumber}</span>
            {build.result === 'FAILURE' ? (
              <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs font-semibold text-red-400">
                Failed
              </span>
            ) : build.result === 'ABORTED' ? (
              <span className="rounded-full bg-gray-500/20 px-2 py-0.5 text-xs font-semibold text-gray-400">
                Cancelled
              </span>
            ) : build.isExperimental ? (
              <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-semibold text-yellow-400">
                Experimental
              </span>
            ) : null}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1">
            {formattedDate} <span className="text-neutral-600">({relativeTime})</span>
          </span>
        </div>

        <div className="flex-1 min-w-0 pl-6 sm:pl-8 mt-3 sm:mt-0 space-y-2">
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
        asChild={!!build.downloadUrl}
        disabled={!build.downloadUrl}
        className="w-full shrink-0 sm:w-auto"
      >
        {build.downloadUrl ? (
          <a href={build.downloadUrl} download className="inline-flex items-center gap-2">
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
    </motion.div>
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
  const [showNewTab, setShowNewTab] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [areBuildsVisible, setAreBuildsVisible] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const MAX_BUILDS = 11;
  const builds = buildsByVersion[selectedVersion]?.slice(0, MAX_BUILDS) ?? [];

  useEffect(() => {
    const timers = [
      setTimeout(() => setIsHeaderVisible(true), 150),
      setTimeout(() => setAreBuildsVisible(true), 450),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const clearRedirect = () => setRedirecting(false);
    window.addEventListener('pageshow', clearRedirect);
    return () => window.removeEventListener('pageshow', clearRedirect);
  }, []);

  const handleJavadocRedirect = () => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = `/api/v2/jd/?version=${selectedVersion}&experimental=false`;
    }, 150);
  };

  return (
    <section className="mt-12 sm:mt-16 relative">
      <Redirecting show={redirecting} target="Javadocs" />
      <Card className="p-6 overflow-hidden">
        <AnimatePresence>
          {isHeaderVisible && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="mb-6 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <Select
                  value={selectedVersion}
                  onValueChange={(value) => {
                    if (value && versions.includes(value)) setSelectedVersion(value);
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
                <button
                  onClick={handleJavadocRedirect}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                  title="View Javadocs"
                >
                  <BookOpenText className="size-5 text-neutral-300 hover:text-neutral-100" />
                </button>
              </div>

              <Button
                variant={showNewTab ? 'default' : 'secondary'}
                onClick={() => setShowNewTab((prev) => !prev)}
                className="flex items-center gap-2 transform transition-transform duration-200 hover:scale-105"
              >
                {showNewTab ? (
                  <>
                    <LayoutList className="size-4" />
                    Show Builds
                  </>
                ) : (
                  <>
                    <PanelsTopLeft className="size-4" />
                    Show Sculptor
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showNewTab ? (
            <motion.div
              key={`sculptor-${selectedVersion}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-center sm:text-left"
            >
              <h2 className="text-xl font-semibold mb-2 text-center">Sculptor Launcher</h2>
              <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
                Sculptor is the official auto-updating launcher for Canvas. It ensures you're always on the latest version
                without needing to manually download builds. This is Minecraft-version specific too, so it will only update
                to the Minecraft version you specify.
              </p>

              <div className="mt-6 text-center">
                <Button asChild className="inline-flex items-center gap-2 px-6 py-2">
                  <a
                    href="https://jenkins.canvasmc.io/job/Sculptor/lastSuccessfulBuild/artifact/build/libs/Sculptor-1.0.0-SNAPSHOT.jar"
                    download
                  >
                    <Download className="size-4" />
                    Download Sculptor
                  </a>
                </Button>
              </div>

              <div className="mt-8 text-left">
                <h3 className="text-lg font-semibold mb-3 text-neutral-200">Example Usage</h3>
                <CodeBlock language="cmd">
                  {`$ java -Dsculptor.minecraftVersion=${selectedVersion} -Dsculptor.includeExperimental=true -jar sculptor.jar`}
                </CodeBlock>
              </div>

              <div className="mt-8 text-left">
                <h3 className="text-lg font-semibold mb-3 text-neutral-200">Arguments Explained</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-300">
                  <li>
                    <code className="text-neutral-100">-Dsculptor.minecraftVersion</code> — <br />
                    <span className="text-neutral-400">
                      <strong>Required.</strong> Specifies the Minecraft version Sculptor should download and manage builds for.
                      Without this, Sculptor will fail to launch.
                    </span>
                  </li>
                  <li>
                    <code className="text-neutral-100">-Dsculptor.includeExperimental</code> — <br />
                    <span className="text-neutral-400">
                      <strong>Optional.</strong> Accepts <code>true</code> or <code>false</code> (default: <code>false</code>). If set to <code>true</code>,
                      Sculptor will also include experimental Canvas builds instead of only stable ones.
                    </span>
                  </li>
                  <li>
                    <code className="text-neutral-100">-Dsculptor.serverFileName</code> — <br />
                    <span className="text-neutral-400">
                      <strong>Optional.</strong> Sets the name of the downloaded server jar file. Defaults to <code>server.jar</code> if not specified.
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`builds-${selectedVersion}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-2"
            >
              {builds.length === 0 ? (
                <p className="text-neutral-300 text-center">No builds available for this version.</p>
              ) : (
                builds.map((build, index) => (
                  <motion.div
                    key={build.buildNumber}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.35 }}
                  >
                    <BuildRow build={build} isLatest={index === 0} />
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: areBuildsVisible ? 1 : 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="mt-8 text-center"
        >
          <a
            href="https://jenkins.canvasmc.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 text-sm hover:text-neutral-300"
          >
            Looking for older builds? Check out our Jenkins server →
          </a>
        </motion.div>
      </Card>
    </section>
  );
}
