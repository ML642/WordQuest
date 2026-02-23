import React, { useEffect, useRef } from "react";
import style from "./home.module.css";
// @ts-ignore
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";
import TiltCard from "../../components/tiltCard.jsx";
import { motion } from "framer-motion";

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
    <div className={style.pageWrapper}>
      <div className={style.vantaLayer} ref={vantaRef} />
      <main className={style.container}>
        <motion.section 
          className={style.hero}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.25 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className={style.heroContent}
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
              Build confident English with{" "}
              <span className={style.titleAccent}>VocabMaster</span>
            </motion.h1>
            <motion.p 
              className={style.subtitle}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Enhance your English vocabulary with our{" "}
              <span className={style.textHighlight}>smart learning system</span>{" "}
              and <span className={style.textHighlightSoft}>daily practice flow</span>.
            </motion.p>
            <motion.p
              className={style.subtitleLead}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.68, duration: 0.65 }}
            >
              Start with practical words you can use immediately in conversations,
              school, and professional writing.
            </motion.p>
            <motion.div
              className={style.heroHighlights}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.72, duration: 0.6 }}
            >
              <span className={style.highlightPill}>Context-first learning</span>
              <span className={style.highlightPill}>Quick daily sessions</span>
              <span className={style.highlightPill}>Visible progress</span>
            </motion.div>
            <motion.div
              className={style.heroSignalRow}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.78, duration: 0.6 }}
            >
              <div className={style.heroSignal}>
                <span className={style.heroSignalTitle}>Word of the Day</span>
                <span className={style.heroSignalMeta}>Usage + quick memory tip</span>
              </div>
              <div className={style.heroSignal}>
                <span className={style.heroSignalTitle}>3 Smart Quizzes</span>
                <span className={style.heroSignalMeta}>Built from your weak spots</span>
              </div>
              <div className={style.heroSignal}>
                <span className={style.heroSignalTitle}>Weekly Milestone</span>
                <span className={style.heroSignalMeta}>Track growth in minutes</span>
              </div>
            </motion.div>
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
            <p className={style.statsFootnote}>Built to keep your learning streak consistent.</p>
          </motion.div>
        </motion.section>

        <motion.section 
          className={style.features}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
        </motion.section>

        <motion.section 
          className={style.howItWorks}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className={style.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            How It Works
          </motion.h2>
          <motion.div 
            className={style.steps}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: false, amount: 0.2 }}
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
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ delay: 0.2 * index, type: "spring", stiffness: 200 }}
                >
                  {step.number}
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ delay: 0.3 * index }}
                >
                  {step.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ delay: 0.4 * index }}
                >
                  {step.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className={style.benefits}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
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
        </motion.section>

        

        <motion.section
          className={style.gamification}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
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
        </motion.section>

        <motion.section 
          className={style.cta}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className={style.ctaGrid}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.35 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <motion.div
              className={style.ctaMessage}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ delay: 0.18, duration: 0.6 }}
            >
              <motion.span
                className={style.ctaEyebrow}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.2 }}
              >
                5-minute daily sprint
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.28 }}
              >
                Build useful vocabulary,
                <span className={style.ctaAccent}> then use it the same day.</span>
              </motion.h2>
              <motion.p
                className={style.ctaLead}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.36 }}
              >
                Every session is short and practical: new words in context, a quick
                challenge, and a focused review from yesterday&apos;s mistakes.
              </motion.p>
              <motion.div
                className={style.ctaActions}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.48 }}
              >
                <motion.button 
                  className={`${style.primaryBtn} ${style.ctaPrimaryBtn}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Start learning now
                </motion.button>
                <motion.button
                  className={style.ctaGhostBtn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  See sample lesson
                </motion.button>
              </motion.div>
              <motion.div
                className={style.ctaTrustRow}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.56 }}
              >
               
              </motion.div>
            </motion.div>

            <motion.aside
              className={style.ctaPlanCard}
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ delay: 0.24, duration: 0.6 }}
            >
              <p className={style.ctaPlanLabel}>Today&apos;s plan</p>
              <ul className={style.ctaPlanList}>
                <li className={style.ctaPlanItem}>
                  <span className={style.ctaPlanTime}>01:30</span>
                  <div className={style.ctaPlanCopy}>
                    <h3>Context Drill</h3>
                    <p>Learn words inside a mini conversation.</p>
                  </div>
                </li>
                <li className={style.ctaPlanItem}>
                  <span className={style.ctaPlanTime}>02:00</span>
                  <div className={style.ctaPlanCopy}>
                    <h3>Quick Challenge</h3>
                    <p>Pick the right word for real sentence prompts.</p>
                  </div>
                </li>
                <li className={style.ctaPlanItem}>
                  <span className={style.ctaPlanTime}>01:30</span>
                  <div className={style.ctaPlanCopy}>
                    <h3>Memory Review</h3>
                    <p>Lock in today&apos;s words with one short recall round.</p>
                  </div>
                </li>
              </ul>
              <motion.p 
                className={style.ctaNote}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ delay: 0.64 }}
              >
         
              </motion.p>
            </motion.aside>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}

