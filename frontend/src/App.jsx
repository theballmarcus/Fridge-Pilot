import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/Landing';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import HomePage from './pages/Home';
import NotFoundPage from './pages/NotFound';
import Layout from './components/Layout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout useFooter={true}>
                    <LandingPage />
                </Layout>} />
                <Route path="/login" element={<Layout useFooter={false}>
                    <LoginPage />
                </Layout>} />
                <Route path="/signup" element={<Layout useFooter={false}>
                    <SignupPage />
                </Layout>} />
                <Route path="/home" element={<Layout useFooter={true}>
                    <HomePage />
                </Layout>} />

                {/* 404 Route */}
                <Route path="*" element={<Layout useFooter={true}>
                    <NotFoundPage />
                </Layout>} />
            </Routes>
        </Router>
    )
}

export default App
