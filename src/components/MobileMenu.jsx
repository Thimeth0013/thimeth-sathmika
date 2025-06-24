export const MobileMenu = ({ menuOpen, setMenuOpen }) => {
    return (
        <div className={`fixed top-0 left-0 w-full bg-black/40 backdrop-blur-lg z-50 flex flex-col items-center justify-center transition-all duration-300 ease-in-out
            ${menuOpen 
            ? "h-screen opacity-100 pointer-events-auto"
            : "h-0 opacity-0 pointer-events-none"}`}>  {/* Fix: z-50 to appear above navbar, transition-all instead of transition-all-duration-300 */}

            <button 
                onClick={() => setMenuOpen(false)} 
                className="absolute top-6 right-8 text-gray-300 text-5xl focus:outline-none cursor-pointer hover:text-white hover:scale-110 transition-colors" 
                aria-label="Close menu">
                &times; {/* Close icon */}
            </button>

            <div className="flex flex-col items-center space-y-6">  {/* Add container for better spacing */}
                <a 
                    href="#home" 
                    onClick={() => setMenuOpen(false)} 
                    className={`text-2xl font-semibold text-white transform transition-all duration-300 hover:text-blue-800 ${
                        menuOpen ? "opacity-100 translate-y-0 delay-100" : "opacity-0 translate-y-5"
                    }`}>
                    Home
                </a>
                <a 
                    href="#project" 
                    onClick={() => setMenuOpen(false)} 
                    className={`text-2xl font-semibold text-white transform transition-all duration-300 hover:text-blue-800 ${
                        menuOpen ? "opacity-100 translate-y-0 delay-200" : "opacity-0 translate-y-5"
                    }`}>
                    Projects
                </a>  
                <a 
                    href="#about" 
                    onClick={() => setMenuOpen(false)} 
                    className={`text-2xl font-semibold text-white transform transition-all duration-300 hover:text-blue-800 ${
                        menuOpen ? "opacity-100 translate-y-0 delay-400" : "opacity-0 translate-y-5"
                    }`}>
                    About
                </a>
                                <a 
                    href="#contact" 
                    onClick={() => setMenuOpen(false)} 
                    className={`text-2xl font-semibold text-white transform transition-all duration-300 hover:text-blue-800 ${
                        menuOpen ? "opacity-100 translate-y-0 delay-300" : "opacity-0 translate-y-5"
                    }`}>
                    Contact
                </a>  
            </div>
        </div>
    );
};