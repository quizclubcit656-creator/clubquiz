import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, GraduationCap, PenTool, Puzzle, Sparkles, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LatestHighlights } from '../components/LatestHighlights';
import MiddleBanner from '../components/MiddleBanner';
import PageTransition from '../components/PageTransition';

const Home = () => {
  const [content, setContent] = useState<any>({
    welcomePrefix: "Welcome to",
    clubName: "Quiz Club CIT",
    heroLine1: "Igniting minds through knowledge,",
    heroLine2: "fostering curiosity, and",
    heroLine3: "building champions",
    stats: [
      {
        icon: 'Trophy',
        title: 'Championship Winners',
        value: '15+',
        description: 'Inter-collegiate victories',
      },
      {
        icon: 'Brain',
        title: 'Knowledge Excellence',
        value: '500+',
        description: 'Questions mastered',
      },
      {
        icon: 'Users',
        title: 'Team Spirit',
        value: '100+',
        description: 'Active members',
      },
    ],
    highlightsHeading: "Latest Highlights",
    highlightsSubtitle: "Catch up on our recent events, achievements, and top moments.",
    benefitsHeading: "Why Join Quiz Club?",
    benefitsSubtitle: "Discover the benefits of being part of our vibrant community",
    benefits: [
      {
        icon: 'Target',
        title: 'Sharpen Your Mind',
        description: 'Develop critical thinking and rapid recall abilities through challenging quizzes.'
      },
      {
        icon: 'Users',
        title: 'Build Connections',
        description: 'Network with like-minded individuals and create lasting friendships.'
      },
      {
        icon: 'Trophy',
        title: 'Win Recognition',
        description: 'Compete at inter-collegiate levels and gain prestigious accolades.'
      }
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/page-content/home`);
        const data = await res.json();
        if (data && Object.keys(data).length > 0) {
          setContent((prev: any) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, []);

  const stats = content.stats;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        <section className="relative min-h-screen flex items-center justify-center pt-16 pb-20 sm:pb-32 bg-[#000000]">
          {/* Base dark textured gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111111] via-[#000000] to-[#000000]"></div>

          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

          {/* Top golden accent line and glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-30"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[400px] bg-[#FFD700] opacity-[0.04] blur-[50px] md:blur-[120px] pointer-events-none"></div>

          {/* Bottom golden curved accent line and glow (simulating the floor from the image) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[150%] h-[200px] border-t border-gold opacity-30 rounded-[100%] blur-[1px]"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[#FFD700] opacity-[0.06] blur-[50px] md:blur-[100px] pointer-events-none"></div>

          {/* Sparkling golden specks/stars in background */}
          <div className="hidden md:block pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-gold"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: Math.random() * 3 + 1 + 'px',
                  height: Math.random() * 3 + 1 + 'px',
                  boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.8)'
                }}
                animate={{
                  opacity: [Math.random() * 0.3 + 0.1, Math.random() * 0.8 + 0.4, Math.random() * 0.3 + 0.1],
                  scale: [1, Math.random() + 1.2, 1]
                }}
                transition={{
                  duration: Math.random() * 4 + 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Floating light curves (left & right swooshes) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="absolute -left-[10%] top-[40%] w-[50%] h-[50%] border-t border-r border-[#FFD700] rounded-tr-[100%] blur-[2px] opacity-20 transform -rotate-12 pointer-events-none"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute -right-[15%] bottom-[20%] w-[60%] h-[60%] border-t border-l border-[#FFD700] rounded-tl-[100%] blur-[2px] opacity-20 transform rotate-12 pointer-events-none"
          ></motion.div>

          {/* Left Side: Trophy & Books Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="absolute flex flex-col items-center -left-8 sm:left-[5%] 2xl:left-[10%] bottom-[12%] sm:bottom-[15%] scale-[0.45] sm:scale-90 xl:scale-100 opacity-60 sm:opacity-100 z-0 pointer-events-none"
          >
            {/* Glowing Trophy */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 drop-shadow-[0_0_20px_rgba(255, 215, 0,0.8)]"
            >
              <Trophy size={90} className="text-[#FFD700] fill-[#FFD700] stroke-black stroke-1" />
            </motion.div>

            {/* Books Stack */}
            <div className="relative -mt-4 flex flex-col items-center z-10">
              <div className="w-28 h-8 bg-gradient-to-br from-[#1a1a1a] to-black rounded border-t-2 border-r border-[#ffd700]/60 transform -rotate-2 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.9)] flex items-center justify-start px-2">
                <div className="w-[90%] h-2 bg-white/20 rounded-sm"></div>
              </div>
              <div className="w-32 h-9 bg-gradient-to-bl from-[#111111] to-black rounded border-t-2 border-[#ffd700]/50 -mt-1 transform rotate-1 shadow-[0_15px_20px_-5px_rgba(0,0,0,0.9)] flex items-center justify-start px-2">
                <div className="w-[90%] h-3 bg-white/20 rounded-sm"></div>
              </div>
              <div className="w-36 h-10 bg-gradient-to-r from-black via-[#1a1a1a] to-black rounded border-t-2 border-[#ffd700]/40 -mt-2 shadow-[0_20px_25px_-5px_rgba(0,0,0,1)] flex items-center justify-start px-2">
                <div className="w-[90%] h-3 bg-white/20 rounded-sm"></div>
              </div>
            </div>

            {/* Dark box with gold ? */}
            <motion.div
              animate={{ y: [-3, 3, -3], rotate: [10, 15, 10] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-16 bottom-2 w-12 h-10 bg-gradient-to-br from-[#111111] to-black rounded shadow-[0_0_15px_rgba(255, 215, 0,0.15)] flex items-center justify-center border-t border-l border-gray-600"
            >
              <span className="text-[#FFD700] font-bold text-xl drop-shadow-[0_0_8px_rgba(255, 215, 0,0.8)]">?</span>
            </motion.div>
          </motion.div>

          {/* Right Side: Graduation Cap, Puzzle, Box, Pen */}
          <motion.div
            initial={{ opacity: 0, x: 50, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="absolute flex flex-col items-center -right-8 sm:right-[5%] 2xl:right-[10%] bottom-[12%] sm:bottom-[15%] scale-[0.45] sm:scale-90 xl:scale-100 opacity-60 sm:opacity-100 z-0 pointer-events-none"
          >
            {/* Graduation Cap */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-20 mb-12 drop-shadow-[0_15px_20px_rgba(0,0,0,0.8)]"
            >
              <GraduationCap size={110} className="text-[#FFD700] fill-[#111] stroke-1" />
              <div className="absolute top-[80px] left-[50px] w-4 h-16 bg-[#FFD700] rounded-sm transform rotate-12 drop-shadow-[0_0_10px_rgba(255, 215, 0,0.8)]"></div>
            </motion.div>

            {/* Gold block with dark ? */}
            <motion.div
              animate={{ y: [4, -4, 4], rotate: [-15, -5, -15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -top-10 -left-16 w-14 h-12 bg-gradient-to-br from-[#FFD700] to-[#E6C200] border-t-2 border-l-2 border-white/50 rounded shadow-[0_0_25px_rgba(255, 215, 0, 0.8)] flex items-center justify-center"
            >
              <span className="text-black font-extrabold text-2xl">?</span>
            </motion.div>

            {/* Dark block with light ? */}
            <motion.div
              animate={{ y: [-3, 3, -3], rotate: [5, 15, 5] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-4 -right-12 w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded shadow-[0_10px_15px_rgba(0,0,0,0.9)] flex items-center justify-center border border-gray-500"
            >
              <span className="text-white font-bold text-lg">?</span>
            </motion.div>

            {/* Puzzle pieces */}
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [-10, 0, -10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="absolute bottom-16 -left-12 flex space-x-2 drop-shadow-[0_0_15px_rgba(255, 215, 0, 0.9)]"
            >
              <Puzzle size={35} className="text-[#FFD700] fill-[#E6C200]" />
              <Puzzle size={30} className="text-[#FFD700] fill-transparent transform rotate-45 mr-6" />
            </motion.div>

            {/* Pen Tool */}
            <motion.div
              animate={{ y: [3, -3, 3], x: [-2, 2, -2], rotate: [-45, -35, -45] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-10 -right-8 drop-shadow-[0_10px_15px_rgba(0,0,0,0.9)]"
            >
              <PenTool size={55} className="text-[#FFD700] fill-gray-900" strokeWidth={1} />
            </motion.div>

          </motion.div>

          <div className="relative z-[2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-gold mr-4"></div>
              <Sparkles className="text-gold mr-2" size={24} />
              <span className="text-gold font-medium text-xl tracking-wide">
                {content.welcomePrefix || "Welcome to"} <span className="text-white font-bold">{content.clubName || "Quiz Club CIT"}</span>
              </span>
              <Sparkles className="text-gold ml-2" size={24} />
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-gold ml-4"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-6xl md:text-8xl font-bold mb-6 flex flex-col items-center"
            >
              <div className="logo-box">
                <img
                  src={content.logoUrl || "https://placehold.co/400x400/white/black?text=Q"}
                  alt="Logo"
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <span className="text-white drop-shadow-lg whitespace-nowrap">
                Quiz Club <span className="text-gold drop-shadow-[0_0_15px_rgba(255, 215, 0, 0.9)]">CIT</span>
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-2xl md:text-3xl text-gray-100 mb-10 max-w-4xl mx-auto leading-relaxed font-light px-4"
            >
              <p className="mb-2">{content.heroLine1}</p>
              <p className="mb-2">{content.heroLine2}</p>
              <p>{content.heroLine3}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/team"
                className="group px-10 py-4 bg-gradient-to-r from-[#FFD700] via-[#FFD700] to-[#E6C200] text-black font-bold text-lg rounded-full hover:shadow-[0_0_20px_rgba(255, 215, 0,0.6)] transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
              >
                <span>Join Our Journey</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </Link>
              <Link
                to="/about"
                className="px-10 py-4 border-2 border-gold text-gold font-bold text-lg rounded-full hover:bg-gold/10 hover:shadow-[0_0_15px_rgba(255, 215, 0, 0.7)] transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Middle Banner Section */}
        <MiddleBanner />

        <section className="py-20 bg-dark-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto'>
              {stats.map((stat: any, index: number) => {
                const IconComp = (LucideIcons as any)[stat.icon] || Trophy;
                return (
                  <motion.div key={index} variants={itemVariants} className="h-full">
                    <div className="bg-[#111111] rounded-2xl p-8 h-full border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col items-center text-center group">
                      <div className="mb-6 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-[#000000] border border-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <IconComp size={32} className="text-gold" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-bold text-gold mb-2">{stat.value}</h3>
                      <h4 className="text-xl font-bold text-white mb-2">{stat.title}</h4>
                      <p className="text-gray-200 text-sm">{stat.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        <LatestHighlights heading={content.highlightsHeading} subtitle={content.highlightsSubtitle} />

        <section className="py-20 bg-[#000000]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16 flex flex-col items-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-white">Why Join </span>
                <span className="text-gold">Quiz Club?</span>
              </h2>
              <p className="text-gray-200 text-sm md:text-base max-w-2xl mx-auto">
                Discover the benefits of being part of our vibrant community
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {(content.benefits || []).slice(0, 3).map((benefit: any, index: number) => {
                const IconComp = (LucideIcons as any)[benefit.icon] || LucideIcons.Target;
                return (
                  <motion.div key={index} variants={itemVariants} className="h-full">
                    <div className="bg-[#1a1a1a] md:bg-[#111111] rounded-2xl p-8 h-full border border-white/5 hover:border-white/10 transition-colors flex flex-col">
                      <div className="mb-6 flex justify-start">
                        <IconComp size={32} className="text-[#FFD700]" />
                      </div>
                      <h3 className="text-white font-bold text-xl mb-3">{benefit.title}</h3>
                      <p className="text-gray-200 text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;