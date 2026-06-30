import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(
          ".hero-line, .hero-sub, .hero-cta, .hero-stat, .hero-portrait, .hero-glow",
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-glow", { scale: 0.5, opacity: 0, duration: 1.5 })
        .from(
          ".hero-line",
          { y: 80, opacity: 0, duration: 1, stagger: 0.15 },
          "-=1"
        )
        .from(".hero-sub", { y: 30, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-stat",
          { y: 40, opacity: 0, duration: 0.7, stagger: 0.1 },
          "-=0.3"
        )
        .from(
          ".hero-portrait",
          { scale: 0.9, opacity: 0, duration: 1.2, ease: "power2.out" },
          "-=1.2"
        );

      gsap.to(".hero-portrait__ring", {
        rotation: 360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".hero-scroll-indicator", {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="hero" id="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero__grid container">
        <div className="hero__content">
          <p className="hero-eyebrow section-label">Staff Technical Solutions Consultant · Google</p>
          <h1 className="hero-title">
            <span className="hero-line">Harpreet</span>
            <span className="hero-line hero-line--accent">Kaur</span>
          </h1>
          <p className="hero-sub">{profile.tagline}</p>
          <p className="hero-headline">{profile.headline}</p>
          <div className="hero-cta">
            <a href="#story" className="btn btn--primary">
              Explore My Story
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost"
            >
              LinkedIn Profile
            </a>
          </div>
          <div className="hero-stats">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <span className="hero-stat__value">{stat.value}</span>
                <span className="hero-stat__label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero-portrait">
            <div className="hero-portrait__ring" aria-hidden="true" />
            <div className="hero-portrait__frame">
              <img
                src="/harpreet-kaur.png"
                alt="Harpreet Kaur — Technology Leader"
                className="hero-portrait__img"
              />
              <div className="hero-portrait__overlay" />
            </div>
            <div className="hero-portrait__badge">
              <span className="hero-portrait__badge-icon">☁️</span>
              <div>
                <strong>GCP Certified</strong>
                <span>Professional Cloud Architect</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#story" className="hero-scroll-indicator" aria-label="Scroll to story">
        <span>Scroll</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M10 4v12M10 16l-4-4M10 16l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </section>
  );
}
