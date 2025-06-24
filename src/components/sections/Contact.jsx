import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import {
  MailIcon,
  Sparkle,
  Send,
  ArrowDownRight,
} from 'lucide-react';
import { motion } from 'framer-motion';
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

  const statusVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const formRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    emailjs.sendForm(import.meta.env.VITE_SERVICE_ID, import.meta.env.VITE_TEMPLATE_ID, formRef.current, import.meta.env.VITE_PUBLIC_KEY)
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
    { link: '#contact', text: 'LinkedIn', image: 'https://logowik.com/content/uploads/images/linkedin-black9283.jpg', target: "_blank" },
  ];

  return (
    <section id="contact" className="min-h-screen bg-black overflow-hidden pt-30 pb-10">
      <div className="container mx-auto px-14 sm:px-6 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex mt-10">
                  <Sparkle className="text-blue-800 mr-2 w-6 h-6" />
                  <h2 className="text-md sm:text-2xl font-medium text-blue-800">Get in Touch</h2>
                </div>
                <h1 className="text-2xl sm:text-5xl font-bold text-left mt-4 mb-6 max-w-4xl leading-tight text-white">
                  Have a project in mind or want to collaborate? I'd love to hear from you.
                </h1>
                <div className="flex items-center gap-3">
                  <MailIcon className="w-5 h-5 text-blue-800" />
                  <span className="text-gray-300 font-medium">sathmikakb@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6 relative max-w-md w-[90%] mx-auto"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-blue-800/20 bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-medium"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-blue-800/20 bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-medium"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-blue-800/20 bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-medium"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-md border border-blue-800/20 bg-gray-900/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-medium"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 pt-2 pb-1.5 rounded-full bg-gradient-to-r from-blue-800 to-blue-600 text-white font-medium hover:from-blue-700 hover:to-blue-500 transition-all"
              >
                <div className="flex gap-4 items-center justify-center">
                  {loading ? 'Sending...' : 'Send Message'} <Send />
                </div>
              </button>

              {status && (
                <motion.div
                  className="text-center text-white mt-4 font-medium"
                  variants={statusVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {status}
                </motion.div>
              )}

              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="w-8 h-8 border-4 border-blue-800/50 border-t-blue-800 rounded-full animate-spin"></div>
                </div>
              )}
            </form>
          </div>

          <div className="flex text-blue-800 gap-3 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold">Checkout My Work</h1>
            <ArrowDownRight />
          </div>

          <FlowingMenu items={menuItems} />

          <div className="flex justify-between mt-20 text-blue-800/80 text-[10px] sm:text-sm font-medium">
            <h2>Ambitiously Crafted</h2>
            <h2>© 2025 Thimeth Sathmika. All rights reserved.</h2>
          </div>
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
