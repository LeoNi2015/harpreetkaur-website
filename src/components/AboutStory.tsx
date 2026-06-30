import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./AboutStory.css";

gsap.registerPlugin(ScrollTrigger);

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(".story-chapter, .story-about", { opacity: 1, y: 0 });
        return;
      }

      gsap.from(".story-header", {
        scrollTrigger: {
          trigger: ".story-header",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".story-about", {
        scrollTrigger: {
          trigger: ".story-about",
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      profile.story.chapters.forEach((_, i) => {
        const chapter = `.story-chapter:nth-child(${i + 1})`;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top 75%",
            end: "bottom 25%",
            toggleActions: "play none none reverse",
          },
        });

        tl.from(`${chapter} .story-chapter__image`, {
          x: i % 2 === 0 ? -60 : 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        }).from(
          `${chapter} .story-chapter__content > *`,
          {
            y: 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6"
        );
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="story" id="story">
      <div className="container">
        <header className="story-header">
          <p className="section-label">My Story</p>
          <h2 className="section-title">{profile.story.intro}</h2>
        </header>

        <div className="story-about">
          {profile.about.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="story-chapters">
          {profile.story.chapters.map((chapter, i) => (
            <article
              key={chapter.year}
              className={`story-chapter ${i % 2 === 1 ? "story-chapter--reverse" : ""}`}
            >
              <div className="story-chapter__image-wrap">
                <img
                  src={chapter.image}
                  alt={chapter.title}
                  className="story-chapter__image"
                  loading="lazy"
                />
                <div className="story-chapter__year">{chapter.year}</div>
              </div>
              <div className="story-chapter__content">
                <h3 className="story-chapter__title">{chapter.title}</h3>
                <p className="story-chapter__text">{chapter.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
