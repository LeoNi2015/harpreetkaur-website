import { Navbar } from "./components/Navbar";
import { ParticleField } from "./components/ParticleField";
import { Hero } from "./components/Hero";
import { AboutStory } from "./components/AboutStory";
import { CareerJourney } from "./components/CareerJourney";
import { Expertise } from "./components/Expertise";
import { Credentials } from "./components/Credentials";
import { Contact, Footer } from "./components/Contact";

function App() {
  return (
    <>
      <ParticleField />
      <Navbar />
      <main>
        <Hero />
        <AboutStory />
        <CareerJourney />
        <Expertise />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
