import LegalPageLayout from "@/components/legal-page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function AboutUsPage() {
    return (
        <LegalPageLayout title="About Us">
            <div className="space-y-8 text-muted-foreground">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
                    <p>
                        In a world where digital privacy is increasingly scarce, DropHere was founded on a simple principle: sharing should be private, simple, and secure. Our mission is to provide an ephemeral file and text sharing service that respects your privacy by design. We believe you shouldn't have to register for an account or navigate complex interfaces just to send a piece of information from one device to another.
                    </p>
                    <div className="relative h-64 w-full overflow-hidden rounded-lg">
                        <Image src="https://picsum.photos/800/600" alt="Team working collaboratively" layout="fill" objectFit="cover" data-ai-hint="team collaboration" />
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Who We Are</h2>
                    <p>
                        We are a small team of passionate developers and privacy advocates who were frustrated with the state of file sharing. We wanted to build a tool that we would use ourselves—one that is fast, free, and doesn't hoard user data. DropHere is the result of that vision.
                    </p>
                </section>
                
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Our Commitment to Privacy</h2>
                    <p>
                        Privacy isn't just a feature for us; it's our foundation. We are committed to minimizing data collection and ensuring that the data we do handle is deleted permanently after a short period. You can learn more about our data handling practices in our <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                    </p>
                </section>

                 <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
                    <p>
                        We love hearing from our users! If you have any feedback, questions, or suggestions, please don't hesitate to reach out.
                    </p>
                     <p>
                        You can contact us at: <a href="mailto:contact@drophere.com" className="text-primary hover:underline">contact@drophere.com</a>
                    </p>
                </section>
            </div>
        </LegalPageLayout>
    );
}