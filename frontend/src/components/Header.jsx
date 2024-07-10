import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Preloader from '../Preloader';
import { setLogout } from '../state';
import { Ripple } from 'primereact/ripple';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const [pageLoading, setPageLoading] = useState(false);

    const handleNavigate = (url) => {
        setPageLoading(true);
        setTimeout(() => {
            navigate(url);
            setPageLoading(false);
        }, 800);
    };

    const [isOpen, setIsOpen] = useState(false);
    const dropdowMenuRef = useRef(null);

    const toggleDropdownMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdowMenuRef.current && !dropdowMenuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    // useEffect(() => {
    //     const preloader = document.getElementById('preloader');
    //     if (preloader) {
    //         setTimeout(() => {
    //             preloader.style.transition = 'opacity 0.5s';
    //             preloader.style.opacity = '0';
    //             setTimeout(() => {
    //                 preloader.remove();
    //             }, 800);
    //         }, 800);
    //     }
    // }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <>
            {/* <div className="loader-area" id="preloader">
                <div class="loader"></div>
            </div> */}
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

                                    {!user ? (
                                        <ul className='nav-button-grp'>
                                            <li className='nav-button-grp-item'>
                                                <a href="/sign-up" className='nav-link-button with-outline text-uppercase letter-spaced'>Sign up</a>
                                            </li>
                                            <li className='nav-button-grp-item'>
                                                <a href="/sign-in" className='nav-link-button with-bg text-uppercase letter-spaced'>Sign in</a>
                                            </li>
                                        </ul>
                                    ) : (
                                        <ul className='nav-button-grp'>
                                            <li className='nav-button-grp-item position-relative' ref={dropdowMenuRef}>
                                                <button type='button' className='profile-toggle-btn p-ripple' onClick={toggleDropdownMenu}>
                                                    <div className="profile-toggle-img-area">
                                                        {/* <img src="assets/images/profile-img.png" className='profile-toggle-img' alt="" /> */}
                                                        <img src={user?.dp || "assets/images/user.png"} className='profile-toggle-no-img' alt="" />
                                                    </div>
                                                    <div className='profile-toggle-detail'>
                                                        <h5>Hi 👋</h5>
                                                        <h6>{user?.firstName || "---------"}</h6>
                                                    </div>
                                                    <i className={`bi bi-chevron-down ${isOpen ? 'rotate' : ''}`}></i>
                                                    <Ripple />
                                                </button>
                                                <ul className={`profile-dropdown-menu ${isOpen ? 'open' : ''}`}>
                                                    <div className='profile-dropdown-detail'>
                                                        <div className="profile-dropdown-image-area">
                                                            {/* <img src="assets/images/profile-img.png" className='profile-dropdown-img' alt="" /> */}
                                                            <img src={user?.dp || "assets/images/user.png"} className='profile-dropdown-no-img' alt="" />
                                                        </div>
                                                        <h6 className='dropdown-profile-name'>
                                                            {user?.firstName || "---------"}
                                                        </h6>
                                                    </div>
                                                    <li className='profile-dropdown-item mb-1 mt-1'>
                                                        <a className="profile-dropdown-link profile p-ripple" href="/dashboard">
                                                            <i className='bi bi-speedometer2 me-2'></i>
                                                            Dashboard
                                                            <Ripple />
                                                        </a>
                                                    </li>
                                                    <li className='profile-dropdown-item'
                                                     onClick={() => {
                                                        dispatch(setLogout())
                                                    }}>
                                                        <a className="profile-dropdown-link logout p-ripple" role='button' href="#"
                                                           >
                                                            <i className='bi bi-box-arrow-right me-2'></i>
                                                            Logout
                                                            <Ripple />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    )}

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

                    {user ? (
                        <div className='menu-profile-area'>
                            <div className="menu-profile-body">
                                <div className="menu-profile-img-area">
                                    <img src={user?.dp || "assets/images/user.png"} alt="" />
                                </div>
                                <div className="menu-profile-content">
                                    <h6 className='menu-profile-head'>👋 Hi,</h6>
                                    <h6 className='menu-profile-name'>
                                        {user?.firstName || "---------"}
                                    </h6>
                                </div>
                            </div>
                            <hr />
                            <div className="menu-profile-footer">
                                <a href="/dashboard" className='menu-profile-link primary-btn'>
                                    <i className='bi bi-speedometer2'></i> Dashboard
                                </a>
                                <a href="#" role='button' className='menu-profile-link danger-btn'
                                    onClick={() => {
                                        dispatch(setLogout())
                                    }}>
                                    <i class="bi bi-box-arrow-right"></i>
                                    Logout
                                </a>
                            </div>
                        </div>
                    ) : (
                        <ul className='menu-btn-link-area'>
                            <li className='menu-btn-link-item'>
                                <a href="/sign-up" className='menu-btn-link with-outline'>Sign up</a>
                            </li>

                            <li className='menu-btn-link-item'>
                                <a href="/sign-in" className='menu-btn-link with-bg'>Sign in</a>
                            </li>
                        </ul>
                    )}

                </div>

            </header>
        </>
    )
}

export default Header;