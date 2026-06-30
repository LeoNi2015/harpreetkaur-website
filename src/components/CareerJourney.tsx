import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./CareerJourney.css";

gsap.registerPlugin(ScrollTrigger);

export function CareerJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(".journey-item", { opacity: 1, x: 0 });
        return;
      }

      gsap.from(".journey-header", {
        scrollTrigger: {
          trigger: ".journey-header",
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getScrollDistance = () => track.scrollWidth - window.innerWidth + 200;

      const horizontalTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.from(".journey-item", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "+=400",
          scrub: 1,
          containerAnimation: horizontalTween,
        },
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="journey" id="journey">
      <div className="journey-header container">
        <p className="section-label">Career Journey</p>
        <h2 className="section-title">Sixteen Years of Impact</h2>
        <p className="section-subtitle">
          From software engineering foundations to leading enterprise AI transformation at Google.
        </p>
      </div>

      <div className="journey-track-wrap">
        <div ref={trackRef} className="journey-track">
          {profile.experience.map((job, i) => (
            <article key={`${job.company}-${job.period}-${i}`} className="journey-item">
              <div
                className="journey-item__logo"
                style={{ borderColor: job.color, color: job.color }}
              >
                {job.logo}
              </div>
              <div className="journey-item__line" aria-hidden="true" />
              <div className="journey-item__card">
                <span className="journey-item__period">{job.period}</span>
                <h3 className="journey-item__role">{job.role}</h3>
                <p className="journey-item__company">{job.company}</p>
                <p className="journey-item__highlight">{job.highlight}</p>
              </div>
            </article>
          ))}
          <div className="journey-end">
            <span>2008</span>
            <p>The Beginning</p>
          </div>
        </div>
      </div>
    </section>
  );
}
