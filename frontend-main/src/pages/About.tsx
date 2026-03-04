import { motion } from 'framer-motion';
import { Eye, Heart, Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import GlassCard from '../components/GlassCard';
import PageTransition from '../components/PageTransition';

const About = () => {
  const [content, setContent] = useState<any>({
    heroPrefix: "About",
    heroHighlight: "Us",
    heroSubtitle: "Quiz Club CIT is a vibrant community dedicated to promoting intellectual growth, fostering curiosity, and building champions through the art of quizzing.",
    aboutImage: "",
    missionHeading: "Our Mission",
    mission: "To create an environment where students can explore diverse topics, enhance their general knowledge, and develop critical thinking skills through engaging quizzes and competitions. We strive to build a platform that celebrates learning and intellectual excellence.",
    visionHeading: "Our Vision",
    vision: "To become the leading quiz club in the region, recognized for nurturing intellectual curiosity and producing champions who excel not just in quizzing, but in all aspects of life. We envision a community where knowledge is celebrated and shared freely.",
    valuesHeading: "Our Values",
    values: [
      { icon: 'Heart', title: 'Passion for Learning', description: 'We believe in the joy of discovery and the thrill of learning something new every day.' },
      { icon: 'Zap', title: 'Excellence', description: 'We strive for excellence in everything we do, from organizing events to competing.' },
      { icon: 'Target', title: 'Integrity', description: 'We maintain the highest standards of fairness, honesty, and sportsmanship.' }
    ],
    storyHeading: "Our Story",
    story: [
      "Founded in 2015, Quiz Club CIT started as a small group of passionate students who shared a common love for knowledge and quizzing. What began as informal quiz sessions in classrooms has now grown into one of the most active and recognized clubs in the institution.",
      "Over the years, we've organized numerous inter-collegiate competitions, hosted renowned quizmasters, and participated in national-level tournaments. Our members have consistently brought laurels to the institution through their outstanding performances.",
      "Today, Quiz Club CIT stands as a testament to what dedication, teamwork, and a passion for learning can achieve. We continue to grow, innovate, and inspire the next generation of quizzers."
    ]
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/page-content/about`);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
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
              {content.heroPrefix || "About"} <span className="text-gold">{content.heroHighlight || "Us"}</span>
            </h1>
            <p className="text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              {content.heroSubtitle}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          >
            <motion.div variants={itemVariants}>
              <GlassCard>
                <Target className="text-gold mb-4" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4">{content.missionHeading || "Our Mission"}</h3>
                <p className="text-gray-100 leading-relaxed">
                  {content.mission}
                </p>
              </GlassCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <GlassCard>
                <Eye className="text-gold mb-4" size={48} />
                <h3 className="text-2xl font-bold text-white mb-4">{content.visionHeading || "Our Vision"}</h3>
                <p className="text-gray-100 leading-relaxed">
                  {content.vision}
                </p>
              </GlassCard>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-white text-center mb-12">
              {content.valuesHeading ? content.valuesHeading.split(' ')[0] : "Our"} <span className="text-gold">{content.valuesHeading ? content.valuesHeading.split(' ').slice(1).join(' ') : "Values"}</span>
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {(content.values || []).map((value: any, index: number) => {
                const IconComp = value.icon === 'Zap' ? Zap : value.icon === 'Target' ? Target : Heart;
                return (
                  <motion.div key={index} variants={itemVariants}>
                    <GlassCard className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                          <IconComp size={32} className="text-dark-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                      <p className="text-gray-200">{value.description}</p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard>
              <h2 className="text-3xl font-bold text-white mb-6">{content.storyHeading || "Our Story"}</h2>
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {content.aboutImage && (
                  <img src={content.aboutImage} alt="About Us" className="w-full md:w-1/3 rounded-xl object-cover shadow-lg border border-white/10" />
                )}
                <div className="space-y-4 text-gray-100 leading-relaxed md:w-2/3">
                  {(content.story || []).map((para: string, idx: number) => <p key={idx}>{para}</p>)}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;