'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import { Context as AuthContext } from '@/context/AuthContext';
import useFetchUserAccount from '@/hooks/useFetchUserAccount';

const pages = ['Home', 'Tracks', 'About', 'Contact', 'Terms'];

function NavBar() {
    const [menuAnchor, setMenuAnchor] = React.useState(null);
    // const [userMenuAnchor, setUserMenuAnchor] = React.useState(null);
    // const { state, signOut } = React.useContext(AuthContext);
    const pathname = usePathname();

    // useFetchUserAccount();

    const handleMenuOpen = (event) => setMenuAnchor(event.currentTarget);
    const handleMenuClose = () => setMenuAnchor(null);
    // const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
    // const handleUserMenuClose = () => setUserMenuAnchor(null);
    const getPagePath = (page) => (page === 'Home' ? '/' : `/${page}`);
    const isActivePage = (page) => pathname === getPagePath(page);

    // Handle sign-out and redirection
    // const handleSignOut = () => {
    //     signOut();  // Sign out logic
    //     handleUserMenuClose();  // Close user menu
    // };
    return (
        <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.70)', zIndex: 10 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 65, px: 2 }}>
                {/* Mobile Menu */}
                <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'start', alignItems: 'center' }}>
                    <IconButton size="large" aria-label="menu" onClick={handleMenuOpen} color="inherit">
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                        PaperProps={{
                            style: {
                                backgroundColor: '#1a1a1a', // Black background
                                color: '#ffffff', // White text for contrast
                                borderRadiusBottom: '8px', // Rounded corners
                                marginTop: '4px', // Add spacing below the navbar
                            },
                        }}
                    >
                        {pages.map((page) => (
                            <Link key={page} href={getPagePath(page)} passHref>
                                <MenuItem onClick={handleMenuClose} className={isActivePage(page) ? 'current-page' : ''}>
                                    {page}
                                </MenuItem>
                            </Link>
                        ))}
                        <Link href={getPagePath('TrackMateApp')} passHref>
                            <MenuItem onClick={handleMenuClose} className={isActivePage('TrackMateApp') ? 'current-page' : ''}>
                                Join Community
                            </MenuItem>
                        </Link>
                        <MenuItem onClick={handleMenuClose} className="flex items-center justify-center">
                            <a
                                href="https://www.buymeacoffee.com/TrackMate"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <img
                                    src="https://img.buymeacoffee.com/button-api/?text=BuymeaRedBull&emoji=🤟🏻&slug=TrackMate&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"
                                    alt="Buy me a RedBull"
                                    className="rounded-md"
                                    width={200}
                                    height={50}
                                />
                            </a>
                        </MenuItem>
                    </Menu>
                </Box>

                {/* Centered Logo */}
                <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
                    <Link href="/" passHref>
                        <Image src={'/images/logo2.png'} width={160} height={100} alt="Logo" />
                    </Link>
                </Box>

                {/* Desktop Navigation */}
                <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'start', alignItems: 'center', gap: 4 }}>
                    <Link href="/" passHref>
                        <Image src={'/images/logo2.png'} width={150} height={45} alt="Logo" />
                    </Link>
                    {pages.map((page) => {
                        const isCurrentPage =
                            (page === 'Tracks' && pathname.startsWith('/Tracks')) || pathname === getPagePath(page);
                        return (
                            <MenuItem
                                key={page}
                                className={`relative ${isCurrentPage ? 'current-page' : ''}`}
                                component={Link}
                                href={getPagePath(page)}
                            >
                                {page}
                            </MenuItem>
                        );
                    })}
                    <Link href={getPagePath('TrackMateApp')} passHref>
                        <MenuItem onClick={handleMenuClose} className={isActivePage('TrackMateApp') ? 'current-page' : ''}>
                            Join Community
                        </MenuItem>
                    </Link>
                </Box>

                {/* User Menu */}
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <a href="https://www.buymeacoffee.com/TrackMate" className="hidden md:block ">
                        <img src="https://img.buymeacoffee.com/button-api/?text=Buy me a RedBull&emoji=🤟🏻&slug=TrackMate&button_colour=5F7FFF&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00" />
                    </a>
                    {!state.token ? (
                        <Link href="/Login" passHref>
                            <button className="text-white w-[65px] bg-gradient-to-r from-blue-600 to-indigo-700  p-3 font-bold rounded-lg">Login</button>
                        </Link>
                    ) : (
                        <>
                            <IconButton onClick={handleUserMenuOpen} color="inherit">
                                <Avatar alt={state.user?.name || 'User'} src={state.user?.profileAvatar} />
                            </IconButton>
                            <Menu
                                anchorEl={userMenuAnchor}
                                open={Boolean(userMenuAnchor)}
                                onClose={handleUserMenuClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                PaperProps={{
                                    style: {
                                        backgroundColor: '#1a1a1a', // Black background
                                        color: '#ffffff', // White text for contrast
                                        borderRadiusBottom: '8px', // Rounded corners
                                        marginTop: '4px', // Add spacing below the navbar
                                        width: '150px'
                                    },
                                }}
                            >
                                <Link href="/Account">
                                    <MenuItem onClick={() => handleUserMenuClose()}>
                                        Account
                                    </MenuItem>
                                </Link>
                                <Link href="/PrivateTrack">
                                    <MenuItem onClick={() => handleUserMenuClose()}>
                                        Private Track
                                    </MenuItem>
                                </Link>
                                <MenuItem onClick={handleSignOut}>Log out</MenuItem>
                            </Menu>
                        </>
                    )}
                </Box> */}
            </Toolbar>
        </AppBar >
    );
}

export default NavBar;
