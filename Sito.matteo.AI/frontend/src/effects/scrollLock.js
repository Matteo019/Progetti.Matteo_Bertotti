// Page scroll lock for overlays (project modal, posts panel).
// The page scrolls on <html> (style.css sets overflow-x on it), so locking <body> is not enough:
// the lock goes on <html>. A counter keeps it correct when two overlays overlap.

let locks = 0;

export function lockScroll() {
    locks += 1;
    if (locks === 1) {
        document.documentElement.classList.add('scroll-locked');
        document.body.classList.add('modal-open');
    }
}

export function unlockScroll() {
    locks = Math.max(0, locks - 1);
    if (locks === 0) {
        document.documentElement.classList.remove('scroll-locked');
        document.body.classList.remove('modal-open');
    }
}
