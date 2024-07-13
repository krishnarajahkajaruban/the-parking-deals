// import React, { useEffect } from 'react';

// const Preloader = () => {
//     useEffect(() => {
//         const preloader = document.getElementById('preloader');
//         if (preloader) {
//             setTimeout(() => {
//                 preloader.style.transition = 'opacity 0.5s';
//                 preloader.style.opacity = '0';
//                 setTimeout(() => {
//                     preloader.remove();
//                 }, 800);
//             }, 800);
//         }
//     }, []);

//     return (
//         <div className="loader-area" id="preloader">
//             <div className="loader"></div>
//         </div>
//     );
// };

// export default Preloader;
import React, { useEffect, useState } from 'react';

const Preloader = () => {
    const [showPreloader, setShowPreloader] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPreloader(false);
        }, 1600); // Total 1600ms: 800ms delay + 800ms for fade out

        return () => clearTimeout(timer);
    }, []);

    return (
        showPreloader && (
            <div className="loader-area" id="preloader" style={{ transition: 'opacity 0.5s', opacity: showPreloader ? '1' : '0' }}>
                <div className="loader"></div>
            </div>
        )
    );
};

export default Preloader;


