import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/hero';
import TransferSection from '@/components/transfer-section';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <TransferSection />
      </main>
      <Footer />
    </div>
  );
}
