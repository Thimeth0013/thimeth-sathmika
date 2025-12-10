// components/NavBar.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export const NavBar = ({ menuOpen, setMenuOpen, onOpenTerminal }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        // Active section and scroll logic (using fixes from previous steps)
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            setIsScrolled(currentScrollY > 10); 
            
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            } 
            else if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            }
            
            setLastScrollY(currentScrollY);

            const sections = ["home", "about", "project", "contact"];
            const scrollPosition = currentScrollY + 200; 

            let newActiveSection = "home";
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const offsetTop = element.offsetTop;
                    const offsetHeight = element.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        newActiveSection = section;
                        break;
                    }
                }
            }
            setActiveSection(newActiveSection);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        // Locks scroll when menu is open
        document.body.style.overflow = menuOpen ? 'hidden' : ""; 
    }, [menuOpen]);

    const navItems = [
        { name: "Home", href: "#home", id: "home" },
        { name: "About", href: "#about", id: "about" },
        { name: "Projects", href: "#project", id: "project" },
        { name: "Contact", href: "#contact", id: "contact" }
    ];
    
    const textSlideVariants = {
        initial: { y: 0 },
        hover: { y: -24 } // h-6 is 24px
    };

    return (
        <nav 
            className={`fixed pt-2 left-0 w-full z-50 backdrop-blur-xl transition-all duration-300 ${
                isVisible ? 'translate-y-0' : '-translate-y-full'
            } ${
                isScrolled ? 'bg-black/80 shadow-2xl' : 'bg-black/0'
            }`}
        >
            <div className="max-w-6xl mx-auto px-6 sm:px-0">
                <div className="flex justify-between items-center h-16">
                    <motion.a 
                        href="#home" 
                        className="font-mono text-2xl font-bold text-white tracking-wider"
                        whileHover={{ scale: 1.05 }}
                    >
                        T<span className="text-blue-500">S</span>
                    </motion.a>
                    
                    {/* Modern Static Hamburger Icon */}
                    <motion.button
                        className="w-8 h-8 relative cursor-pointer z-50 md:hidden text-white flex items-center justify-center" 
                        onClick={() => setMenuOpen((prev) => !prev)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                    >
                        <div
                            // Removed motion, initial, and animate props
                            className="w-full h-full relative"
                        >
                            {/* Top Line */}
                            <span
                                // Used Tailwind classes for static open/close states
                                className={`absolute block h-0.5 w-7 bg-current rounded-full transition-all duration-300 ${
                                    menuOpen 
                                    ? 'rotate-45 top-1/2 -translate-y-1/2' 
                                    : 'top-[25%]'
                                }`}
                            />
                            {/* Middle Line */}
                            <span
                                // Used Tailwind classes for static open/close states
                                className={`absolute block h-0.5 w-7 bg-current rounded-full transition-all duration-300 top-1/2 -translate-y-1/2 ${
                                    menuOpen ? 'opacity-0' : 'opacity-100'
                                }`}
                            />
                            {/* Bottom Line */}
                            <span
                                // Used Tailwind classes for static open/close states
                                className={`absolute block h-0.5 w-7 bg-current rounded-full transition-all duration-300 ${
                                    menuOpen 
                                    ? '-rotate-45 top-1/2 -translate-y-1/2' 
                                    : 'top-[75%]'
                                }`}
                            />
                        </div>
                    </motion.button>

                    <div className="hidden md:flex items-center space-x-10">
                        {navItems.map((item) => (
                            <motion.a
                                key={item.id}
                                href={item.href}
                                // The h-6 class provides the height for the text slide animation
                                className="relative overflow-hidden block h-6 cursor-pointer" 
                                initial="initial"
                                whileHover="hover"
                                onClick={() => setActiveSection(item.id)}
                            >
                                <motion.div
                                    variants={textSlideVariants}
                                    transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                                    className="flex flex-col"
                                >
                                    <span className={`font-semibold block transition-colors duration-300 ${
                                        activeSection === item.id ? 'text-blue-500' : 'text-gray-300'
                                    }`}>
                                        {item.name}
                                    </span>
                                    <span className={`font-semibold block transition-colors duration-300 ${
                                        activeSection === item.id ? 'text-blue-500' : 'text-gray-300'
                                    }`}>
                                        {item.name}
                                    </span>
                                </motion.div>
                                {/* REMOVED THE UNDERLINE MOTION.DIV HERE */}
                            </motion.a>
                        ))}

                        {/* Terminal Button with Flicker Animation */}
                        <motion.button
                            onClick={onOpenTerminal}
                            className="flex items-center gap-2 px-2 py-1 bg-gray-900 border-2 text-green-400/40 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all ease-in-out duration-300 flicker-light hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:border-green-500 hover:text-green-500"
                            whileTap={{ scale: 0.95 }}
                        >
                            <Terminal size={18} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Global Styles for Flicker Animation */}
            <style jsx global>
                {`
                    @keyframes flicker-light {
                        0%, 100% {
                            opacity: 1;
                            box-shadow: 0 0 15px rgba(34, 197, 94, 0.1);
                            border-color: rgba(34, 197, 94, 0.2);
                        }
                        5% {
                            opacity: 0.95;
                            box-shadow: 0 0 10px rgba(34, 197, 94, 0.05);
                            border-color: rgba(34, 197, 94, 0.1);
                        }
                        10% {
                            opacity: 1;
                            box-shadow: 0 0 18px rgba(34, 197, 94, 0.15);
                            border-color: rgba(34, 197, 94, 0.3);
                        }
                        15% {
                            opacity: 0.9;
                            box-shadow: 0 0 8px rgba(34, 197, 94, 0.05);
                            border-color: rgba(34, 197, 94, 0.1);
                        }
                        20% {
                            opacity: 1;
                            box-shadow: 0 0 15px rgba(34, 197, 94, 0.1);
                            border-color: rgba(34, 197, 94, 0.2);
                        }
                    }

                    .flicker-light {
                        animation: flicker-light 4s infinite ease-in-out;
                    }
                `}
            </style>
        </nav>
    );
};