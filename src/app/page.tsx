import { Community } from '~/components/sections/community';
import { Features } from '~/components/sections/features';
import { Hero } from '~/components/sections/hero';

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Community />
    </>
  );
}
