import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import { MailIcon, Sparkle, Send, ArrowDownRight, Copy, Check } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import FlowingMenu from '../FlowingMenu/FlowingMenu';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [emailCopied, setEmailCopied] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText('sathmikakb@gmail.com');
    setEmailCopied(true);
    setTimeout(() => {
      setEmailCopied(false);
    }, 2000);
  };

  // Refs for useInView
  const contactRef = useRef(null);
  const formRef = useRef();
  const footerRef = useRef(null);

  // InView hooks
  const contactInView = useInView(contactRef, { once: true, amount: 0.2 });
  const footerInView = useInView(footerRef, { once: true, amount: 0.5 });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 15 } },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: "spring", stiffness: 120, damping: 20 } },
  };

  // **Modified formVariants to be centered on mobile and positioned on desktop**
  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.1 } },
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 150, damping: 20 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, type: "spring", stiffness: 120, damping: 15 } },
  };

  const statusVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring", stiffness: 150 } },
  };

  const emailVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, type: "spring", stiffness: 120 } },
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    emailjs.sendForm(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      formRef.current,
      import.meta.env.VITE_PUBLIC_KEY
    )
      .then(() => {
        setStatus("Message Sent!");
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus(""), 5000);
      })
      .catch(() => {
        setStatus("Oops! Something went wrong. Please try again.");
        setTimeout(() => setStatus(""), 5000);
      })
      .finally(() => setLoading(false));
  };

  const menuItems = [
    { link: 'https://github.com/Thimeth0013', text: 'Github', image: 'https://pngimg.com/uploads/github/github_PNG65.png', target: "_blank" },
    { link: 'https://www.behance.net/thimethsathmika', text: 'Behance', image: 'https://www.logo.wine/a/logo/Behance/Behance-Logo.wine.svg', target: "_blank" },
    { link: 'https://www.linkedin.com/in/thimeth-sathmika/', text: 'LinkedIn', image: 'https://logowik.com/content/uploads/images/linkedin-black9283.jpg', target: "_blank" },
  ];

  return (
    <section id="contact" className="min-h-screen bg-black overflow-hidden px-6 pt-20 md:pt-30 pb-10">
      <div className="container mx-auto px-2 sm:px-6 z-10">
        {/* **FIX: Removed explicit ml/mr and added mx-auto to center the content wrapper** */}
        <div className="max-w-6xl mx-auto"> 
          <motion.div
            ref={contactRef}
            // Adjusted gap for better mobile spacing
            className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-16 md:mb-20" 
            variants={containerVariants}
            initial="hidden"
            animate={contactInView ? "visible" : "hidden"}
          >
            {/* Contact Information */}
            <motion.div 
              className="space-y-6 md:space-y-8" 
              variants={containerVariants}
            >
              <div className="space-y-4 md:space-y-6">
                <motion.div 
                  className="flex mt-6 md:mt-10" 
                  variants={subtitleVariants}
                >
                  <Sparkle className="text-blue-800 mr-2 w-5 h-5 md:w-6 md:h-6" />
                  {/* Reduced font size on mobile for better fit */}
                  <h2 className="text-sm md:text-xl font-medium text-blue-800"> 
                    Get in Touch
                  </h2>
                </motion.div>

                <motion.h1
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-left mt-0 mb-4 md:mb-6 max-w-4xl leading-snug md:leading-tight text-white"
                  variants={titleVariants}
                >
                  Have a project in mind or want to collaborate? I'd love to hear from you.
                </motion.h1>

                <motion.div 
                  className="flex items-center gap-2 md:gap-3" 
                  variants={emailVariants}
                >
                  <MailIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-800" />
                  <span className="text-gray-300 font-medium text-base md:text-lg">
                    <a 
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=sathmikakb@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-800 transition-colors"
                    >
                      sathmikakb@gmail.com
                    </a>                  
                  </span>
                  
                  {/* Increased button size on mobile for easier tapping */}
                  <motion.button
                    onClick={handleEmailClick}
                    className="relative w-8 h-8 flex items-center justify-center ml-2" 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={emailCopied ? "Email copied" : "Copy email address"}
                  >
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ 
                        rotateY: emailCopied ? 180 : 0,
                        opacity: emailCopied ? 0 : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Copy className="w-4 h-4 text-gray-400 hover:text-blue-800 transition-colors" />
                    </motion.div>
                    
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      animate={{ 
                        rotateY: emailCopied ? 0 : -180,
                        opacity: emailCopied ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Check className="w-4 h-4 text-blue-600" />
                    </motion.div>
                  </motion.button>
                  
                  {emailCopied && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-blue-600 font-medium"
                    >
                      Copied!
                    </motion.span>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              ref={formRef}
              onSubmit={handleSubmit}
              // **FIX: Use mx-auto on mobile (max-w-sm) to center the form, and reset on desktop (md:mx-0) to align with grid**
              className="space-y-5 md:space-y-6 relative max-w-sm w-full mx-auto md:max-w-md md:mx-0 md:ml-auto" 
              variants={formVariants}
            >
              {['name','email','subject','message'].map((field, idx) => (
                <motion.div key={idx} variants={inputVariants}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                    {field}
                  </label>
                  {field === 'message' ? (
                    <textarea
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      rows={4}
                      // Consistent input styling
                      className="w-full px-4 py-3 text-base rounded-lg border border-blue-800/20 bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium resize-none" 
                      required
                    />
                  ) : (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      id={field}
                      name={field}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      // Consistent input styling
                      className="w-full px-4 py-3 text-base rounded-lg border border-blue-800/20 bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium" 
                      required
                    />
                  )}
                </motion.div>
              ))}

              <motion.button
                type="submit"
                // Adjusted button padding for better feel
                className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-800 to-blue-600 text-white text-base font-medium hover:from-blue-700 hover:to-blue-500 transition-all disabled:opacity-50 w-full md:w-auto" 
                variants={buttonVariants}
                disabled={loading}
              >
                <div className="flex gap-3 items-center justify-center">
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </div>
              </motion.button>

              {status && (
                <motion.div
                  className={`text-center mt-4 text-base font-medium ${
                    status.includes('Sent') ? 'text-green-400' : 'text-red-400'
                  }`}
                  variants={statusVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {status}
                </motion.div>
              )}

              {loading && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="w-8 h-8 border-4 border-blue-800/50 border-t-blue-800 rounded-full animate-spin" />
                </motion.div>
              )}
            </motion.form>
          </motion.div>

          {/* Footer */}
          <motion.div
            ref={footerRef}
            variants={footerVariants}
            initial="hidden"
            animate={footerInView ? "visible" : "hidden"}
          >
            <motion.div className="flex text-blue-800 gap-3 mb-4 items-center" variants={subtitleVariants}>
              <h1 className="text-xl md:text-2xl font-bold">Checkout My Work</h1>
              <ArrowDownRight className="w-6 h-6" />
            </motion.div>

            <motion.div variants={subtitleVariants}>
              <FlowingMenu items={menuItems} />
            </motion.div>

            <motion.div 
              // Adjusted text size for mobile
              className="flex flex-col md:flex-row justify-between gap-2 md:gap-0 mt-16 md:mt-20 text-blue-800/80 text-xs sm:text-sm font-medium" 
              variants={footerVariants}
            >
              <h2 variants={subtitleVariants}>Ambitiously Crafted</h2>
              <h2 variants={subtitleVariants}>© 2025 Thimeth Sathmika. All rights reserved.</h2>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>
        {`
          @keyframes marquee {
            from { transform: translateX(0%) }
            to { transform: translateX(-50%) }
          }
          .animate-marquee {
            animation: marquee 15s linear infinite;
          }
          .translate-101 {
            transform: translateY(101%);
          }
        `}
      </style>
    </section>
  );
};