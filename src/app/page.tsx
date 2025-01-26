import BenchmarkSection from '~/components/benchmark-section';
import FeaturesSection from '~/components/features-section';
import Hero from '~/components/hero';

export default function Home() {
  return (
    <main>
      <Hero />
      <FeaturesSection />
      <BenchmarkSection />
    </main>
  );
}
