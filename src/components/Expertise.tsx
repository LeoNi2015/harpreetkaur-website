import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Expertise.css";

gsap.registerPlugin(ScrollTrigger);

export function Expertise() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(".expertise-card, .skill-tag", { opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.from(".expertise-header", {
        scrollTrigger: { trigger: ".expertise-header", start: "top 80%" },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      ScrollTrigger.batch(".expertise-card", {
        onEnter: (elements) => {
          gsap.from(elements, {
            y: 50,
            opacity: 0,
            scale: 0.95,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          });
        },
        start: "top 85%",
        once: true,
      });

      ScrollTrigger.batch(".skill-tag", {
        onEnter: (elements) => {
          gsap.from(elements, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.04,
            ease: "back.out(1.7)",
          });
        },
        start: "top 90%",
        once: true,
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="expertise" id="expertise">
      <div className="container">
        <header className="expertise-header">
          <p className="section-label">Expertise</p>
          <h2 className="section-title">Applied Generative AI at Enterprise Scale</h2>
          <p className="section-subtitle">
            From GECX solution delivery to legacy-to-cloud integration — secure, scalable, and outcome-driven.
          </p>
        </header>

        <div className="expertise-grid">
          {profile.expertise.map((item) => (
            <article key={item.title} className="expertise-card">
              <span className="expertise-card__icon">{item.icon}</span>
              <h3 className="expertise-card__title">{item.title}</h3>
              <p className="expertise-card__desc">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="skills-cloud">
          <p className="skills-cloud__label">Focus Areas</p>
          <div className="skills-cloud__tags">
            {profile.skills.map((skill) => (
              <span key={skill} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
