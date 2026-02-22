import React from 'react';
import { BookOpen, Mail, Github, Twitter } from 'lucide-react';
import styles from './footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
   
        <div className={styles.mainContent}>
          <div className={styles.section}>
            <div className={styles.brand}>
              <BookOpen className={styles.brandIcon} />
              <h3 className={styles.brandTitle}>VocabMaster</h3>
            </div>
            <p className={styles.brandDescription}>
              Build your vocabulary with daily practice and interactive learning.
            </p>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Features</h4>
            <div className={styles.linkList}>
              <a href="#" className={styles.link}>Word Lists</a>
              <a href="#" className={styles.link}>Practice Quiz</a>
              <a href="#" className={styles.link}>Progress Tracking</a>
            </div>
          </div>

          {/* Support */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Support</h4>
            <div className={styles.linkList}>
              <a href="#" className={styles.link}>Help Center</a>
              <a href="#" className={styles.link}>Contact</a>
              <a href="#" className={styles.link}>Privacy</a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;