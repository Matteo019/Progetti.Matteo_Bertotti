import { useEffect, useRef, useState } from 'react';

/**
 * Types a short mono label once, with a thin caret that blinks a few times and then fades.
 * startOn="mount" types after `delay` ms; startOn="view" waits until the text scrolls into view.
 * The full text is always in the DOM for screen readers and search engines.
 */
export default function TypeText({ text, startOn = 'mount', delay = 0, speed = 38, className = '' }) {
    const ref = useRef(null);
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const [done, setDone] = useState(false);

    // Start: after a delay, or when visible
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(text.length);
            setDone(true);
            return undefined;
        }
        if (startOn === 'mount') {
            const timer = setTimeout(() => setStarted(true), delay);
            return () => clearTimeout(timer);
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return;
            setTimeout(() => setStarted(true), delay);
            observer.disconnect();
        }, { threshold: 0.6 });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [startOn, delay, text.length]);

    // Changing language retypes the new text from the start
    useEffect(() => {
        setCount(0);
        setDone(false);
    }, [text]);

    useEffect(() => {
        if (!started || done) return undefined;
        if (count >= text.length) {
            const timer = setTimeout(() => setDone(true), 1600);
            return () => clearTimeout(timer);
        }
        // A little irregularity reads as a person typing, not a machine
        const timer = setTimeout(() => setCount(c => c + 1), speed + Math.random() * speed * 0.6);
        return () => clearTimeout(timer);
    }, [started, done, count, text.length, speed]);

    return (
        <span ref={ref} className={`type-text ${className}`} aria-label={text}>
            <span aria-hidden="true">{text.slice(0, count)}</span>
            <span aria-hidden="true" className={`type-caret${started && !done ? ' is-on' : ''}${count >= text.length ? ' is-idle' : ''}`} />
            {/* Keeps the final width reserved, so nothing around it moves while typing */}
            <span aria-hidden="true" className="type-ghost">{text.slice(count)}</span>
        </span>
    );
}
