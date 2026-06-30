import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Credentials.css";

gsap.registerPlugin(ScrollTrigger);

export function Credentials() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(".recognition-card, .cert-card, .award-item", { opacity: 1, y: 0 });
        return;
      }

      gsap.from(".credentials-block-header", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });

      ScrollTrigger.batch(".recognition-card, .cert-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 40,
            opacity: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
          });
        },
        start: "top 85%",
        once: true,
      });

      ScrollTrigger.batch(".award-item", {
        onEnter: (elements) => {
          gsap.from(elements, {
            x: -30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.out",
          });
        },
        start: "top 90%",
        once: true,
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const { thoughtLeadership } = profile;

  return (
    <section ref={sectionRef} className="credentials" id="credentials">
      <div className="container">
        {/* PDF: Thought Leadership */}
        <header className="credentials-block-header">
          <p className="section-label">{thoughtLeadership.label}</p>
          <h2 className="section-title">{thoughtLeadership.intro}</h2>
        </header>

        <div className="recognition-grid">
          {thoughtLeadership.items.map((item) => (
            <article key={item.title} className="recognition-card">
              <span className="recognition-card__icon">{item.icon}</span>
              <h3 className="recognition-card__title">{item.title}</h3>
              <p className="recognition-card__desc">{item.description}</p>
            </article>
          ))}
        </div>
        <p className="recognition-advisory">{thoughtLeadership.advisory}</p>

        {/* LinkedIn: Certifications, Awards, Education */}
        <div className="credentials-divider" />

        <header className="credentials-block-header">
          <p className="section-label">Credentials & Recognition</p>
          <h2 className="section-title">Certified. Awarded. Trusted.</h2>
        </header>

        <div className="credentials-grid">
          <div className="credentials-certs">
            <h3 className="credentials-subtitle">Certifications</h3>
            <div className="cert-grid">
              {profile.certifications.map((cert) => (
                <article key={cert.name} className="cert-card">
                  <div className="cert-card__badge">
                    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
                      <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
                      <path
                        d="M16 24l5 5 11-11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h4 className="cert-card__name">{cert.name}</h4>
                  <p className="cert-card__issuer">{cert.issuer}</p>
                  <span className="cert-card__year">{cert.year}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="credentials-side">
            <h3 className="credentials-subtitle">Awards & Honors</h3>
            <ul className="awards-list">
              {profile.awards.map((award) => (
                <li key={award.title} className="award-item">
                  <div className="award-item__icon">🏆</div>
                  <div>
                    <strong>{award.title}</strong>
                    <span>
                      {award.org} · {award.year}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="education-card">
              <p className="education-card__label">Education</p>
              <h4>{profile.education.school}</h4>
              <p>
                {profile.education.degree} · {profile.education.period}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
