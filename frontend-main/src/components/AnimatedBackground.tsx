import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        const handleMouseMove = (e: MouseEvent) => {
            if (window.innerWidth >= 768) {
                setMousePosition({
                    x: e.clientX,
                    y: e.clientY,
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', checkMobile);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const numSpecks = isMobile ? 15 : 60;

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#000000]">
            {/* Sparkling golden specks/stars in background */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(numSpecks)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-gold"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            boxShadow: '0 0 15px 3px rgba(255, 215, 0, 0.6)',
                            willChange: 'transform, opacity'
                        }}
                        animate={{
                            opacity: [Math.random() * 0.2, Math.random() * 0.9 + 0.1, Math.random() * 0.2],
                            scale: [1, Math.random() * 1.5 + 1.2, 1],
                            y: [0, Math.random() * -100 - 50]
                        }}
                        transition={{
                            duration: Math.random() * 6 + 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: Math.random() * 3
                        }}
                    />
                ))}
            </div>

            {/* Dynamic Mouse Gradient Follower - Desktop Only */}
            {!isMobile && (
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-20"
                    animate={{
                        x: mousePosition.x - 300,
                        y: mousePosition.y - 300,
                    }}
                    transition={{
                        type: 'tween',
                        ease: 'easeOut',
                        duration: 1.5,
                    }}
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8) 0%, rgba(184, 150, 46, 0) 70%)',
                        willChange: 'transform'
                    }}
                />
            )}

            {/* Floating Orbs - Reduced complexity on mobile */}
            <motion.div
                animate={isMobile ? {} : {
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                    y: [0, -50, 0],
                    x: [0, 30, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut'
                }}
                className={`absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-gold/10 rounded-full ${isMobile ? 'blur-[40px] opacity-20' : 'blur-[80px]'}`}
                style={{ willChange: isMobile ? 'auto' : 'transform, opacity' }}
            />

            <motion.div
                animate={isMobile ? {} : {
                    scale: [1, 1.5, 1],
                    opacity: [0.1, 0.2, 0.1],
                    y: [0, 60, 0],
                    x: [0, -40, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1
                }}
                className={`absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-gold/10 rounded-full ${isMobile ? 'blur-[50px] opacity-20' : 'blur-[100px]'}`}
                style={{ willChange: isMobile ? 'auto' : 'transform, opacity' }}
            />

            <motion.div
                animate={isMobile ? {} : {
                    scale: [1, 1.3, 1],
                    opacity: [0.05, 0.15, 0.05],
                    rotate: [0, 90, 0]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 2
                }}
                className={`absolute top-[40%] right-[40%] w-[250px] h-[250px] bg-purple-500/10 rounded-full ${isMobile ? 'blur-[40px] opacity-10' : 'blur-[90px]'}`}
                style={{ willChange: isMobile ? 'auto' : 'transform, opacity, rotate' }}
            />

            {/* Grid Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
            ></div>

            {/* Constellation lines effect - Hidden on mobile to save performance */}
            {!isMobile && (
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                    <motion.path
                        d="M0 100 Q 250 50 500 200 T 1000 150"
                        fill="transparent"
                        stroke="rgba(255, 215, 0, 0.6)"
                        strokeWidth="1"
                        animate={{
                            d: [
                                "M0 100 Q 250 50 500 200 T 1000 150",
                                "M0 150 Q 300 100 600 250 T 1200 100",
                                "M0 100 Q 250 50 500 200 T 1000 150"
                            ]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        style={{ willChange: 'd' }}
                    />
                    <motion.path
                        d="M0 800 Q 300 600 700 800 T 1200 700"
                        fill="transparent"
                        stroke="rgba(255, 215, 0, 0.5)"
                        strokeWidth="1"
                        animate={{
                            d: [
                                "M0 800 Q 300 600 700 800 T 1500 700",
                                "M0 700 Q 400 900 800 600 T 1500 800",
                                "M0 800 Q 300 600 700 800 T 1500 700"
                            ]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        style={{ willChange: 'd' }}
                    />
                </svg>
            )}
        </div>
    );
};

export default AnimatedBackground;
