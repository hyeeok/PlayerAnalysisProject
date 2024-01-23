import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.container}>
            <div className="contact-info">
                <p>Phone: 010-9767-0533</p>
                <p>Email: dlgur59@gmail.com</p>
            </div>
            <p>&copy; Hyeok's Portfolio</p>
        </footer>
    );
};

export default Footer;
