// app/downloads/page.tsx
import DownloadsPage from './DownloadsPage.client';
import { getBuilds } from '~/lib/jenkins';

export const dynamic = 'force-dynamic';

export default async function DownloadsServerPage() {
  const builds = await getBuilds({ includeExperimental: true });

  const buildsByVersion = builds.reduce<Record<string, typeof builds>>((grouped, build) => {
    grouped[build.minecraftVersion] ??= [];
    grouped[build.minecraftVersion].push(build);
    return grouped;
  }, {});

  const versions = Object.keys(buildsByVersion).sort().reverse();

  return <DownloadsPage buildsByVersion={buildsByVersion} versions={versions} />;
}
