import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const NavBar = ({ menuOpen, setMenuOpen }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : "";
    }, [menuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            setIsScrolled(currentScrollY > 100);
            
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            } 
            else if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);

            // Detect active section
            const sections = ["home", "about", "project", "contact"];
            const scrollPosition = currentScrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const navItems = [
        { name: "Home", href: "#home", id: "home" },
        { name: "About", href: "#about", id: "about" },
        { name: "Projects", href: "#project", id: "project" },
        { name: "Contact", href: "#contact", id: "contact" }
    ];

    return (
        <nav className={`fixed pt-2 left-0 w-full z-40 backdrop-blur-lg transition-all duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${
            isScrolled ? 'bg-black/60 shadow-lg' : 'bg-black/0'
        }`}>
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <motion.a 
                        href="#home" 
                        className="font-mono text-xl font-bold text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        T<span className="text-blue-500">S</span>
                    </motion.a>
                    
                    <motion.div 
                        className="w-7 h-6 relative cursor-pointer z-50 md:hidden text-base" 
                        onClick={() => setMenuOpen((prev) => !prev)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        &#9776;
                    </motion.div>

                    <div className="hidden md:flex items-center space-x-10">
                        {navItems.map((item) => (
                            <motion.a
                                key={item.id}
                                href={item.href}
                                className="relative overflow-hidden block h-6 cursor-pointer"
                                initial="initial"
                                whileHover="hover"
                            >
                                <motion.div
                                    variants={{
                                        initial: { y: 0 },
                                        hover: { y: -24 }
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.33, 1, 0.68, 1]
                                    }}
                                    className="flex flex-col"
                                >
                                    {/* Original text that moves up */}
                                    <span className={`font-bold block ${
                                        activeSection === item.id ? 'text-blue-500' : 'text-gray-300'
                                    }`}>
                                        {item.name}
                                    </span>
                                    
                                    {/* Duplicate text that comes from below */}
                                    <span className={`font-bold block mt-0.5 ${
                                        activeSection === item.id ? 'text-blue-500' : 'text-gray-300'
                                    }`}>
                                        {item.name}
                                    </span>
                                </motion.div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};