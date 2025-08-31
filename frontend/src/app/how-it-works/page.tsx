import LegalPageLayout from "@/components/legal-page-layout";
import { FileText, Send, Type, Download, HardDriveUpload } from 'lucide-react';
import Image from "next/image";

export default function HowItWorksPage() {
    return (
        <LegalPageLayout title="How It Works">
            <div className="space-y-12 text-muted-foreground">

                <section className="text-center">
                    <h2 className="text-2xl font-bold text-foreground">Sharing Made Simple</h2>
                    <p className="mt-2 max-w-2xl mx-auto">DropHere offers two easy ways to transfer content: sending text or sending files directly. Here’s how you can get started in just a few seconds.</p>
                </section>

                <div className="space-y-8">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/2">
                             <h3 className="text-xl font-bold text-foreground flex items-center mb-2"><span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center mr-3">1</span> Choose Your Method</h3>
                            <p className="mb-4">
                                Navigate to the homepage and decide what you want to send. You’ll see two tabs:
                            </p>
                            <ul className="space-y-3 pl-4">
                                <li className="flex items-start">
                                    <Type className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                    <span><strong>Text:</strong> For quickly sending snippets of text, links, or notes.</span>
                                </li>
                                <li className="flex items-start">
                                    <FileText className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                    <span><strong>File:</strong> For securely transferring files of any size directly to another device.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/2">
                            <Image src="https://picsum.photos/600/400" alt="Choosing transfer method" width={600} height={400} className="rounded-lg shadow-md" data-ai-hint="interface choice" />
                        </div>
                    </div>

                    {/* Step 2 */}
                     <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                        <div className="w-full md:w-1/2">
                             <h3 className="text-xl font-bold text-foreground flex items-center mb-2"><span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center mr-3">2</span> Send Your Content</h3>
                            <p className="mb-4">
                                Based on your choice:
                            </p>
                             <ul className="space-y-3 pl-4">
                                <li className="flex items-start">
                                    <HardDriveUpload className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                    <span>For text, simply type or paste it into the text area. For files, drag and drop them or click to browse.</span>
                                </li>
                                <li className="flex items-start">
                                    <Send className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                    <span>Click the "Send" button. We'll instantly generate a unique 6-digit code for you.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/2">
                            <Image src="https://picsum.photos/600/401" alt="Sending content" width={600} height={401} className="rounded-lg shadow-md" data-ai-hint="uploading file" />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-full md:w-1/2">
                             <h3 className="text-xl font-bold text-foreground flex items-center mb-2"><span className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center mr-3">3</span> Receive on Another Device</h3>
                            <p className="mb-4">
                                On your other device (or a friend's), open DropHere and go to the "Receive" section.
                            </p>
                             <ul className="space-y-3 pl-4">
                                 <li className="flex items-start">
                                    <Download className="h-5 w-5 mr-3 mt-1 text-primary flex-shrink-0" />
                                    <span>Enter the 6-digit code and click "Receive". Your text will appear instantly, or your file download will begin automatically. It's that simple!</span>
                                </li>
                            </ul>
                        </div>
                         <div className="w-full md:w-1/2">
                            <Image src="https://picsum.photos/600/402" alt="Receiving content" width={600} height={402} className="rounded-lg shadow-md" data-ai-hint="downloading success" />
                        </div>
                    </div>
                </div>

            </div>
        </LegalPageLayout>
    );
}