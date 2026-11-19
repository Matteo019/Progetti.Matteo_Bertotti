import { useEffect, useRef, useState } from 'react';

// Section title whose letters slide in one after the other when it scrolls into view
export default function SectionTitle({ children, split = true }) {
    const ref = useRef(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        if (!split) return undefined;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setRevealed(true);
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [split]);

    if (!split) return <h2 className="section-title" ref={ref}>{children}</h2>;

    return (
        <h2 className={`section-title${revealed ? ' revealed' : ''}`} ref={ref} aria-label={children}>
            {[...children].map((char, i) => (
                <span key={i} aria-hidden="true" style={{ transitionDelay: `${i * 0.03}s` }}>
                    {char === ' ' ? ' ' : char}
                </span>
            ))}
        </h2>
    );
}
