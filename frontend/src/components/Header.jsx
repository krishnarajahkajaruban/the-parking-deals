import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

    useEffect(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.transition = 'opacity 0.5s';
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.remove();
                }, 800);
            }, 800);
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <>
            <div className="loader-area" id="preloader">
                <div class="loader"></div>
            </div>
            <header>
                <nav className={`nav-section ${scrolled ? 'scrolled' : ''}`}>
                    <div className="container-md">
                        <div className="row">
                            <div className="col-12">
                                <div className="nav-container">
                                    <a href="/" className='nav-logo-link'>
                                        <img src="assets/images/logo-light.png" className='nav-logo' alt="Logo" />
                                        <img src="assets/images/logo.png" className='scrolled-logo' alt="Logo" />
                                    </a>
                                    <ul className="nav-link-area">
                                        <li className='nav-link-item'>
                                            <a href="/about-us" className={`nav-link ${window.location.pathname === '/about-us' ? 'active' : ''}`}>
                                                About
                                            </a>
                                        </li>

                                        <li className='nav-link-item'>
                                            <a href="/services" className={`nav-link ${window.location.pathname === '/services' ? 'active' : ''}`}>
                                                Services
                                            </a>
                                        </li>

                                        <li className='nav-link-item'>
                                            <a href="/contact-us" className={`nav-link ${window.location.pathname === '/contact-us' ? 'active' : ''}`}>
                                                Contact
                                            </a>
                                        </li>
                                    </ul>

                                    {!user && <ul className='nav-button-grp'>
                                        <li className='nav-button-grp-item'>
                                            <a href="/sign-up" className='nav-link-button with-outline text-uppercase letter-spaced'>Sign up</a>
                                        </li>
                                        <li className='nav-button-grp-item'>
                                            <a href="/sign-in" className='nav-link-button with-bg text-uppercase letter-spaced'>Sign in</a>
                                        </li>
                                    </ul>}

                                    <ul className='menu-toggle-btn-area'>
                                        <li className='nav-button-grp-item'>
                                            <button className='menu-toggle-button' onClick={toggleMenu}>
                                                <i class="bi bi-list"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className={`menu-backdrop ${menuOpen ? 'show' : ''}`} onClick={closeMenu}></div>

                <div className={`mobile-menu-section ${menuOpen ? 'show' : ''}`}>
                    <button className='menu-close-button' onClick={closeMenu}>
                        <i class="ri-close-large-line"></i>
                    </button>
                    <a href="/" className='menu-logo-link'>
                        <img src="assets/images/logo.png" alt="Logo" />
                    </a>
                    <ul className='menu-link-area'>
                        <li className='menu-link-item'>
                            <a href="/" className={`menu-link ${window.location.pathname === '/' ? 'active' : ''}`}>
                                Home
                            </a>
                        </li>
                        <li className='menu-link-item'>
                            <a href="/about-us" className={`menu-link ${window.location.pathname === '/about-us' ? 'active' : ''}`}>
                                About
                            </a>
                        </li>
                        <li className='menu-link-item'>
                            <a href="/services" className={`menu-link ${window.location.pathname === '/services' ? 'active' : ''}`}>
                                Services
                            </a>
                        </li>
                        <li className='menu-link-item'>
                            <a href="/contact-us" className={`menu-link ${window.location.pathname === '/contact-us' ? 'active' : ''}`}>
                                Contact
                            </a>
                        </li>
                    </ul>

                    <div className='menu-profile-area'>
                        <div className="menu-profile-body">
                            <div className="menu-profile-img-area">
                                <img src="assets/images/user.png" alt="" />
                            </div>
                            <div className="menu-profile-content">
                                <h6 className='menu-profile-head'>👋 Hi,</h6>
                                <h6 className='menu-profile-name'>John</h6>
                            </div>
                        </div>
                        <hr />
                        <div className="menu-profile-footer">
                            <a href="/profile" className='menu-profile-link primary-btn'>
                                <i className='bi bi-person me-1'></i> Profile
                            </a>
                            <a href="/profile" className='menu-profile-link danger-btn'>
                                <i class="bi bi-box-arrow-right me-1"></i> Logout
                            </a>
                        </div>
                    </div>

                    <ul className='menu-btn-link-area'>
                        <li className='menu-btn-link-item'>
                            <a href="/sign-up" className='menu-btn-link with-outline'>Sign up</a>
                        </li>

                        <li className='menu-btn-link-item'>
                            <a href="/sign-in" className='menu-btn-link with-bg'>Sign in</a>
                        </li>
                    </ul>
                </div>

            </header>
        </>
    )
}

export default Header;