import { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Reels from './components/Reels'
import Method from './components/Method'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import Community from './components/Community'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollTop from './components/ScrollTop'
import { useActiveSection, useReveal } from './hooks/useReveal'

const SECTION_IDS = ['home', 'about', 'reels', 'services', 'method', 'stories', 'faq', 'community', 'contact']

export default function App() {
  useReveal()
  useActiveSection(SECTION_IDS)
  const [preselectedGoal, setPreselectedGoal] = useState('')

  const chooseProgramme = (goal) => {
    setPreselectedGoal(goal)
    const contact = document.getElementById('contact')
    if (!contact) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    contact.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })

    window.setTimeout(() => {
      const select = document.getElementById('goal')
      select?.focus({ preventScroll: true })
    }, reduceMotion ? 100 : 900)
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Reels />
        <Services onChoose={chooseProgramme} />
        <Method />
        <Testimonials />
        <Faq />
        <Community />
        <Contact preselectedGoal={preselectedGoal} onGoalConsumed={() => setPreselectedGoal('')} />
      </main>
      <Footer />
      <ScrollTop />
    </>
  )
}
