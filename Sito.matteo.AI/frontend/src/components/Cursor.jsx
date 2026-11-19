import { useEffect, useRef } from 'react';

const HOVERABLE = 'a, button, .magnetic-btn, .project-card, .skill-card';

// Dot follows the pointer instantly, the outline follows with a spring
export default function Cursor() {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(pointer: coarse)').matches) return undefined;
        const dot = dotRef.current;
        const outline = outlineRef.current;
        let mouseX = 0, mouseY = 0, outlineX = 0, outlineY = 0, frame;

        const move = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
            document.body.classList.toggle('hovering', !!e.target.closest?.(HOVERABLE));
        };
        const animate = () => {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            frame = requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', move);
        animate();
        return () => {
            document.removeEventListener('mousemove', move);
            cancelAnimationFrame(frame);
            document.body.classList.remove('hovering');
        };
    }, []);

    return (
        <>
            <div className="cursor-dot" ref={dotRef} />
            <div className="cursor-outline" ref={outlineRef} />
        </>
    );
}
