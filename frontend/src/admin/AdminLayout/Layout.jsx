import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Link, useLocation, Outlet } from "react-router-dom";
import Preloader from '../../Preloader';

import { Ripple } from 'primereact/ripple';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import '../Css/style.css';
import '../Css/responsive.css';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../state';

const Layout = () => {
    const navigate = useNavigate;
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const dropdowMenuRef = useRef(null);
    const user = useSelector((state) => state.auth.user)

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


    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => setFullScreen(true))
                .catch((err) => console.error(`Failed to enter fullscreen mode: ${err.message}`));
        } else {
            document.exitFullscreen()
                .then(() => setFullScreen(false))
                .catch((err) => console.error(`Failed to exit fullscreen mode: ${err.message}`));
        }
    };
    const closeMenu = () => {
        setMenuOpen(false);
    };

    const goToLink = (path) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogOut = () => {
        confirmDialog({
            message: 'Are you sure you want to log out?',
            header: 'Logout Confirmation',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => { dispatch(setLogout()); },
        });
        setMenuOpen(false);
    }

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

    return (
        <>
            <div className={`menu-backdrop ${menuOpen ? 'show' : ''}`} onClick={closeMenu}></div>

            <ConfirmDialog />
            <Preloader />

            {/* Side bar */}
            <aside className={`navigation_area ${menuOpen ? 'active' : ''} `}>
                <div className='toggle_close  p-ripple' onClick={toggleMenu}>
                    <i className='bi bi-x'></i>
                    <Ripple />
                </div>
                <ul>
                    <li>
                        <Link href="#" className="logo_title_area">
                            <span class="icon logo">
                                <img src="/assets/images/parking-deals-icon-logo-light.png" alt="" />
                            </span>
                            <span class="logo_title">
                                The <br />
                                <span> Parking Deals</span>
                            </span>
                        </Link>
                    </li>
                    {/* <li className={`${pathname === '/admin-dashboard' ? 'active' : ''}`}>
                        <Link to={'/admin-dashboard'} onClick={() => setMenuOpen(false)} >
                            <span className="icon">
                                <i className="bi bi-speedometer2"></i>
                            </span>
                            <span className="title">Dashboard</span>
                        </Link>
                    </li> */}

                    <li className={`${pathname === '/reservation' ? 'active' : ''}`}>
                        <Link to={'/reservation'} onClick={() => setMenuOpen(false)}>
                            <span className="icon">
                                <i className="bi bi-calendar2-event"></i>
                            </span>
                            <span className="title">Reservation</span>
                        </Link>
                    </li>

                    <li className={`${pathname === '/bookings' ? 'active' : ''}`}>
                        <Link to={'/bookings'} onClick={() => setMenuOpen(false)}>
                            <span className="icon">
                                <i className="bi bi-calendar2-check"></i>
                            </span>
                            <span className="title">Bookings</span>
                        </Link>
                    </li>

                    <li className={`${pathname === '/airports' ? 'active' : ''}`}>
                        <Link to={'/airports'} onClick={() => setMenuOpen(false)}>
                            <span className="icon">
                                <i className="bi bi-airplane"></i>
                            </span>
                            <span className="title">Airports</span>
                        </Link>
                    </li>

                    <li className={`${pathname === '/customers' ? 'active' : ''}`}>
                        <Link to={'/customers'} onClick={() => setMenuOpen(false)}>
                            <span className="icon">
                                <i className="bi bi-people"></i>
                            </span>
                            <span className="title">Customers</span>
                        </Link>
                    </li>

                    {!(["Moderator", "Admin-User"].includes(user?.role)) && <li className={`${pathname === '/vendors' ? 'active' : ''}`}>
                        <Link to={'/vendors'} onClick={() => setMenuOpen(false)}>
                            <span className="icon">
                                <i className="bi bi-building"></i>
                            </span>
                            <span className="title">Vendor</span>
                        </Link>
                    </li>}


                    {!(["Moderator", "Admin-User"].includes(user?.role)) && <li className={`${pathname === '/users' ? 'active' : ''}`}>
                        <Link to={'/users'} onClick={() => setMenuOpen(false)}>
                            <span className="icon">
                                <i className="bi bi-person"></i>
                            </span>
                            <span className="title">Users</span>
                        </Link>
                    </li>}

                    <li className={`${pathname === '/extras' ? 'active' : ''}`}>
                        <Link to={'/extras'} onClick={() => setMenuOpen(false)}>
                            <span className="icon">
                                <i className="bi bi-layers"></i>
                            </span>
                            <span className="title">Extras</span>
                        </Link>
                    </li>

                    <li>
                        <Link onClick={handleLogOut}>
                            <span className="icon">
                                <i className="bi bi-box-arrow-in-right"></i>
                            </span>
                            <span className="title">Sign Out</span>
                        </Link>
                    </li>
                </ul>
            </aside>

            <div className="main_area">
                {/* Nav bar */}
                <nav className={`topbar ${scrolled ? 'scrolled' : ''}`}>
                    <div className='d-flex'>
                        <div className="toggle_menu p-ripple" onClick={toggleMenu}>
                            <i class={`bi bi-list`}></i>
                            <Ripple />
                        </div>
                        <div className="fullscreen_toggle p-ripple" onClick={toggleFullScreen}>
                            <i class={`bi ${fullScreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                            <Ripple />
                        </div>
                    </div>

                    <div className="user_toggle_area" ref={dropdowMenuRef}>
                        <div className="user_toggle p-ripple" onClick={toggleDropdownMenu}>
                            <img src="/assets/images/user.png" alt="Profile" />
                            <Ripple />
                        </div>

                        <ul className={`profile-dropdown-menu admin ${isOpen ? 'open' : ''}`}>
                            <div className='profile-dropdown-detail'>
                                <div className="profile-dropdown-image-area">
                                    <img src={"assets/images/user.png"} className='profile-dropdown-no-img' alt="" />
                                </div>
                                <h6 className='dropdown-profile-name'>
                                    {user?.firstName} {user?.lastname}
                                </h6>
                            </div>
                            <li className='profile-dropdown-item mb-1 mt-1'>
                                <button className="profile-dropdown-link profile p-ripple">
                                    <i className='bi bi-person me-2'></i>
                                    Profile
                                    <Ripple />
                                </button>
                            </li>
                            <li className='profile-dropdown-item'>
                                <button className="profile-dropdown-link logout p-ripple" type='button'
                                    onClick={handleLogOut}>
                                    <i className='bi bi-box-arrow-right me-2'></i>
                                    Logout
                                    <Ripple />
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Page content */}
                <div className="main-content">
                    <Outlet />
                </div>

            </div>


        </>
    )
}

export default Layout;