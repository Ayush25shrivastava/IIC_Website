import React, { useEffect, useRef, useState } from 'react';
import cursorImg from '../assets/customCursor.png';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        setIsVisible(true);

        const moveCursor = (e) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };

        const handleMouseOver = (e) => {
            if (e.target.closest('button, a, input[type="button"], input[type="submit"], [role="button"]')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };
        setTimeout(() => {
            window.addEventListener('mousemove', moveCursor);
            document.addEventListener('mouseover', handleMouseOver);
        }, 100);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none z-[99999]"
            style={{ willChange: 'transform' }}
        >
            <div
                className={`transition-transform duration-300 ease-out origin-top-left ${isHovering ? 'scale-[1.8]' : 'scale-100'
                    }`}
                style={{
                    width: '32px',
                    height: '32px',
                    backgroundImage: `url(${cursorImg})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top left',
                }}
            />
        </div>
    );
};

export default CustomCursor;
