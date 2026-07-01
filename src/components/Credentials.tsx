import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Credentials.css";

gsap.registerPlugin(ScrollTrigger);

function animateCards(
  scope: HTMLElement,
  selector: string,
  reducedMotion: boolean,
  fromVars: gsap.TweenVars = { y: 30, opacity: 0 }
) {
  const elements = scope.querySelectorAll(selector);
  if (!elements.length) return;

  if (reducedMotion) {
    gsap.set(elements, { opacity: 1, y: 0, x: 0 });
    return;
  }

  elements.forEach((el, i) => {
    gsap.fromTo(
      el,
      fromVars,
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.65,
        delay: (i % 2) * 0.05,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          once: true,
        },
      }
    );
  });
}

export function Credentials() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const scope = sectionRef.current;
      if (!scope) return;

      if (reducedMotion) {
        gsap.set(
          scope.querySelectorAll(
            ".credentials-block-header, .recognition-card, .recognition-advisory, .cert-card, .award-item, .education-card"
          ),
          { opacity: 1, y: 0, x: 0 }
        );
        return;
      }

      scope.querySelectorAll(".credentials-block-header").forEach((header) => {
        gsap.fromTo(
          header,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: header,
              start: "top 88%",
              once: true,
            },
          }
        );
      });

      animateCards(scope, ".recognition-card", reducedMotion);
      animateCards(scope, ".cert-card", reducedMotion);
      animateCards(scope, ".award-item", reducedMotion, { x: -20, opacity: 0 });

      gsap.fromTo(
        scope.querySelector(".recognition-advisory"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.querySelector(".recognition-advisory"),
            start: "top 92%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        scope.querySelector(".education-card"),
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.querySelector(".education-card"),
            start: "top 92%",
            once: true,
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  const { thoughtLeadership } = profile;

  return (
    <section ref={sectionRef} className="credentials" id="credentials">
      <div className="container">
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
