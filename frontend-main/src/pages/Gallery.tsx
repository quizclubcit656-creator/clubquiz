import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import GlassCard from '../components/GlassCard';
import PageTransition from '../components/PageTransition';

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  date?: string;
  year: number;
  imageUrl?: string;
  photos?: string[];
}

// Optimized Gallery Card Component
const GalleryCard = React.memo(({ item, onClick }: { item: GalleryItem, onClick: (item: GalleryItem) => void }) => {
  const optimizedUrl = useMemo(() => {
    if (!item.imageUrl) return '';
    if (item.imageUrl.includes('unsplash.com')) {
      return `${item.imageUrl}&w=400&q=80`;
    }
    if (item.imageUrl.includes('cloudinary.com')) {
      return item.imageUrl.replace('/upload/', '/upload/w_400,q_80/');
    }
    return item.imageUrl;
  }, [item.imageUrl]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={() => onClick(item)}
      className="h-full cursor-pointer"
    >
      <GlassCard className="!p-0 overflow-hidden border border-transparent hover:border-gold/30 transition-all duration-300 flex flex-col h-full group">
        {/* Poster Image */}
        <div className="h-56 w-full overflow-hidden bg-black/60 shrink-0 rounded-t-2xl flex items-center justify-center relative">
          {optimizedUrl && (
            <img
              src={optimizedUrl}
              alt={item.title}
              loading="lazy"
              className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col flex-grow text-left">
          <h3 className="text-xl font-bold text-gold mb-3 group-hover:text-amber-300 transition-colors uppercase tracking-tight line-clamp-2">
            {item.title}
          </h3>
          <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 line-clamp-4">
            {item.description}
          </p>

          <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-start gap-2">
            <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-dark">
              {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date TBA'}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
});

// Skeleton Loader Component
const SkeletonCard = () => (
  <div className="h-[400px] rounded-[2rem] bg-white/5 animate-pulse border border-white/10 overflow-hidden backdrop-blur-sm flex flex-col">
    <div className="h-56 bg-white/10 w-full shrink-0" />
    <div className="p-6 space-y-4 flex flex-col flex-grow">
      <div className="h-6 bg-white/10 rounded w-3/4" />
      <div className="h-4 bg-white/10 rounded w-full" />
      <div className="h-4 bg-white/10 rounded w-5/6" />
      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="h-4 bg-white/10 rounded w-1/3" />
      </div>
    </div>
  </div>
);

const Gallery = () => {
  const [groupedItems, setGroupedItems] = useState<Record<string, GalleryItem[]>>({});
  const [loading, setLoading] = useState(true);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const axiosRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/gallery`);
        const data = axiosRes.data;
        console.log('Gallery Data (axios):', data);

        if (Array.isArray(data)) {
          const grouped: Record<string, GalleryItem[]> = {};

          data.forEach((item: GalleryItem) => {
            const itemYear = item.year || new Date(item.date || '').getFullYear() || new Date().getFullYear();
            if (!grouped[itemYear]) grouped[itemYear] = [];
            grouped[itemYear].push(item);
          });
          console.log('Grouped Items:', grouped);
          setGroupedItems(grouped);
        } else if (data && typeof data === 'object') {
          console.log('Data is object, setting grouped items directly');
          setGroupedItems(data);
        }
      } catch (err) {
        console.error('Fetch/Axios Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const handleCardClick = async (item: GalleryItem) => {
    setFetchingDetails(true);
    try {
      const axiosRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/gallery/${item._id}`);
      const fullItem = axiosRes.data;
      setSelectedItem(fullItem);
    } catch (err) {
      console.error('Failed to fetch event details', err);
    } finally {
      setFetchingDetails(false);
    }
  };

  const isObject = groupedItems && typeof groupedItems === 'object' && !Array.isArray(groupedItems);
  const years = useMemo(() =>
    isObject ? Object.keys(groupedItems).sort((a, b) => Number(b) - Number(a)) : []
    , [groupedItems, isObject]);

  return (
    <PageTransition>
      <div className="min-h-screen pt-24 pb-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 mt-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-gold">Gallery</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Preserving the legacy of CIT Quiz Club through snapshots and stories.
            </p>
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="space-y-16">
              {[2024, 2023].map(year => (
                <div key={year} className="flex flex-col">
                  <div className="h-12 bg-white/5 rounded w-48 mx-auto mb-10 animate-pulse" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {years.map((year) => (
                <div key={year} className="flex flex-col">
                  {/* Section Heading */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-10 text-center"
                  >
                    <h2 className="text-4xl md:text-5xl font-black text-gold">
                      {year} Events
                    </h2>
                  </motion.div>

                  {/* Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {groupedItems[year].map((item) => (
                      <GalleryCard key={item._id} item={item} onClick={handleCardClick} />
                    ))}
                  </div>
                </div>
              ))}

              {years.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-white/50 text-lg">No gallery events found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fetching Details Overlay */}
      <AnimatePresence>
        {fetchingDetails && (
          <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-dark-secondary p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col items-center gap-4">
              <Loader2 size={40} className="text-gold animate-spin" />
              <p className="text-white font-bold tracking-widest text-sm uppercase">Loading Gallery...</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative max-w-6xl w-full bg-dark-secondary rounded-[2rem] overflow-hidden border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col h-[90vh]"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors border border-white/5 group active:scale-90"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform" />
              </button>

              {/* Modal Header */}
              <div className="pt-20 pb-12 px-8 md:px-16 text-center border-b border-white/5 relative">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl md:text-5xl font-black text-gold mb-4 leading-tight"
                >
                  {selectedItem.title}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gold font-bold tracking-widest uppercase text-sm mb-8"
                >
                  {selectedItem.date ? new Date(selectedItem.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' }) : 'Date TBA'}
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/80 text-lg font-light leading-relaxed max-w-4xl mx-auto text-center"
                >
                  {selectedItem.description}
                </motion.p>
              </div>

              {/* Photo Grid */}
              <div className="flex-grow overflow-y-auto p-8 md:p-16 bg-black/40">
                {selectedItem.photos && selectedItem.photos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedItem.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-lg relative group bg-black/60 flex items-center justify-center"
                      >
                        <img
                          src={photo}
                          alt={`Event ${idx}`}
                          className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 opacity-50 flex flex-col items-center justify-center">
                    <p className="text-white tracking-widest text-xs uppercase">No additional photos for this event</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Gallery;