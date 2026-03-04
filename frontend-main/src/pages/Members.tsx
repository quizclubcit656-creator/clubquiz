import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Award, Calendar } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import GlassCard from '../components/GlassCard';

const Members = () => {
  const [membersList, setMembersList] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/team`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setMembersList(data);
          const years = Array.from(new Set(data.map(m => m.year).filter(Boolean))) as string[];
          const sortedYears = years.sort((a, b) => parseInt(b) - parseInt(a));
          setAvailableYears(sortedYears);
          if (sortedYears.length > 0) {
            setSelectedYear(sortedYears[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch members', err);
      } finally {
        setLoadingMembers(false);
      }
    };
    fetchTeam();
  }, []);
  const benefits = [
    {
      icon: Award,
      title: 'Recognition & Certificates',
      description: 'Earn certificates and recognition for your participation and achievements',
    },
    {
      icon: Users,
      title: 'Networking Opportunities',
      description: 'Connect with like-minded individuals and build lasting friendships',
    },
    {
      icon: Calendar,
      title: 'Exclusive Events',
      description: 'Access to special workshops, competitions, and training sessions',
    },
  ];

  const [content, setContent] = useState<any>({
    requirements: [
      'Currently enrolled student at CIT',
      'Passion for learning and quizzing',
      'Willingness to participate in club activities',
      'Commitment to attend regular meetings',
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/page-content/members`);
        const data = await res.json();
        if (data && data.requirements) {
          setContent(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, []);

  const requirements = content.requirements;

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
      <div className="relative min-h-screen pt-24 pb-16 overflow-hidden">
        {/* Base dark textured gradient to match home */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-[#050505] to-[#000000] z-0"></div>
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Become a <span className="text-gold">Member</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Join our vibrant community and embark on an exciting journey of knowledge and growth
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <GlassCard className="text-center">
              <UserPlus size={64} className="text-gold mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">Why Join Quiz Club CIT?</h2>
              <p className="text-gray-100 text-lg mb-8 max-w-2xl mx-auto">
                Being a member of Quiz Club CIT opens doors to incredible opportunities for personal
                growth, skill development, and making lifelong connections.
              </p>
              <div className="flex justify-center">
                <button className="px-10 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark-primary font-bold text-lg rounded-full hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 hover:scale-105">
                  Register Now
                </button>
              </div>
            </GlassCard>
          </motion.div>

          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-white text-center mb-12"
            >
              Member Benefits
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {benefits.map((benefit, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <GlassCard className="text-center h-full">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                        <benefit.icon size={32} className="text-dark-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-200">{benefit.description}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <GlassCard>
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Membership Requirements
              </h2>
              <div className="max-w-2xl mx-auto">
                <ul className="space-y-4">
                  {requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center flex-shrink-0 mt-1 mr-4">
                        <span className="text-dark-primary font-bold text-sm">✓</span>
                      </div>
                      <span className="text-gray-100 text-lg">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                How to Register
              </h2>
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-dark-primary font-bold text-xl mx-auto mb-4">
                      1
                    </div>
                    <h3 className="text-white font-semibold mb-2">Fill the Form</h3>
                    <p className="text-gray-200 text-sm">
                      Complete the online registration form with your details
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-dark-primary font-bold text-xl mx-auto mb-4">
                      2
                    </div>
                    <h3 className="text-white font-semibold mb-2">Attend Orientation</h3>
                    <p className="text-gray-200 text-sm">
                      Join our orientation session to meet the team
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-dark-primary font-bold text-xl mx-auto mb-4">
                      3
                    </div>
                    <h3 className="text-white font-semibold mb-2">Start Participating</h3>
                    <p className="text-gray-200 text-sm">
                      Begin your quizzing journey with us
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <button className="px-10 py-4 bg-gradient-to-r from-gold to-gold-dark text-dark-primary font-bold text-lg rounded-full hover:shadow-lg hover:shadow-gold/50 transition-all duration-300 hover:scale-105">
                    Start Registration
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Members Directory Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-24 mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="text-gold">Members Directory</span>
              </h2>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                Explore the incredible individuals who make up our alumni and current active members through the years.
              </p>
            </div>

            {/* Year-wise Filter Calendar Style */}
            {!loadingMembers && availableYears.length > 0 && (
              <div className="flex justify-center mb-12">
                <div className="flex overflow-x-auto gap-4 p-2 bg-dark-secondary rounded-2xl border border-gray-800 shadow-xl max-w-full custom-scrollbar">
                  {availableYears.map(year => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-8 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${selectedYear === year
                        ? 'bg-gradient-to-r from-gold to-gold-dark text-dark-primary shadow-[0_0_15px_rgba(255, 215, 0, 0.7)] scale-105'
                        : 'text-gray-200 hover:text-white hover:bg-white/5'}`}
                    >
                      {year} Batch
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loadingMembers ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : availableYears.length === 0 ? (
              <div className="text-center py-12 bg-dark-secondary rounded-2xl border border-gray-800 border-dashed">
                <p className="text-gray-100">No member records found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {membersList.filter(m => m.year === selectedYear).sort((a, b) => (a.order || 999) - (b.order || 999)).map((member, idx) => (
                  <motion.div
                    key={member._id || idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="bg-dark-secondary rounded-2xl p-6 flex flex-col items-center text-center border border-gray-800 hover:border-gold/30 hover:shadow-[0_0_20px_rgba(255, 215, 0, 0.5)] transition-all group"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-gold/20 group-hover:border-gold transition-colors p-1">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center text-2xl font-bold text-gray-700">
                        {member.image || member.imageUrl ? (
                          <img src={member.image || member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          member.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
                    <p className="text-gold text-xs uppercase tracking-widest mb-3">{member.role || 'Member'}</p>
                    {member.department && (
                      <p className="text-gray-100 text-xs w-full truncate">{member.department}</p>
                    )}
                  </motion.div>
                ))
                }
              </div>
            )}
          </motion.div>
        </div>
      </div >
    </PageTransition >
  );
};

export default Members;
