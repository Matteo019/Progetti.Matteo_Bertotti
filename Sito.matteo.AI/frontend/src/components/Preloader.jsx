import { useEffect, useState } from 'react';

export default function Preloader() {
    const [count, setCount] = useState(0);
    const [phase, setPhase] = useState('counting'); // counting -> anim -> loaded

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(c => {
                if (c + 1 >= 100) clearInterval(interval);
                return Math.min(c + 1, 100);
            });
        }, 15);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (count < 100) return undefined;
        setPhase('anim');
        const timeout = setTimeout(() => setPhase('loaded'), 600);
        return () => clearTimeout(timeout);
    }, [count]);

    const className = ['preloader', phase !== 'counting' && 'start-anim', phase === 'loaded' && 'loaded']
        .filter(Boolean).join(' ');

    return (
        <div className={className} style={phase === 'loaded' ? { pointerEvents: 'none' } : undefined}>
            <div className="preloader-content">
                <div className="preloader-text">MATTEO AUGUSTINHO BERTOTTI</div>
                <div className="preloader-counter">{count}%</div>
            </div>
        </div>
    );
}
