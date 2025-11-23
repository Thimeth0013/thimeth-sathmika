import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export const NavBar = ({ menuOpen, setMenuOpen, onOpenTerminal }) => {
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
                    >
                        T<span className="text-blue-500">S</span>
                    </motion.a>
                    
                    <motion.div 
                        className="w-7 h-6 relative cursor-pointer z-50 md:hidden text-white" 
                        onClick={() => setMenuOpen((prev) => !prev)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {/* Simple Hamburger Icon */}
                        <div className="space-y-1.5">
                            <span className="block h-0.5 w-7 bg-current"></span>
                            <span className="block h-0.5 w-7 bg-current"></span>
                            <span className="block h-0.5 w-7 bg-current"></span>
                        </div>
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
                                    <span className={`font-bold block ${
                                        activeSection === item.id ? 'text-blue-500' : 'text-gray-300'
                                    }`}>
                                        {item.name}
                                    </span>
                                    
                                    <span className={`font-bold block mt-0.5 ${
                                        activeSection === item.id ? 'text-blue-500' : 'text-gray-300'
                                    }`}>
                                        {item.name}
                                    </span>
                                </motion.div>
                            </motion.a>
                        ))}

                        {/* Terminal Button */}
                        <motion.button
                            onClick={onOpenTerminal}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border-1 border-green-500/20 text-green-400/30 rounded-md shadow-[0_0_10px_rgba(34,197,94,0.1)] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:border-green-500 hover:text-green-500 transition-all"
                            whileTap={{ scale: 0.95 }}
                        >
                            <Terminal size={16} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </nav>
    );
};