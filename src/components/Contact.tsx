import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(".contact-content > *", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      tl.from(".contact-label", { y: 30, opacity: 0, duration: 0.7 })
        .from(".contact-title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4")
        .from(".contact-text", { y: 30, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".contact-links a", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.3");
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="contact" id="contact">
      <div className="contact__glow" aria-hidden="true" />
      <div className="container contact-content">
        <p className="contact-label section-label">Get in Touch</p>
        <h2 className="contact-title section-title">
          Let&apos;s Build Something
          <br />
          <em>Transformational</em>
        </h2>
        <p className="contact-text">
          Open to conversations about enterprise AI strategy, cloud architecture,
          and technology leadership. Based in {profile.location}.
        </p>
        <div className="contact-links">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link contact-link--primary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Connect on LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="contact-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
            Send an Email
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="footer__tagline">
          {profile.title} at {profile.company}
        </p>
      </div>
    </footer>
  );
}
