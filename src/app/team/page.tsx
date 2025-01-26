import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';

import Image from 'next/image';
import Link from 'next/link';

function TeamMember({ name, role, imageSrc }: { name: string; role: string; imageSrc: string }) {
  return (
    <Card className='border-neutral-800 bg-neutral-900/50 p-4'>
      <div className='flex items-center gap-4'>
        <Image src={imageSrc} alt={`${name}'s avatar`} width={48} height={48} className='rounded-full' />
        <div>
          <h3 className='font-semibold text-white'>{name}</h3>
          <p className='text-sm text-neutral-400'>{role}</p>
        </div>
      </div>
    </Card>
  );
}

function Contributor({ url, avatar, username }: { url: string; avatar: string; username: string }) {
  return (
    <Link
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='group'
      aria-label={`View ${username}'s GitHub profile`}
    >
      <Image
        src={avatar}
        alt={`${username}'s avatar`}
        width={64}
        height={64}
        className='rounded-full transition group-hover:scale-105'
      />
    </Link>
  );
}

export default async function TeamPage() {
  const contributors = await fetchContributors();

  return (
    <div className='relative text-white' role='main' aria-label='Team page'>
      <div
        aria-hidden='true'
        className='absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
      >
        <div
          className='relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-fuchsia-500 to-sky-600 opacity-13 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
      {/* Hero Section */}
      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8'>
        <div className='mx-auto max-w-3xl text-center'>
          <h1 className='text-3xl font-bold sm:text-5xl lg:text-6xl'>Meet the Team Behind Canvas</h1>
          <p className='mt-6 text-neutral-300 sm:text-lg'>Our team and contributors that make CanvasMC possible.</p>

          <div className='mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center'>
            <Button asChild>
              <Link href='https://github.com/sponsors/CraftCanvasMC' aria-label='Sponsor CanvasMC on GitHub'>
                Sponsor Us
              </Link>
            </Button>
            <Button asChild variant='ghost'>
              <Link href='https://github.com/CraftCanvasMC/Canvas' aria-label='View CanvasMC on GitHub'>
                Github
              </Link>
            </Button>
          </div>
        </div>

        {/* Leadership Section */}
        <div className='mt-20' role='region' aria-labelledby='leadership-heading'>
          <h2 id='leadership-heading' className='mb-2 text-2xl font-bold text-white'>
            Leadership Team
          </h2>
          <p className='mb-8 text-neutral-300'>The core team driving Canvas forward with vision and dedication.</p>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <TeamMember name='Dueris' role='Founder' imageSrc='https://avatars.githubusercontent.com/u/122416109?v=4' />
          </div>
        </div>

        {/* Contributors Section */}
        <div className='mt-20' role='region' aria-labelledby='contributors-heading'>
          <h2 id='contributors-heading' className='mb-2 text-2xl font-bold text-white'>
            Contributors
          </h2>
          <p className='mb-8 text-neutral-300'>Our amazing contributors who help make CanvasMC better every day.</p>
          <div className='flex flex-wrap gap-4'>
            {contributors.map((contributor) => (
              <Contributor
                key={contributor.login}
                url={contributor.html_url}
                avatar={contributor.avatar_url}
                username={contributor.login}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Data fetching
type GitHubContributor = {
  login: string;
  avatar_url: string;
  html_url: string;
};

async function fetchContributors(): Promise<GitHubContributor[]> {
  const res = await fetch('https://api.github.com/repos/CraftCanvasMC/Canvas/contributors', {
    headers: { Accept: 'application/vnd.github.v3+json' },
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error('Failed to fetch contributors');
  return res.json();
}
