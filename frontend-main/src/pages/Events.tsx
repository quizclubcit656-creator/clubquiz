import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Clock, ExternalLink, Filter, MapPin, Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageTransition from '../components/PageTransition';

interface Event {
  _id?: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  participants?: string;
  description: string;
  isUpcoming: boolean;
  googleFormUrl?: string;
  imageUrl?: string;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to fetch events', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter(event => {
      if (filter === 'upcoming') return event.isUpcoming;
      if (filter === 'past') return !event.isUpcoming;
      return true;
    })
    .filter(event =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-gold">Events</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover a world of knowledge and competition. Join our flagship events and showcase your expertise.
            </p>
          </motion.div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
            <div className="flex p-1 bg-dark-secondary rounded-2xl border border-white/5 shadow-lg">
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'upcoming' ? 'bg-gradient-to-r from-gold to-gold-dark text-dark-primary shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('past')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'past' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Past
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                All
              </button>
            </div>

            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gold transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-secondary border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-gold outline-none transition-all placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[550px] rounded-[2.5rem] bg-white/5 animate-pulse border border-white/10" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event._id}
                    layout
                    variants={cardVariants}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-full"
                  >
                    <div className="group relative overflow-hidden flex flex-col h-full bg-[#1e1e2e]/90 backdrop-blur-md border border-gold/20 hover:border-gold/50 rounded-[2rem] transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,215,0,0.15)]">
                      {/* Image Header */}
                      {event.imageUrl && (
                        <div className="relative h-56 overflow-hidden rounded-t-[2rem]">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2e] via-[#1e1e2e]/40 to-transparent opacity-90" />

                          {/* Status Badge - Vivid Gold with Glow */}
                          <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border ${event.isUpcoming ? 'bg-[#FFD700] text-black border-transparent shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'bg-white/10 text-white/50 border-white/10'}`}>
                            {event.isUpcoming ? 'Upcoming' : 'Completed'}
                          </div>
                        </div>
                      )}

                      {/* Status Badge when no image */}
                      {!event.imageUrl && (
                        <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border z-10 ${event.isUpcoming ? 'bg-[#FFD700] text-black border-transparent shadow-[0_0_15px_rgba(255,215,0,0.4)]' : 'bg-white/10 text-white/50 border-white/10'}">
                          {event.isUpcoming ? 'Upcoming' : 'Completed'}
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-8 flex-grow flex flex-col">
                        <div className="mb-6">
                          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[#FFD700] transition-colors duration-500 leading-tight">
                            {event.title}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 font-medium">
                            {event.description}
                          </p>
                        </div>

                        {/* Details Info Grid */}
                        <div className="space-y-5 mb-8">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#FFD700]/10 group-hover:border-[#FFD700]/30 transition-colors">
                                <Calendar size={18} className="text-[#FFD700]" />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Date</p>
                                <p className="text-sm text-gray-100 font-black">{event.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#FFD700]/10 group-hover:border-[#FFD700]/30 transition-colors">
                                <Clock size={18} className="text-[#FFD700]" />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Time</p>
                                <p className="text-sm text-gray-100 font-black">{event.time || 'TBA'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#FFD700]/10 group-hover:border-[#FFD700]/30 transition-colors">
                                <MapPin size={18} className="text-[#FFD700]" />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Location</p>
                                <p className="text-sm text-gray-100 font-black truncate">{event.venue || 'Online'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#FFD700]/10 group-hover:border-[#FFD700]/30 transition-colors">
                                <Users size={18} className="text-[#FFD700]" />
                              </div>
                              <div>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Slots</p>
                                <p className="text-sm text-gray-100 font-black">{event.participants || 'Flexible'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto pt-4 border-t border-white/5">
                          {event.isUpcoming && event.googleFormUrl ? (
                            <a
                              href={event.googleFormUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full relative overflow-hidden group/btn flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFC107] rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(255,215,0,0.3)] hover:shadow-[0_4px_25px_rgba(255,215,0,0.5)] hover:scale-[1.02]"
                            >
                              <span className="relative z-10 text-black font-black tracking-wide flex items-center gap-2">
                                Register Now
                                <ExternalLink size={18} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                              </span>
                              {/* Shine animation overlay */}
                              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shine_1.5s_infinite] transition-transform" />
                            </a>
                          ) : (
                            <div className="w-full py-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center gap-2">
                              <span className="text-gray-600 font-bold uppercase tracking-widest text-xs">
                                {event.isUpcoming ? 'Application Open Soon' : 'Event Concluded'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-white/10 border-dashed">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                <Filter className="text-gray-600" size={40} />
              </div>
              <h3 className="text-3xl font-black text-white mb-3">No matching events</h3>
              <p className="text-gray-500 font-light text-lg">Adjust your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Events;