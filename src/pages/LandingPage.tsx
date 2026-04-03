import { useEffect } from 'react'
import { HeroImage } from '../sections/HeroImage'
import { StatsBar } from '../sections/StatsBar'
import { TryItNow } from '../sections/TryItNow'
import { DevDocs } from '../sections/DevDocs'
import { WhyResolvio } from '../sections/WhyResolvio'
import { Capabilities } from '../sections/Capabilities'
import { FAQ } from '../sections/FAQ'
import { CallToAction } from '../sections/CallToAction'

export function LandingPage() {
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      <HeroImage />
      <StatsBar />
      <TryItNow />
      <DevDocs />
      <WhyResolvio />
      <Capabilities />
      <FAQ />
      <CallToAction />
    </>
  )
}
