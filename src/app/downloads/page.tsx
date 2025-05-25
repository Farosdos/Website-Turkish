import { getBuilds } from '~/lib/jenkins';
import type { Build } from '~/lib/schemas/jenkins';
import DownloadsPage from './DownloadsPage.client';

export default async function Page() {
    const builds = await getBuilds({ includeExperimental: true });

    const buildsByVersion = builds.reduce<Record<string, Build[]>>((grouped, build) => {
      grouped[build.minecraftVersion] ??= [];
      grouped[build.minecraftVersion].push(build);
      return grouped;
    }, {});

    for (const version in buildsByVersion) {
      buildsByVersion[version] = buildsByVersion[version].slice(0, 100);
    }

    const versions = Object.keys(buildsByVersion).sort().reverse();

    return <DownloadsPage buildsByVersion={buildsByVersion} versions={versions} />;
}
