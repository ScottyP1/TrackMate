export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-center py-4 text-white w-full">
            <p>&copy; {currentYear} TrackMate MX. All Rights Reserved.</p>
        </footer>
    );
}
