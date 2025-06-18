'use client';

import { Cpu, FileSliders, Layers, Terminal, Users, Zap } from 'lucide-react';
import { Card } from '~/components/ui/card';
import Link from 'next/link';

const FEATURES = [
  {
    title: 'Multithreaded Performance',
    description:
      'Leverage multiple CPU cores for ticking the server, dramatically improving performance.',
    icon: Cpu,
  },
  {
    title: 'Enhanced Entity Handling',
    description:
      'Better entity handling with asynchronous pathfinding, threaded entity tracking and many more optimizations.',
    icon: Layers,
  },
  {
    title: 'Optimized Chunk Generation',
    description:
      'With fixed linear scaling, chunk performance is unparalleled compared to other forks.',
    icon: Zap,
  },
  {
    title: 'Prioritized Plugin Support',
    description:
      'Prioritizes plugin support when making major changes to ensure your plugins will stay compatible.',
    icon: Terminal,
  },
  {
    title: 'Optional Regionizing',
    description:
      'Implementing a rewrite of Folia’s regionizing implementation, we add optional regionizing to the server.',
    icon: Users,
  },
  {
    title: 'Extensive Configuration',
    description:
      'Fine-tune every aspect of your server with documented configuration options and performance settings.',
    icon: FileSliders,
  },
] as const;

export function Features() {
  return (
    <section className='mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-2'>
      <header className='max-w-9xl'>
        <h2 className='font-semibold text-3xl text-white'>What is Canvas?</h2>
        <p className='mt-10 text-neutral-300 whitespace-pre-line'>
          Canvas is a Minecraft server software introducing a fully multithreaded architecture to the dedicated server through a rewritten
          chunk system executor, parallel world ticking and regionization. Canvas is an attempt at a fully multithreaded Minecraft
          dedicated server without breaking plugin compatibility, and creating a more scalable environment for more modern CPUs.
          {'\n\n'}
          <strong>Canvas is not a simple drop-in replacement for Paper or Purpur. It is a fundamentally different architecture that requires
          some configuration and understanding before use.</strong>
          {'\n\n'}
          Canvas&apos; config (<code>canvas-server.yml</code>) is aimed for vanilla parity and stability rather than raw performance, so it needs to be manually configured to benefit your server. Canvas is also highly hardware-dependent and not well-suited for shared hosting due to its aggressive chunk system executor. That said, it provides significantly higher performance when run on appropriate hardware (at least 10 threads / 5 physical cores recommended).
          {'\n\n'}
          Please thoroughly test before deploying to production, as Canvas introduces a plugin compatibility layer due to its threaded design. If you find a plugin incompatibility, report it in our <Link href="https://canvasmc.io/discord" className="text-sky-400 underline">Discord server</Link>.
          {'\n\n'}
          Canvas includes upstream from <Link href="https://github.com/Winds-Studio/Leaf" className="text-sky-400 underline">Leaf</Link> to improve single-threaded performance. This does <strong>not</strong> mean Canvas is better or worse than Leaf—they are tailored to different goals and environments.
        </p>
      </header>

      <header className='max-w-2xl mt-24'>
        <h2 className='font-semibold text-3xl text-white'>What makes Canvas special?</h2>
        <p className='mt-3 text-lg text-neutral-300'>
          Find out what makes Canvas different from other Minecraft server software.
        </p>
      </header>

      <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {FEATURES.map(({ title, description, icon: Icon }) => (
          <Card
            key={title}
            className='p-5 transition-all duration-200 hover:ring-neutral-600/60'
          >
            <div className='flex gap-4'>
              <div className='shrink-0'>
                <div className='rounded-lg bg-neutral-700/50 p-2.5'>
                  <Icon className='size-5 text-neutral-100' />
                </div>
              </div>
              <div>
                <h3 className='font-medium text-neutral-100'>{title}</h3>
                <p className='mt-1.5 text-neutral-400 text-sm'>{description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
