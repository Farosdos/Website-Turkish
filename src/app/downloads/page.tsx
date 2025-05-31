// app/downloads/page.tsx
import DownloadsPage from './DownloadsPage.client';
import { getAllBuilds } from '~/lib/jenkins';

export const dynamic = 'force-dynamic';

export default async function DownloadsServerPage() {
  const builds = await getAllBuilds({ includeExperimental: true });

  const filteredBuilds = builds.filter(b => b.minecraftVersion !== 'unknown');

  const buildsByVersion = filteredBuilds.reduce<Record<string, typeof filteredBuilds>>((grouped, build) => {
    grouped[build.minecraftVersion] ??= [];
    grouped[build.minecraftVersion].push(build);
    return grouped;
  }, {});

  const versions = Object.keys(buildsByVersion).sort().reverse();

  return <DownloadsPage buildsByVersion={buildsByVersion} versions={versions} />;
}
