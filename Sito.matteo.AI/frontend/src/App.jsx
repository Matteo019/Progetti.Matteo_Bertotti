import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Privacy from './pages/Privacy.jsx';

// The admin panel is only for me: keep it out of the public bundle
const Admin = lazy(() => import('./pages/Admin.jsx'));

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
