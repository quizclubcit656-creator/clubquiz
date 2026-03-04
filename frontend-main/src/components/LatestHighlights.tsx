import { Variants, motion } from 'framer-motion';
import { ArrowRight, Calendar, Image as ImageIcon, Sparkles, Trophy, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const LatestHighlights = ({ heading, subtitle }: { heading: string, subtitle: string }) => {
    const [highlights, setHighlights] = useState<any[]>([]);

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const res = await fetch(`${API_URL}/api/highlights`);
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter out inactive ones
                    const active = data.filter(h => h.isActive);
                    // Order by fixed order: event, gallery, achievement, member
                    const order = ['event', 'gallery', 'achievement', 'member'];
                    active.sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));
                    setHighlights(active);
                }
            } catch (err) {
                console.error("Error fetching highlights", err);
            }
        };
        fetchHighlights();
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const getTypeConfig = (hl: any) => {
        const item = hl.item || {};
        switch (hl.type) {
            case 'event':
                return {
                    icon: Calendar,
                    typeLabel: 'Events',
                    title: item.title || 'Untitled Event',
                    description: hl.descriptionOverride || item.description || '',
                    dateTag: '',
                    img: item.imageUrl || '',
                    link: '/events',
                    defaultBadge: 'UPCOMING',
                    defaultBtn: 'VIEW EVENTS →',
                    isGradient: !item.imageUrl,
                    gradient: 'linear-gradient(135deg, #1a0035, #6a0dad, #2d0057)'
                };
            case 'gallery':
                return {
                    icon: ImageIcon,
                    typeLabel: 'Gallery',
                    title: item.title || 'Gallery Update',
                    description: hl.descriptionOverride || item.description || '',
                    dateTag: '',
                    img: item.imageUrl || (item.photos && item.photos[0]) || '',
                    link: '/gallery',
                    defaultBadge: 'NEW',
                    defaultBtn: 'VIEW GALLERY →'
                };
            case 'achievement':
                return {
                    icon: Trophy,
                    typeLabel: 'Achievements',
                    title: item.title || 'Recent Achievement',
                    description: hl.descriptionOverride || item.description || '',
                    dateTag: '',
                    img: item.imageUrl || '',
                    link: '/achievements',
                    defaultBadge: 'WINNER',
                    defaultBtn: 'VIEW ACHIEVEMENT →'
                };
            case 'member':
                return {
                    icon: User,
                    typeLabel: 'Members',
                    title: `Suriya Prasanna KS`,
                    description: `Secretaries`,
                    dateTag: '',
                    img: item.imageUrl || item.image || '',
                    link: '/team',
                    defaultBadge: 'SPOTLIGHT',
                    defaultBtn: 'VIEW MEMBER →'
                };
            default:
                return { icon: Calendar, typeLabel: '', title: '', description: '', dateTag: '', img: '', link: '#', defaultBadge: '', defaultBtn: '' };
        }
    };

    return (
        <section className="py-24 bg-[#0a0a0f] overflow-hidden">
            <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20 flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 shadow-sm">
                        <Sparkles className="text-[#FFD700]" size={14} />
                        <span className="text-gray-300 text-xs font-semibold uppercase tracking-widest">Latest Highlights</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        {heading || "What's Happening"}
                    </h2>
                    <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        {subtitle || "Catch up on our recent events, achievements, and top moments in the club."}
                    </p>
                </motion.div>

                {/* Cards Layout */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {highlights.map((hl) => {
                        const conf = getTypeConfig(hl);

                        return (
                            <motion.div key={hl._id} variants={itemVariants} className="flex flex-col">
                                {/* Section Title Above Card */}
                                <div className="section-title-accent">
                                    <h3>
                                        {conf.typeLabel}
                                    </h3>
                                </div>

                                {/* Card Container */}
                                <div className="highlight-card group overflow-hidden">
                                    {/* Top Image Area */}
                                    <div className="highlight-image-area">
                                        {conf.isGradient ? (
                                            <div
                                                style={{ background: conf.gradient || 'linear-gradient(135deg, #1a0035, #6a0dad, #2d0057)' }}
                                            />
                                        ) : (
                                            <img
                                                src={conf.img}
                                                alt={conf.title}
                                                className={`group-hover:scale-110 ${hl.type === 'member' ? 'object-top' : 'object-center'}`}
                                            />
                                        )}

                                        {/* Badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="badge-pill">
                                                {hl.badgeLabel || conf.defaultBadge}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h4 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight">
                                            {conf.title}
                                        </h4>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                                            {conf.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-center pt-4">
                                            <Link
                                                to={conf.link}
                                                className="btn-pill w-full justify-center"
                                            >
                                                {(hl.buttonText || conf.defaultBtn).replace(' →', '')}
                                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};