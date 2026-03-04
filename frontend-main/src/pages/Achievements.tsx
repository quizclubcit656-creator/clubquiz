import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import PageTransition from '../components/PageTransition';

const AchievementCard = ({ achievement }: { achievement: any }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      }}
      className="h-full"
    >
      <GlassCard className="!p-0 overflow-hidden border border-transparent hover:border-gold/30 transition-all duration-300 flex flex-col h-full group">
        {/* Top Image */}
        <div className="h-56 w-full overflow-hidden bg-black/60 shrink-0 rounded-t-2xl flex items-center justify-center">
          {achievement.imageUrl && (
            <img
              src={achievement.imageUrl}
              alt={achievement.title}
              loading="lazy"
              className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          )}
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col flex-grow text-left">
          <h3 className="text-xl font-bold text-gold mb-3 group-hover:text-amber-300 transition-colors uppercase tracking-tight">
            {achievement.title}
          </h3>
          <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 line-clamp-4">
            {achievement.description}
          </p>

          <div className="mt-auto pt-4 border-t border-white/5">
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">
              {achievement.year}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const Achievements = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/achievements`);
        const data = await res.json();
        // Sort by year descending
        const sortedData = Array.isArray(data)
          ? data.sort((a, b) => Number(b.year) - Number(a.year))
          : [];
        setAchievements(sortedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-white/50 font-bold tracking-widest text-sm uppercase">Loading Achievements...</p>
        </div>
      </div>
    );
  }

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
              Our <span className="text-gold">Achievements</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Celebrating our journey of excellence and the milestones we've achieved together across the globe.
            </p>
          </motion.div>

          {/* Grid Layout */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {achievements.map((achievement, index) => (
              <AchievementCard key={achievement._id || index} achievement={achievement} />
            ))}
          </motion.div>

          {/* Fallback for empty state */}
          {achievements.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-[2rem] border border-white/10 border-dashed mb-20">
              <p className="text-gray-500 text-lg">No achievements recorded yet.</p>
            </div>
          )}

        </div>
      </div>
    </PageTransition>
  );
};

export default Achievements;