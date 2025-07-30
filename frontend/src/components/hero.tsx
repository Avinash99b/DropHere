export default function Hero() {
  return (
    <section className="py-8 md:py-16 bg-background">
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl leading-[1.5] md:text-6xl md:leading-[1.5] font-bold tracking-tighter mb-4 font-headline bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-400">
          Share Instantly, Securely.
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
          DropHere is the simplest way to send text and files to any device. Fast, private, and free. No registration required.
        </p>
      </div>
    </section>
  );
}
