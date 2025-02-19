import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Footer() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleScroll = (id) => {
        const section = document.querySelector(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleNavigation = (slug) => {
        if (slug.startsWith("#")) {
            if (location.pathname !== "/") {
                navigate(`/${slug}`);
            } else {
                handleScroll(slug);
            }
        } else {
            navigate(slug);
        }
    };

    useEffect(() => {
        if (location.hash) {
            handleScroll(location.hash);
        }
    }, [location]);

    return (
        <footer className="bg-black text-gray-400 py-12 w-full">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
                <div>
                    <h2 className="text-white text-lg font-semibold mb-4">Lockout</h2>
                </div>

                <div>
                    <h2 className="text-white text-lg font-semibold mb-4">Quick Links</h2>
                    <ul>
                        {["#home", "#about", "#benefits", "#history"].map((slug) => (
                            <li key={slug}>
                                <button
                                    onClick={() => handleNavigation(slug)}
                                    className="hover:text-white transition-colors duration-300 text-left w-full"
                                >
                                    {slug.replace("#", "").charAt(0).toUpperCase() + slug.replace("#", "").slice(1)}
                                </button>
                            </li>
                        ))}
                        <li>
                            <Link to="/tournaments" className="hover:text-white transition-colors duration-300">
                                Tournaments
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-white text-lg font-semibold mb-4">Follow Us</h2>
                    <div className="flex space-x-4">
                        <a
                            href="https://www.linkedin.com/company/bitlegion/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors duration-300"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://x.com/bit_iiitp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors duration-300"
                        >
                            Twitter
                        </a>
                        <a
                            href="https://www.instagram.com/bit.iiitp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors duration-300"
                        >
                            Instagram
                        </a>
                    </div>
                </div>

                <div>
                    <h2 className="text-white text-lg font-semibold mb-4">Contact Us</h2>
                    <p>Indian Institute of Information Technology (IIIT) Pune</p>
                    <p>Survey No. - 9/1/3, Ambegaon Budruk,</p>
                    <p>Sinhgad Institute Road Pune 411041</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
