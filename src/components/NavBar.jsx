import { useEffect } from "react";

export const NavBar = ({ menuOpen, setMenuOpen }) => {  // Fix: Proper destructuring

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : "";
    }, [menuOpen]);  // Fix: Add dependency array

    return (
        <nav className="fixed top-4 left-0 w-full z-40 bg-black/40 backdrop-blur-lg shadow-lg">
            <div className="max-w-6xl mx-auto px-4">  {/* Fix: Remove duplicate px-4 */}
                <div className="flex justify-between items-center h-16">
                    <a href="#home" className="font-mono text-xl font-bold text-white">
                        T<span className="text-blue-500">S</span>
                    </a>
                    
                    <div className="w-7 h-6 relative cursor-pointer z-50 md:hidden text-base" onClick={() => setMenuOpen((prev) => !prev)}>
                        &#9776; {/* Hamburger icon for mobile */}
                    </div>

                    <div className="hidden md:flex items-center space-x-10">
                        <a href="#home" className="text-gray-300 hover:text-blue-500 transition-colors font-bold">Home</a>
                        <a href="#about" className="text-gray-300 hover:text-blue-500 transition-colors font-bold">About</a>
                        <a href="#project" className="text-gray-300 hover:text-blue-500 transition-colors font-bold">Projects</a>
                        <a href="#contact" className="text-gray-300 hover:text-blue-500 transition-colors font-bold">Contact</a>    
                    </div>
                </div>
            </div>
        </nav>
    );
};