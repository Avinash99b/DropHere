import LegalPageLayout from "@/components/legal-page-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
    const faqs = [
        {
            question: "Is DropHere really free to use?",
            answer: "Yes, absolutely. DropHere is completely free. We support the service through unobtrusive advertisements, which allows us to keep the core functionality available to everyone at no cost."
        },
        {
            question: "Do I need to create an account to use the service?",
            answer: "No, registration is not required. We believe in simplicity and privacy, so you can use DropHere anonymously without creating an account."
        },
        {
            question: "How secure is my data?",
            answer: "We take your privacy and security very seriously. Text-based transfers are stored on our servers for a maximum of 10 minutes before being permanently deleted. For file transfers, we use a direct peer-to-peer (P2P) connection, meaning your files are sent directly from your device to the receiver's device and are never stored on our servers."
        },
        {
            question: "What is the maximum file size I can transfer?",
            answer: "Since file transfers are peer-to-peer, there is no technical limit on the file size imposed by our servers. The transfer speed and success will depend on the internet connection of both the sender and the receiver."
        },
        {
            question: "How long do the transfer codes last?",
            answer: "For text transfers, the code expires when the text data is deleted (after 10 minutes). For file transfers, the connection code is valid for 10 minutes. The receiver must initiate the connection within this timeframe. Once the transfer starts, the code is no longer needed."
        },
        {
            question: "What happens if I close my browser during a file transfer?",
            answer: "If either the sender or receiver closes their browser window before the file transfer is complete, the peer-to-peer connection will be broken and the transfer will be cancelled. You will need to start a new transfer."
        },
        {
            question: "Can I send a file to multiple people at once?",
            answer: "Currently, DropHere is designed for one-to-one transfers. Each generated code is for a single session between two devices. To send a file to multiple people, you would need to initiate a separate transfer for each person."
        },
    ];

    return (
        <LegalPageLayout title="Frequently Asked Questions">
            <div className="space-y-6 text-muted-foreground">
                 <p>
                    Have questions? We’ve got answers. Here are some of the most common questions we receive about our service. If you can't find what you're looking for, feel free to <a href="mailto:support@drophere.com" className="text-primary hover:underline">contact us</a>.
                </p>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-semibold text-foreground">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-base text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </LegalPageLayout>
    );
}