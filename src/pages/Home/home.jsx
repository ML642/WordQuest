import React, { useEffect, useRef } from "react";
import style from "./home.module.css";
// @ts-ignore
import FOG from "vanta/dist/vanta.fog.min";
import * as THREE from "three";

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
        <section className={style.hero}>
          <div className={`${style.heroContent} ${style.glowEffect}`}>
            <h1 className={style.title}>VocabMaster</h1>
            <p className={style.subtitle}>
              Enhance your English vocabulary with our smart learning system
            </p>
            <div className={style.heroCtas}>
              <button className={style.primaryBtn}>Get Started</button>
              <button className={style.secondaryBtn}>Take a Tour</button>
            </div>
          </div>
          <div className={style.heroStats}>
            <div className={style.stat}>
              <span className={style.statNumber}>30+</span>
              <span className={style.statLabel}>Topics</span>
            </div>
            <div className={style.stat}>
              <span className={style.statNumber}>5000+</span>
              <span className={style.statLabel}>Words</span>
            </div>
            <div className={style.stat}>
              <span className={style.statNumber}>15+</span>
              <span className={style.statLabel}>Daily Exercises</span>
            </div>
          </div>
        </section>

        <section className={style.features}>
          <h2 className={style.sectionTitle}>Key Features</h2>
          <div className={style.featureGrid}>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>📚</div>
              <h3>Smart Learning</h3>
              <p>Personalized word lists based on your level and progress</p>
            </div>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>🎯</div>
              <h3>Daily Practice</h3>
              <p>Short, focused sessions to build lasting vocabulary</p>
            </div>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>🔄</div>
              <h3>Spaced Repetition</h3>
              <p>Review words at optimal intervals for better retention</p>
            </div>
            <div className={style.featureCard}>
              <div className={style.featureIcon}>📊</div>
              <h3>Progress Tracking</h3>
              <p>Detailed insights into your learning journey</p>
            </div>
          </div>
        </section>

        <section className={style.howItWorks}>
          <h2 className={style.sectionTitle}>How It Works</h2>
          <div className={style.steps}>
            <div className={style.step}>
              <div className={style.stepNumber}>1</div>
              <h3>Sign Up</h3>
              <p>Create your account and take a quick placement test</p>
            </div>
            <div className={style.step}>
              <div className={style.stepNumber}>2</div>
              <h3>Learn Daily</h3>
              <p>Get 5 new words each day tailored to your level</p>
            </div>
            <div className={style.step}>
              <div className={style.stepNumber}>3</div>
              <h3>Practice</h3>
              <p>Complete exercises to reinforce your learning</p>
            </div>
            <div className={style.step}>
              <div className={style.stepNumber}>4</div>
              <h3>Track Progress</h3>
              <p>Watch your vocabulary grow over time</p>
            </div>
          </div>
        </section>

        <section className={style.benefits}>
          <h2 className={style.sectionTitle}>Learning Benefits</h2>
          <div className={style.benefitsGrid}>
            <div className={style.benefitCard}>
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
            </div>
            <div className={style.benefitCard}>
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
            </div>
            <div className={style.benefitCard}>
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
            </div>
          </div>
        </section>

        

        <section className={style.gamification}>
          <h2 className={style.sectionTitle}>Make Learning Fun</h2>
          <div className={style.achievementsShowcase}>
            <div className={style.achievement}>
              <div className={style.achievementIcon}>🏆</div>
              <h3>Word Master</h3>
              <p>Learn 500 words</p>
              <div className={style.progressBar}>
                <div className={style.progress} style={{width: '75%'}}></div>
              </div>
              <span className={style.progressText}>375/500</span>
            </div>
            <div className={style.achievement}>
              <div className={style.achievementIcon}>⚡</div>
              <h3>Speed Demon</h3>
              <p>Complete 10 quick reviews</p>
              <div className={style.progressBar}>
                <div className={style.progress} style={{width: '90%'}}></div>
              </div>
              <span className={style.progressText}>9/10</span>
            </div>
            <div className={style.achievement}>
              <div className={style.achievementIcon}>🔥</div>
              <h3>Daily Streak</h3>
              <p>Practice 7 days in a row</p>
              <div className={style.progressBar}>
                <div className={style.progress} style={{width: '85%'}}></div>
              </div>
              <span className={style.progressText}>6/7</span>
            </div>
          </div>
        </section>

        <section className={style.cta}>
          <h2>Ready to Expand Your Vocabulary?</h2>
          <p>Join thousands of learners improving their English every day</p>
          <button className={style.primaryBtn}>Start Learning Now</button>
          <p className={style.ctaNote}>No credit card required • Free plan available</p>
        </section>
      </main>
    </div>
  );
}