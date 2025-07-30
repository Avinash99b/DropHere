import LegalPageLayout from "@/components/legal-page-layout";

export default function PrivacyPolicyPage() {
    return (
        <LegalPageLayout title="Privacy Policy">
            <div className="space-y-6 text-muted-foreground">
                <p>
                    <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <p>
                    Welcome to DropHere. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">1. Collection of Your Information</h2>
                    <p>
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                        <li>
                            <strong>Content Data:</strong> When you use our service to transfer text or files, the content is processed by our servers. For text-based transfers, the text content is stored temporarily on our servers. For file-based transfers, we only store the necessary connection metadata (your PeerJS ID) to facilitate the peer-to-peer connection. The file itself is transferred directly between the sender and receiver and does not permanently reside on our servers.
                        </li>
                        <li>
                            <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site. We also collect usage data via Google Analytics as described below.
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">2. Use of Your Information</h2>
                    <p>
                        Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                        <li>Facilitate the core functionality of text and file transfer.</li>
                        <li>Generate a unique, temporary code for accessing the shared content.</li>
                        <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
                        <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">3. Data Retention Policy</h2>
                    <p>
                        We are committed to not holding your data for longer than necessary. Our retention periods are as follows:
                    </p>
                    <ul className="list-disc list-inside pl-4 space-y-2">
                        <li>
                            <strong>Text Content:</strong> Text data submitted for transfer is automatically and permanently deleted from our servers exactly <strong>10 minutes</strong> after it is created. After this period, the data is irrecoverable.
                        </li>
                        <li>
                            <strong>File Transfer Metadata:</strong> The PeerJS ID associated with a file transfer is automatically and permanently deleted from our servers exactly <strong>10 minutes</strong> after it is created. This is the time window in which the peer-to-peer connection must be established.
                        </li>
                         <li>
                            <strong>Server Logs:</strong> Standard server logs, which may include IP addresses and browser types, are retained for a period of <strong>30 days</strong> for security and diagnostic purposes.
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">4. Disclosure of Your Information</h2>
                    <p>
                        We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. We may, however, share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                     <ul className="list-disc list-inside pl-4 space-y-2">
                        <li>
                           <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                        </li>
                        <li>
                           <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis and hosting services. We use Google Analytics for monitoring site traffic and usage patterns.
                        </li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">5. Use of Cookies and Tracking Technologies</h2>
                    <p>
                        We use cookies to help customize the Site and improve your experience. We also use third-party services like Google Analytics and Google AdSense, which may use cookies, web beacons, and other tracking technologies to collect information about you and to display ads.
                    </p>
                    <p>
                        You are encouraged to review their privacy policies and contact them directly for responses to your questions. You can opt-out of interest-based ads served by Google by visiting the <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google ad settings page</a>.
                    </p>
                </section>
                
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">6. Security of Your Information</h2>
                    <p>
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">7. Your Data Rights</h2>
                    <p>
                        Given the ephemeral nature of our service, data such as shared text and file metadata is automatically deleted after 10 minutes. Therefore, rights to access, correction, or deletion are met by this automated process. For any persistent data inquiries, please contact us.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">8. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@drophere.com" className="text-primary hover:underline">privacy@drophere.com</a>
                    </p>
                </section>
            </div>
        </LegalPageLayout>
    );
}
