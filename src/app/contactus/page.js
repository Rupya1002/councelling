"use client";
import { useRouter } from 'next/navigation';
import './contactus.css';

export default function ContactUs() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <div className="contact-container">
            <h1 className="contact-title">Contact Us</h1>
            
            <div className="contact-content">
                <div className="about-section">
                    <h2>About the Project</h2>
                    <p>This JEE Counselling project is designed to help students find their dream colleges based on their JEE ranks and other qualifications. We aim to simplify the complex process of college selection for engineering aspirants.</p>
                </div>
                
                <div className="developers-section">
                    <h2>Meet Our Developers</h2>
                    
                    <div className="developers-grid">
                        <div className="developer-card">
                            <div className="developer-avatar">👨‍💻</div>
                            <h3>G Nageswara Venkata Durga Sai</h3>
                            <p className="developer-role">Lead Developer</p>                            <div className="contact-links">
                                <a href="mailto:dsainvg.20.12@gmail.com" className="contact-link">
                                    <span className="icon">✉️</span> Email
                                </a>
                            </div>
                        </div>
                        
                        <div className="developer-card">
                            <div className="developer-avatar">👩‍💻</div>
                            <h3>K Rupya Lakshmi Sai Sri</h3>
                            <p className="developer-role">UI/UX Developer</p>                            <div className="contact-links">
                                <a href="mailto:rupya13017@gmail.com" className="contact-link">
                                    <span className="icon">✉️</span> Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="feedback-section">
                    <h2>We&apos;d Love to Hear From You</h2>
                    <p>If you have any questions, suggestions, or feedback about this project, please don&apos;t hesitate to contact us.</p>
                </div>
            </div>
            
            <button onClick={handleGoBack} className="back-button">
                ← Back
            </button>
        </div>
    );
}