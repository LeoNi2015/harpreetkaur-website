import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "../data/profile";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import "./AboutStory.css";

gsap.registerPlugin(ScrollTrigger);

const sections = [
  { id: "role", data: profile.currentRole },
  { id: "background", data: profile.background },
];

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) {
        gsap.set(".story-chapter, .story-personal", { opacity: 1, y: 0 });
        return;
      }

      gsap.from(".story-header", {
        scrollTrigger: { trigger: ".story-header", start: "top 80%" },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      sections.forEach((_, i) => {
        const chapter = `.story-chapter:nth-child(${i + 1})`;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: "top 75%",
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

      gsap.from(".story-personal", {
        scrollTrigger: { trigger: ".story-personal", start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  return (
    <section ref={sectionRef} className="story">
      <div className="container">
        <header className="story-header">
          <p className="section-label">About</p>
          <h2 className="section-title">
            Enterprise Generative AI Leadership at Google Cloud
          </h2>
          <p className="section-subtitle story-header__about">
            {profile.linkedinAbout.split("\n\n")[0]}
          </p>
        </header>

        <div className="story-chapters">
          {sections.map(({ id, data }, i) => (
            <article
              key={id}
              id={id}
              className={`story-chapter ${i % 2 === 1 ? "story-chapter--reverse" : ""}`}
            >
              <div className="story-chapter__image-wrap">
                <img
                  src={data.image}
                  alt={data.label}
                  className="story-chapter__image"
                  loading="lazy"
                />
                <div className="story-chapter__year">{data.label}</div>
              </div>
              <div className="story-chapter__content">
                <h3 className="story-chapter__title">{data.intro}</h3>
                {data.paragraphs.map((para, j) => (
                  <p key={j} className="story-chapter__text">
                    {para}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="story-personal" id="personal">
          <p className="section-label">{profile.personal.label}</p>
          <p className="story-personal__text">{profile.personal.paragraph}</p>
        </div>
      </div>
    </section>
  );
}
