import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Expertise.css";

gsap.registerPlugin(ScrollTrigger);

function animateOnScroll(
  scope: HTMLElement,
  selector: string,
  reducedMotion: boolean,
  extraFrom: gsap.TweenVars = {}
) {
  const elements = scope.querySelectorAll(selector);
  if (!elements.length) return;

  if (reducedMotion) {
    gsap.set(elements, { opacity: 1, y: 0, x: 0, scale: 1 });
    return;
  }

  elements.forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40, scale: 0.98, ...extraFrom },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        x: 0,
        duration: 0.65,
        delay: (i % 3) * 0.06,
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

export function Expertise() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const scope = sectionRef.current;
      if (!scope) return;

      if (reducedMotion) {
        gsap.set(scope.querySelectorAll(".expertise-header, .expertise-card, .skill-tag"), {
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      gsap.fromTo(
        scope.querySelector(".expertise-header"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scope.querySelector(".expertise-header"),
            start: "top 85%",
            once: true,
          },
        }
      );

      animateOnScroll(scope, ".expertise-card", reducedMotion);
      animateOnScroll(scope, ".skill-tag", reducedMotion, { scale: 0.9 });
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
