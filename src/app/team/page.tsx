import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card } from '~/components/ui/card';

interface TeamMember {
  name: string;
  role: string;
  github?: string;
}

interface TeamSection {
  description: string;
  members: TeamMember[];
}

const TEAM_MEMBERS: Record<string, TeamSection> = {
  'Leadership Team': {
    description: 'The core team driving Canvas forward.',
    members: [
      {
        name: 'Dueris',
        github: 'Dueris',
        role: 'Founder',
      },
    ],
  },
  'Development Team': {
    description: 'Key contributors actively developing and maintaining the project.',
    members: [
      {
        name: 'feenko',
        github: 'feenko',
        role: 'Web Developer',
      },
      {
        name: 'Ventitoja',
        github: 'Ventitoja',
        role: 'Web Developer',
      },
    ],
  },
  'Infrastructure Team': {
    description: 'The team responsible for maintaining our hosting infrastructure and build systems.',
    members: [
      {
        name: 'MrMasrozYTLIVE',
        github: 'MrMasrozYTLIVE',
        role: 'Jenkins Host',
      },
    ],
  },
};

function TeamMember({ name, role, github }: TeamMember) {
  const content = (
    <div className='flex items-center gap-4'>
      <Avatar className='size-12'>
        <AvatarImage src={`https://github.com/${github}.png`} alt={`${name}'s avatar`} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className='font-semibold text-white'>{name}</h3>
        <p className='text-neutral-400 text-sm'>{role}</p>
      </div>
    </div>
  );

  if (github) {
    return (
      <a href={`https://github.com/${github}`} target='_blank' rel='noopener noreferrer'>
        <Card className='p-5 transition-all hover:bg-neutral-800/50 hover:ring-1 hover:ring-neutral-700'>
          {content}
        </Card>
      </a>
    );
  }

  return <Card className='p-5'>{content}</Card>;
}

interface Contributor {
  login: string;
  avatar_url: string;
  html_url: string;
  type: string;
  contributions: number;
}

function ContributorAvatar({ url, avatar, username }: { url: string; avatar: string; username: string }) {
  return (
    <a href={url} target='_blank' rel='noopener noreferrer' className='group'>
      <Avatar className='size-16 ring-1 ring-neutral-600 transition group-hover:ring-neutral-400'>
        <AvatarImage src={avatar} alt={`${username}'s GitHub profile`} />
        <AvatarFallback>{username[0]}</AvatarFallback>
      </Avatar>
    </a>
  );
}

export default async function TeamPage() {
  const repos = ['Canvas', 'Website'];
  const responses = await Promise.all(
    repos.map(repo =>
      fetch(`https://api.github.com/repos/CraftCanvasMC/${repo}/contributors`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
        next: { revalidate: 3600 },
      }),
    ),
  );

  if (responses.some(res => !res.ok)) {
    throw new Error('Failed to fetch contributors');
  }

  const contributorsData = await Promise.all(responses.map(res => res.json()));

  const contributors = (
    Object.values(
      contributorsData.flat().reduce(
        (acc, contributor: Contributor) => {
          if (contributor.type !== 'User') return acc;

          const existing = acc[contributor.login];
          acc[contributor.login] = {
            ...contributor,
            contributions: (existing?.contributions || 0) + contributor.contributions,
          };
          return acc;
        },
        {} as Record<string, Contributor & { contributions: number }>,
      ),
    ) as Contributor[]
  ).sort((a, b) => b.contributions - a.contributions || a.login.localeCompare(b.login));

  return (
    <>
      {Object.entries(TEAM_MEMBERS).map(
        ([teamName, { description, members }]) =>
          members.length > 0 && (
            <section key={teamName} className='mt-12 sm:mt-16' aria-labelledby={`${teamName.toLowerCase()}-heading`}>
              <h2 id={`${teamName.toLowerCase()}-heading`} className='font-semibold text-2xl text-white'>
                {teamName}
              </h2>
              <p className='mt-2 mb-6 text-neutral-300'>{description}</p>
              <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                {members.map(member => (
                  <TeamMember key={member.name} {...member} />
                ))}
              </div>
            </section>
          ),
      )}

      <section className='mt-12 sm:mt-16' aria-labelledby='contributors-heading'>
        <h2 id='contributors-heading' className='font-semibold text-2xl text-white'>
          Contributors
        </h2>
        <p className='mt-2 mb-6 text-neutral-300'>Our amazing contributors who help make CanvasMC better.</p>
        <div className='flex flex-wrap gap-4'>
          {contributors.map((contributor: Contributor) => (
            <ContributorAvatar
              key={contributor.login}
              url={contributor.html_url}
              avatar={contributor.avatar_url}
              username={contributor.login}
            />
          ))}
        </div>
      </section>
    </>
  );
}
