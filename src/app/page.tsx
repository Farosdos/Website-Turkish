import { Community } from '~/components/sections/community';
import { Features } from '~/components/sections/features';
import { Hero } from '~/components/sections/hero';
import { GradientBackground } from '~/components/ui/gradient-background';

export default function Home() {
  return (
    <>
      <GradientBackground />
      <Hero />
      <Features />
      <Community />
    </>
  );
}
