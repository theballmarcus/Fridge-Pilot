// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import './App.css';
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import Layout from './components/Layout';
import Recipe from './components/Recipe';

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes/>
            </Router>
            <Recipe/>
        </AuthProvider>
    );
}

const AuthRedirector = ({ children, requireAuth }) => {
    // const loggedIn = localStorage.getItem('token') !== null;

    // if (requireAuth && !loggedIn) {
    //     return <Navigate to="/" replace />;
    // }
    return children;
};

function AppRoutes() {
    return (
        <Routes>
            <Route path='/' element={
                <AuthRedirector requireAuth={false}>
                    <Layout useFooter={true}>
                        <LandingPage />
                    </Layout>
                </AuthRedirector>
            } />

            <Route path='/login' element={
                <AuthRedirector requireAuth={false}>
                    <Layout useFooter={false}>
                        <LoginPage />
                    </Layout>
                </AuthRedirector>
            } />

            <Route path='/signup' element={
                <AuthRedirector requireAuth={false}>
                    <Layout useFooter={false}>
                        <SignupPage />
                    </Layout>
                </AuthRedirector>
            } />

            <Route path='/home' element={
                <AuthRedirector requireAuth={true}>
                    <Layout useFooter={true}>
                        <HomePage />
                    </Layout>
                </AuthRedirector>
            } />

            {/* 404 Route */}
            <Route path='*' element={
                <Layout useFooter={true}>
                    <NotFoundPage />
                </Layout>
            } />
        </Routes>
    );
}

export default App;
