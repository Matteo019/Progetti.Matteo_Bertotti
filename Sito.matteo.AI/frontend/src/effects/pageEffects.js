// Fades sections in once, the first time they scroll into view.
// Returns a cleanup function for React.
export function initScrollReveal(root) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    root.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
}
