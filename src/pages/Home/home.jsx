import React, { useEffect, useRef, useState } from "react";
import style from "./home.module.css";
// @ts-ignore
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";
import TiltCard from "../../components/tiltCard.jsx";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const vantaRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (vantaEffectRef.current && typeof vantaEffectRef.current.resize === "function") {
        vantaEffectRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    if (!vantaEffectRef.current && vantaRef.current) {

        window.THREE = THREE;
    vantaEffectRef.current = FOG({
        el: vantaRef.current,
        THREE: THREE,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        highlightColor: 0x4c7395,
        midtoneColor: 0x12256f,
        lowlightColor: 0x564f84,
        baseColor: 0x514663,
        blurFactor: 0.66,
        speed: 5.10

      });
      // ensure the Vanta canvas covers the full viewport and sits behind UI
      try {
        const inst = vantaEffectRef.current;
        const canvas = inst && inst.renderer && inst.renderer.domElement;
        if (canvas) {
          canvas.style.position = 'fixed';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.pointerEvents = 'none';
          canvas.style.zIndex = '0';
        }
        if (vantaRef.current) {
          vantaRef.current.style.position = 'fixed';
          vantaRef.current.style.top = '0';
          vantaRef.current.style.left = '0';
          vantaRef.current.style.width = '100%';
          vantaRef.current.style.height = '100%';
        }
      } catch (e) {
        console.warn('Could not force Vanta canvas fullscreen', e);
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      try {
        console.debug("Vanta cleanup, current:", vantaEffectRef.current);
      } catch (e) {}
      if (vantaEffectRef.current && typeof vantaEffectRef.current.destroy === "function") {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <div  className={style.pageWrapper}  ref={vantaRef}>
      <main className={style.container}  >
        <motion.section 
          className={style.hero}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className={`${style.heroContent} ${style.glowEffect}`}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.h1 
              className={style.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              VocabMaster
            </motion.h1>
            <motion.p 
              className={style.subtitle}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Enhance your English vocabulary with our smart learning system
            </motion.p>
            <motion.div 
              className={style.heroCtas}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <motion.button 
                className={style.primaryBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
              <motion.button 
                className={style.secondaryBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Take a Tour
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div 
            className={style.heroStats}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <motion.div 
              className={style.stat}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className={style.statNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                30+
              </motion.span>
              <motion.span 
                className={style.statLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                Topics
              </motion.span>
            </motion.div>
            <motion.div 
              className={style.stat}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className={style.statNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                5000+
              </motion.span>
              <motion.span 
                className={style.statLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                Words
              </motion.span>
            </motion.div>
            <motion.div 
              className={style.stat}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span 
                className={style.statNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              >
                15+
              </motion.span>
              <motion.span 
                className={style.statLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
              >
                Daily Exercises
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section 
          className={style.features}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className={style.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Key Features
          </motion.h2>
          <motion.div 
            className={style.featureGrid}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: "📚",
                title: "Smart Learning",
                description: "Personalized word lists based on your level and progress"
              },
              {
                icon: "🎯",
                title: "Daily Practice",
                description: "Short, focused sessions to build lasting vocabulary"
              },
              {
                icon: "🔄",
                title: "Spaced Repetition",
                description: "Review words at optimal intervals for better retention"
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                description: "Detailed insights into your learning journey"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                custom={index}
                transition={{ duration: 0.5 }}
              >
                <TiltCard className={style.featureCard}>
                  <motion.div 
                    className={style.featureIcon}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section 
          className={style.howItWorks}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className={style.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <motion.div 
            className={style.steps}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                number: 1,
                title: "Sign Up",
                description: "Create your account and take a quick placement test"
              },
              {
                number: 2,
                title: "Learn Daily",
                description: "Get 5 new words each day tailored to your level"
              },
              {
                number: 3,
                title: "Practice",
                description: "Complete exercises to reinforce your learning"
              },
              {
                number: 4,
                title: "Track Progress",
                description: "Watch your vocabulary grow over time"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className={style.step}
                variants={fadeInUp}
                custom={index}
                whileHover={{ scale: 1.05 }}
                transition={{
                  duration: 0.5,
                  scale: { type: "spring", stiffness: 300 }
                }}
              >
                <motion.div 
                  className={style.stepNumber}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index, type: "spring", stiffness: 200 }}
                >
                  {step.number}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 * index }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 * index }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <section className={style.benefits}>
          <h2 className={style.sectionTitle}>Learning Benefits</h2>
          <div className={style.benefitsGrid}>
            <TiltCard className={style.benefitCard}>
              <div className={style.benefitIcon}>🎓</div>
              <div className={style.benefitContent}>
                <h3>Academic Success</h3>
                <p>Improve your reading comprehension and writing skills for better academic performance</p>
                <ul className={style.benefitList}>
                  <li>Enhanced reading speed</li>
                  <li>Better comprehension</li>
                  <li>Improved writing clarity</li>
                </ul>
              </div>
            </TiltCard>
            <TiltCard className={style.benefitCard}>
              <div className={style.benefitIcon}>💼</div>
              <div className={style.benefitContent}>
                <h3>Professional Growth</h3>
                <p>Stand out in your career with sophisticated communication skills</p>
                <ul className={style.benefitList}>
                  <li>Better presentations</li>
                  <li>Clear emails</li>
                  <li>Professional reports</li>
                </ul>
              </div>
            </TiltCard>
            <TiltCard className={style.benefitCard}>
              <div className={style.benefitIcon}>🌍</div>
              <div className={style.benefitContent}>
                <h3>Global Communication</h3>
                <p>Connect with people worldwide more effectively</p>
                <ul className={style.benefitList}>
                  <li>Cultural understanding</li>
                  <li>Confident speaking</li>
                  <li>International networking</li>
                </ul>
              </div>
            </TiltCard>
          </div>
        </section>

        

        <section className={style.gamification}>
          <h2 className={style.sectionTitle}>Make Learning Fun</h2>
          <div className={style.achievementsShowcase}>
            <TiltCard className={style.achievement}>
              <div className={style.achievementIcon}>🏆</div>
              <h3>Word Master</h3>
              <p>Learn 500 words</p>
              <div className={style.progressBar}>
                <div className={style.progress} style={{width: '75%'}}></div>
              </div>
              <span className={style.progressText}>375/500</span>
            </TiltCard>
            <TiltCard className={style.achievement}>
              <div className={style.achievementIcon}>⚡</div>
              <h3>Speed Demon</h3>
              <p>Complete 10 quick reviews</p>
              <div className={style.progressBar}>
                <div className={style.progress} style={{width: '90%'}}></div>
              </div>
              <span className={style.progressText}>9/10</span>
            </TiltCard>
            <TiltCard className={style.achievement}>
              <div className={style.achievementIcon}>🔥</div>
              <h3>Daily Streak</h3>
              <p>Practice 7 days in a row</p>
              <div className={style.progressBar}>
                <div className={style.progress} style={{width: '85%'}}></div>
              </div>
              <span className={style.progressText}>6/7</span>
            </TiltCard>
          </div>
        </section>

        <motion.section 
          className={style.cta}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Ready to Expand Your Vocabulary?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Join thousands of learners improving their English every day
          </motion.p>
          <motion.button 
            className={style.primaryBtn}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
          >
            Start Learning Now
          </motion.button>
          <motion.p 
            className={style.ctaNote}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            No credit card required • Free plan available
          </motion.p>
        </motion.section>
      </main>
    </div>
  );
}