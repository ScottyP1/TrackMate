export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-center text-sm py-2 text-white w-full z-[500]">
            <p>&copy; {currentYear} TrackMate MX. All Rights Reserved.</p>
        </footer>
    );
}
