import LegalPageLayout from "@/components/legal-page-layout";

export default function TermsAndConditionsPage() {
    return (
        <LegalPageLayout title="Terms and Conditions">
            <div className="space-y-6 text-muted-foreground">
                <p>
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <p>
                    Please read these Terms and Conditions ("Terms") carefully before using the DropHere website (the "Service") operated by us. Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the Service.
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the Service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">2. Description of Service</h2>
                    <p>
                        DropHere provides a free, anonymous, and ephemeral file and text sharing service. Content is accessible via a unique, randomly generated 6-digit code.
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                        <li><strong>Text Transfers:</strong> Text is stored on our servers for a maximum of 10 minutes.</li>
                        <li><strong>File Transfers:</strong> Files are transferred directly between users (peer-to-peer). We only store the connection information for a maximum of 10 minutes to facilitate this transfer. We do not store your files.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">3. User Conduct and Responsibilities</h2>
                    <p>You agree not to use the Service to:</p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                        <li>Upload, post, or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically, or otherwise objectionable.</li>
                        <li>Transmit any material that contains software viruses or any other computer code, files, or programs designed to interrupt, destroy, or limit the functionality of any computer software or hardware or telecommunications equipment.</li>
                        <li>Share copyrighted material for which you do not have the legal right to distribute.</li>
                        <li>Engage in any activity that is illegal or violates the rights of others.</li>
                    </ul>
                    <p>
                        We are not responsible for the content shared by users of the service. You are solely responsible for the content you transfer and for any consequences thereof.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">4. Intellectual Property</h2>
                    <p>
                        The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of DropHere and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">5. Disclaimer of Warranties</h2>
                    <p>
                        The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The use of the Service is at your own risk. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
                    </p>
                    <p>
                        We do not warrant that the service will function uninterrupted, secure, or available at any particular time or location; or that any errors or defects will be corrected.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">6. Limitation of Liability</h2>
                    <p>
                        In no event shall DropHere, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>
                </section>
                
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">7. Third-Party Links &amp; Advertisements</h2>
                    <p>
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by DropHere. We may also display advertisements from third parties, such as Google AdSense. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party web sites or services. 
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">8. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">9. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">10. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at: <a href="mailto:terms@drophere.com" className="text-primary hover:underline">terms@drophere.com</a>
                    </p>
                </section>
            </div>
        </LegalPageLayout>
    );
}
