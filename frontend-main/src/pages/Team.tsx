import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import GlassCard from '../components/GlassCard';
import PageTransition from '../components/PageTransition';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  email?: string;
  year: string;
  linkedin?: string;
  github?: string;
  imageUrl?: string;
  image?: string; // New field as requested
  description?: string;
  department?: string;
  category: string;
  order?: number; // Added to support manual ordering
}

const TeamCard = ({ member }: { member: TeamMember }) => {
  const isStaff = member.category === 'Staff Advisors';
  const displayImage = member.image || member.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-[340px]"
    >
      <GlassCard className="flex flex-col items-center text-center h-full group hover:border-gold/40 transition-all border border-white/5 p-4 sm:p-8 relative overflow-hidden">
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Photo Container */}
        <div className="relative mb-4 sm:mb-8 shrink-0">
          <div className={`w-24 h-32 sm:w-40 sm:h-52 rounded-2xl overflow-hidden bg-black/40 ${isStaff ? 'border-2 border-gold/50' : 'border-[3px] border-gold/80 shadow-[0_0_20px_rgba(212,175,55,0.4)]'}`}>
            {displayImage ? (
              <img src={displayImage} alt={member.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl sm:text-4xl font-bold text-gray-500 bg-white/5">
                {member.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-grow items-center w-full z-10">
          <h3 className="text-base sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-gold transition-colors duration-300">{member.name}</h3>
          <p className="text-gold font-bold text-[10px] sm:text-xs mb-2 sm:mb-4 uppercase tracking-[0.2em]">{member.role}</p>

          {isStaff && member.department && (
            <p className="text-gray-300 text-[10px] sm:text-xs font-medium mb-2 sm:mb-4 uppercase tracking-wider bg-white/5 px-2 sm:px-3 py-1 rounded-full text-center">
              {member.department}
            </p>
          )}

          {member.description && (
            <p className="text-gray-400 text-[10px] sm:text-sm mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed hidden sm:block">
              {member.description}
            </p>
          )}

          {/* Social Links */}
          <div className="mt-auto flex items-center gap-4">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-[#0077B5] hover:bg-[#0077B5]/10 transition-all duration-300 transform hover:scale-110"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
                title="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-gold hover:bg-gold/10 transition-all duration-300 transform hover:scale-110"
                title="Email"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <GlassCard className="flex flex-col items-center animate-pulse h-full p-8 w-full max-w-[340px]">
    <div className="w-40 h-52 rounded-2xl bg-white/5 mb-8" />
    <div className="h-8 w-3/4 bg-white/5 rounded-lg mb-3" />
    <div className="h-4 w-1/2 bg-white/10 rounded-full mb-6" />
    <div className="h-16 w-full bg-white/5 rounded-xl mb-6" />
    <div className="flex gap-4">
      <div className="w-9 h-9 rounded-full bg-white/5" />
      <div className="w-9 h-9 rounded-full bg-white/5" />
    </div>
  </GlassCard>
);

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/team`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setMembers(data);
          const years = Array.from(new Set(data.map((m: TeamMember) => m.year).filter(Boolean))) as string[];
          const sortedYears = years.sort((a, b) => parseInt(b) - parseInt(a));
          setAvailableYears(sortedYears);
          if (sortedYears.length > 0) {
            setSelectedYear(sortedYears[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch team members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Role priority order as requested
  const CATEGORY_ORDER = [
    'Staff Advisors',
    'Secretaries',
    'Joint Secretaries',
    'Treasurers',
    'Joint Treasurers',
    'Design Team',
    'Social Media Team',
    'Executive Directors',
    'Creative Directors',
    'Internal Affairs Team',
    'Outreach Ambassadors',
    'External Affairs Team'
  ];

  // Grouping logic: Group by CATEGORY string and filter by selectedYear
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, TeamMember[]> = {};
    // Filter members by the selected year
    const filteredMembers = members.filter(m => m.year === selectedYear);

    filteredMembers.forEach(m => {
      const catGroup = m.category || 'Others';
      if (!groups[catGroup]) groups[catGroup] = [];
      groups[catGroup].push(m);
    });
    return groups;
  }, [members, selectedYear]);

  // Sorted categories: Fixed categories first, then custom ones
  const categoriesToRender = useMemo(() => {
    const allCategories = Object.keys(groupedByCategory);
    const otherCategories = allCategories.filter(
      cat => !CATEGORY_ORDER.includes(cat)
    );
    const finalOrder = [...CATEGORY_ORDER, ...otherCategories];

    // Render only categories that have members
    return finalOrder.filter(
      cat => groupedByCategory[cat]?.length > 0
    );
  }, [groupedByCategory]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-gold">Team</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto">
              Meet the passionate individuals driving Quiz Club CIT forward
            </p>
          </motion.div>

          {/* Dropdown Year Filter */}
          {!loading && availableYears.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-16 relative z-30"
            >
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-8 py-4 bg-dark-secondary border border-gold/20 rounded-full hover:border-gold/50 transition-all text-white font-bold shadow-[0_0_15px_rgba(255, 215, 0, 0.5)] hover:shadow-[0_0_20px_rgba(255, 215, 0, 0.6)] group"
                >
                  <Calendar size={20} className="text-gold group-hover:text-amber-300 transition-colors" />
                  <span className="text-lg tracking-wide">{selectedYear} Batch</span>
                  <ChevronDown
                    size={20}
                    className={`text-gray-200 transition-transform duration-300 group-hover:text-white ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 min-w-[200px] w-full bg-dark-secondary border border-gold/20 rounded-2xl overflow-hidden shadow-2xl py-2 z-50 flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar"
                    >
                      {availableYears.map(year => (
                        <button
                          key={year}
                          onClick={() => {
                            setSelectedYear(year);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-6 py-4 text-sm font-semibold transition-all text-left flex items-center justify-between ${selectedYear === year
                            ? 'bg-gold/10 text-white border-l-2 border-gold'
                            : 'text-gray-200 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                            }`}
                        >
                          <span className="tracking-wider">{year} Batch</span>
                          {selectedYear === year && (
                            <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(255, 215, 0, 0.9)]" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {loading ? (
            <div className="space-y-24">
              {[1, 2].map(s => (
                <div key={s}>
                  <div className="h-8 w-48 bg-gold/10 rounded mb-12 mx-auto" />
                  <div className="flex flex-wrap justify-center gap-8 w-full">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-32">
              {categoriesToRender.map(category => {
                const sectionMembers = groupedByCategory[category];
                return (
                  <div key={category} className="flex flex-col items-center">
                    {/* Gold Section Heading */}
                    <div className="mb-12">
                      <h2 className="text-3xl font-bold text-white text-center">
                        <span className="text-gold">{category}</span>
                      </h2>
                    </div>

                    {/* Responsive Flex Layout: 3 columns desktop, 2 tablet, 2 mobile */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-10 w-full px-2 sm:px-0">
                      {sectionMembers
                        .sort((a, b) => (a.order || 999) - (b.order || 999))
                        .map(member => (
                          <div key={member._id} className="w-[calc(50%-6px)] sm:w-[calc(50%-20px)] lg:w-[calc(33.33%-27px)] flex justify-center">
                            <TeamCard member={member} />
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && members.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/30 text-xl font-light tracking-wide uppercase">No team members joined the journey yet.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Team;
