import { useEffect, useState } from "react";

export const NavBar = ({ menuOpen, setMenuOpen }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : "";
    }, [menuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Change background transparency after scrolling past hero section
            // Adjust the 100 value based on your hero section height
            setIsScrolled(currentScrollY > 100);
            
            // Show navbar when scrolling up or at the top
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            } 
            // Hide navbar when scrolling down and past 80px
            else if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <nav className={`fixed pt-2 left-0 w-full z-40 backdrop-blur-lg transition-all duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
            isScrolled ? 'bg-black/60 shadow-lg' : 'bg-black/0'
        }`}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <a href="#home" className="font-mono text-xl font-bold text-white">
                        T<span className="text-blue-500">S</span>
                    </a>
                    
                    <div className="w-7 h-6 relative cursor-pointer z-50 md:hidden text-base" onClick={() => setMenuOpen((prev) => !prev)}>
                        &#9776;
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