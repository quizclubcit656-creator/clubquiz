import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
    id: number;
    image: string;
    label?: string;
    title: string;
    subtitle?: string;
    description: string;
    buttonText?: string;
    buttonLink?: string;
    order: number;
}

interface MiddleBannerProps {
    slides?: Slide[];
}

const MiddleBanner = ({ slides: initialSlides }: MiddleBannerProps) => {
    const [slides, setSlides] = useState<Slide[]>(initialSlides || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(!initialSlides);

    useEffect(() => {
        if (initialSlides) {
            setSlides([...initialSlides].sort((a, b) => a.order - b.order));
            return;
        }

        const fetchSlides = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/banner`);
                const data = await res.json();
                const sortedData = data.sort((a: Slide, b: Slide) => a.order - b.order);
                setSlides(sortedData);
            } catch (err) {
                console.error("Error fetching banner slides:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, [initialSlides]);

    // Auto-slide effect
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000); // 5 seconds per slide
        return () => clearInterval(timer);
    }, [currentIndex, slides.length]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    if (loading) {
        return (
            <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-dark-primary animate-pulse flex items-center">
                <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                    <div className="max-w-xl space-y-4">
                        <div className="h-4 bg-gray-800 rounded w-1/4"></div>
                        <div className="h-12 bg-gray-800 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-800 rounded w-1/2"></div>
                        <div className="h-24 bg-gray-800 rounded w-full"></div>
                        <div className="h-12 bg-gray-800 rounded w-1/3"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (!slides || slides.length === 0) return null;

    return (
        <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-dark-primary group flex items-center">
            <AnimatePresence>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-[#050505]/60 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center md:justify-start">
                        <div className="max-w-xl text-center md:text-left pt-8">
                            {slides[currentIndex].label && (
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-gold text-xs md:text-sm uppercase tracking-[0.2em] font-medium mb-3"
                                >
                                    {slides[currentIndex].label}
                                </motion.p>
                            )}

                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight"
                            >
                                {slides[currentIndex].title}
                            </motion.h2>

                            {slides[currentIndex].subtitle && (
                                <motion.h3
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-xl md:text-2xl text-white font-medium mb-4"
                                >
                                    {slides[currentIndex].subtitle}
                                </motion.h3>
                            )}

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-gray-100 text-base md:text-lg mb-6 leading-relaxed font-light"
                            >
                                {slides[currentIndex].description}
                            </motion.p>

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="w-24 h-[1px] bg-gold mb-8 mx-auto md:mx-0 origin-left"
                            />

                            {slides[currentIndex].buttonText && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <Link
                                        to={slides[currentIndex].buttonLink || '#'}
                                        className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-gold to-gold-dark text-dark-primary font-bold text-lg rounded-md hover:shadow-[0_0_15px_rgba(245,179,1,0.5)] transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <span>{slides[currentIndex].buttonText}</span>
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            {slides.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 text-white border border-white/20 hover:bg-gold hover:text-dark-primary hover:border-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 focus:outline-none"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={handleNext}
                        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-black/40 text-white border border-white/20 hover:bg-gold hover:text-dark-primary hover:border-transparent transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 focus:outline-none"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${index === currentIndex
                                    ? 'bg-gold w-8'
                                    : 'bg-white/50 w-2.5 hover:bg-white/80'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default MiddleBanner;
