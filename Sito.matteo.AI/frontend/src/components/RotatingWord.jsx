import { useEffect, useState } from 'react';

const STEP_MS = 2600;

/**
 * A word that changes in place: the letters of the old word roll up and out,
 * the new ones roll in from below, one after the other.
 */
export default function RotatingWord({ words, className = '' }) {
    const [index, setIndex] = useState(0);
    const [previous, setPrevious] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex(i => {
                setPrevious(i);
                return (i + 1) % words.length;
            });
        }, STEP_MS);
        return () => clearInterval(timer);
    }, [words.length]);

    const letters = (word, state) => [...word].map((char, i) => (
        <span key={i} className={`rw-char rw-${state}`} style={{ animationDelay: `${i * 45}ms` }}>
            {char === ' ' ? ' ' : char}
        </span>
    ));

    return (
        <span className={`rotating-word ${className}`}>
            {/* key forces a fresh element, so the letter animations restart each time */}
            <span key={`in-${index}`} className="rw-word">{letters(words[index], previous === null ? 'still' : 'in')}</span>
            {previous !== null && (
                <span key={`out-${previous}-${index}`} className="rw-word rw-word-out" aria-hidden="true">
                    {letters(words[previous], 'out')}
                </span>
            )}
        </span>
    );
}
