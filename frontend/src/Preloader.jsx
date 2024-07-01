import React, { useEffect } from 'react';

const Preloader = () => {
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

    return (
        <div className="loader-area" id="preloader">
            <div className="loader"></div>
        </div>
    );
};

export default Preloader;
