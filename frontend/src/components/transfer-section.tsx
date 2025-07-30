import ReceiveCard from './receive-card';
import SendCard from './send-card';

export default function TransferSection() {
  return (
    <section id="transfer" className="py-12 md:py-4 bg-background">
      <div className="container mx-auto px-4 space-y-16 md:space-y-24">
        <SendCard />
        <ReceiveCard />
      </div>
    </section>
  );
}
