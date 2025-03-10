import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndPrivacy = () => {
    return (
        <div style={styles.container}>
            {/* Terms of Service */}
            <div style={styles.section}>
                <h1 style={styles.header}>TrackMate MX - Terms of Service</h1>
                <p style={styles.date}>Last Updated: 03/10/25</p>

                <h2 style={styles.subHeader}>1. Acceptance of Terms</h2>
                <p>
                    By signing up or registering on this app, you agree to these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services.
                </p>

                <h2 style={styles.subHeader}>2. Use of Services</h2>
                <p>
                    TrackMate MX helps motocross riders discover tracks, connect with other riders, and manage their profile. By using our services, you agree to:
                </p>
                <ul>
                    <li>Use the app only for lawful purposes.</li>
                    <li>Not engage in any illegal activity through the app.</li>
                </ul>

                <h2 style={styles.subHeader}>3. User Information and Data</h2>
                <p>When you sign up or register, we collect the following personal information:</p>
                <ul>
                    <li>Contact Info: Email, username.</li>
                    <li>User Content: Profile image (uploaded to Cloudinary, stored as a URL).</li>
                    <li>Location Data: Used to find nearby tracks (only if permission is granted).</li>
                    <li>Push Notification Token: Stored in our database to send app notifications.</li>
                    <li>Diagnostics & Other Data: We may collect device information (e.g., OS type) to improve performance.</li>
                </ul>
                <p>
                    By registering, you consent to us using your information to improve user experience and provide services such as notifications, location-based features, and communication.
                </p>

                <h2 style={styles.subHeader}>4. Location and Notifications</h2>
                <p>
                    Location: If you grant permission, we use your location to suggest tracks near you. You can disable this anytime in your device settings.
                </p>
                <p>
                    Push Notifications: We ask for permission to send notifications. If granted, we store your push notification token in our database. You can opt out in your device settings.
                </p>

                <h2 style={styles.subHeader}>5. Third-Party Services</h2>
                <p>We do not sell your personal data. However, we use trusted third-party services to operate the app:</p>
                <ul>
                    <li>Cloudinary: Stores profile images securely.</li>
                    <li>MongoDB: Stores user information securely</li>
                </ul>
                <p>All third-party providers comply with our privacy standards.</p>

                <h2 style={styles.subHeader}>6. Account & Data Deletion</h2>
                <p>
                    You have the right to delete your account and all associated data. To request account deletion, go to the app settings and select "Delete Account." All your data will be permanently deleted.
                </p>

                <h2 style={styles.subHeader}>7. Changes to Terms</h2>
                <p>
                    We may update these terms periodically. Any changes will be communicated through the app or by email.
                </p>

                <h2 style={styles.subHeader}>8. Termination</h2>
                <p>
                    We reserve the right to suspend or terminate your account if you violate these terms.
                </p>

                <h2 style={styles.subHeader}>9. Contact Us</h2>
                <p>If you have any questions, contact us <Link to="https://www.trackmatemx.com/Contact" style={styles.link}>here</Link></p>

                {/* Privacy Policy */}
                <h1 style={styles.header}>TrackMate MX - Privacy Policy</h1>
                <p style={styles.date}>Last Updated: 03/10/25</p>

                <h2 style={styles.subHeader}>1. Information We Collect</h2>
                <p>When you register or use our services, we collect:</p>
                <ul>
                    <li>Contact Info: Email, username.</li>
                    <li>User Content: Profile image (stored via Cloudinary).</li>
                    <li>Location Data: Used to find motocross tracks near you (only if permission is granted).</li>
                    <li>Push Notification Token: Stored to send app notifications.</li>
                    <li>Device & Diagnostic Data: We may collect non-personal data such as device type, operating system, and crash reports to improve performance.</li>
                </ul>

                <h2 style={styles.subHeader}>2. How We Use Your Information</h2>
                <p>We use your personal information to:</p>
                <ul>
                    <li>Provide and improve our services.</li>
                    <li>Personalize your experience (e.g., showing nearby tracks).</li>
                    <li>Send notifications regarding app updates, new features, and messages.</li>
                    <li>Respond to support requests and improve customer service.</li>
                </ul>

                <h2 style={styles.subHeader}>3. Location & Push Notifications</h2>
                <p>
                    Location: If granted, we use your location to show nearby tracks. This data is not stored and can be disabled anytime in your device settings.
                </p>
                <p>
                    Push Notifications: If granted, we store your push notification token to send you updates. You can opt out anytime.
                </p>

                <h2 style={styles.subHeader}>4. Data Sharing</h2>
                <p>We do not sell your data. However, we use trusted third-party services:</p>
                <ul>
                    <li>Cloudinary: Stores profile images securely.</li>
                    <li>MongoDB: Stores user information securely</li>
                </ul>

                <h2 style={styles.subHeader}>5. Data Security</h2>
                <p>
                    We take reasonable measures to protect your data. However, no method is 100% secure, and we cannot guarantee absolute security.
                </p>

                <h2 style={styles.subHeader}>6. Your Rights & Data Deletion</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access and update your personal information.</li>
                    <li>Request account deletion and all associated data.</li>
                </ul>

                <h2 style={styles.subHeader}>7. Children’s Privacy</h2>
                <p>
                    Our app is not intended for users under 17 years old. We do not knowingly collect or solicit information from children under 17.
                </p>

                <h2 style={styles.subHeader}>8. Changes to Privacy Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Any changes will be reflected on this page, and we will notify you through the app or email.
                </p>

                <h2 style={styles.subHeader}>9. Contact Us</h2>
                <p>If you have any questions, contact us at [Your Email].</p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    header: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    date: {
        fontStyle: 'italic',
        marginBottom: '10px',
    },
    subHeader: {
        fontSize: '18px',
        fontWeight: '600',
        marginVertical: '5px',
    },
    section: {
        marginTop: '110px',
        marginBottom: '20px',
    },
    link: {
        color: 'blue',
        textDecoration: 'underline',
    },
};

export default TermsAndPrivacy;
