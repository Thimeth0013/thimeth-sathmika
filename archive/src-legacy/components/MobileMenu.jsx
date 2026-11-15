// components/MobileMenu.jsx
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const MobileMenu = ({ menuOpen, setMenuOpen }) => {
    const menuVariants = {
        closed: { x: "100%", transition: { type: "tween", duration: 0.4 } }, // Hidden (off-screen right)
        open: { x: 0, transition: { type: "tween", duration: 0.4, staggerChildren: 0.05, delayChildren: 0.2 } } // Open (on-screen)
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    return (
        <>
            {/* The Actual Sliding Menu */}
            <motion.div
                initial="closed"
                animate={menuOpen ? "open" : "closed"}
                variants={menuVariants}
                className="fixed top-0 right-0 w-full max-w-70 h-screen bg-black/70 backdrop-blur-md z-[999] shadow-2xl p-8 md:hidden" 
            >
                {/* Close Button */}
                <motion.button 
                    onClick={() => setMenuOpen(false)} 
                    className="absolute top-6 right-6 text-white text-3xl focus:outline-none cursor-pointer hover:text-blue-500 hover:scale-110 transition-colors" 
                    aria-label="Close menu"
                    whileHover={{ rotate: 90 }}
                >
                    <X size={28} />
                </motion.button>

                <motion.div 
                    variants={menuVariants} // Use the main variant for stagger control
                    className="flex flex-col items-start space-y-8 pt-20"
                >  
                    <MenuLink href="#home" label="Home" setMenuOpen={setMenuOpen} variants={itemVariants} />
                    <MenuLink href="#about" label="About" setMenuOpen={setMenuOpen} variants={itemVariants} />
                    <MenuLink href="#project" label="Projects" setMenuOpen={setMenuOpen} variants={itemVariants} />
                    <MenuLink href="#contact" label="Contact" setMenuOpen={setMenuOpen} variants={itemVariants} />
                </motion.div>
            </motion.div>
        </>
    );
};

// Helper component for clean list
const MenuLink = ({ href, label, setMenuOpen, variants }) => (
    <motion.a 
        href={href} 
        onClick={() => setMenuOpen(false)} 
        variants={variants}
        className="text-4xl font-bold text-gray-200 hover:text-blue-500 transition-colors block w-full"
    >
        {label}
    </motion.a>
);