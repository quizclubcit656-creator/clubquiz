import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import GlassCard from '../components/GlassCard';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ text: '', type: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setStatusMessage({ text: 'Message sent successfully!', type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatusMessage({ text: 'Failed to send message. Please try again.', type: 'error' });
      }
    } catch (error) {
      setStatusMessage({ text: 'An error occurred. Please try again later.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'quizclub@cit.edu',
      link: 'mailto:quizclub@cit.edu',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 1234567890',
      link: 'tel:+911234567890',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'CIT Campus, Coimbatore, Tamil Nadu',
      link: '#',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Get in <span className="text-gold">Touch</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you!
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {contactInfo.map((info, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlassCard className="text-center h-full">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                      <info.icon size={32} className="text-dark-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
                  <a
                    href={info.link}
                    className="text-gray-200 hover:text-gold transition-colors"
                  >
                    {info.value}
                  </a>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Send us a Message</h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-100 mb-2 font-medium">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-secondary border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-100 mb-2 font-medium">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-dark-secondary border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-gray-100 mb-2 font-medium">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-secondary border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-gray-100 mb-2 font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-secondary border border-gold/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>

                {statusMessage.text && (
                  <div className={`p-4 rounded-lg text-center ${statusMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {statusMessage.text}
                  </div>
                )}

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark-primary font-semibold rounded-full hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-16"
          >
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
