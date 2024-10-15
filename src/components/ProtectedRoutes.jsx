import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                router.push('/signin'); // Redirect to SignIn page if not authenticated
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (!isAuthenticated) {
        return <p>Loading...</p>; // Show a loading state while checking auth status
    }

    return <>{children}</>;
};

export default ProtectedRoute;
