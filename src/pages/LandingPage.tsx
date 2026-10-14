import { HeroImage } from '../sections/HeroImage'
import { TryItNow } from '../sections/TryItNow'
import { DevDocs } from '../sections/DevDocs'
import { WhyResolvio } from '../sections/WhyResolvio'
import { Capabilities } from '../sections/Capabilities'
import { CallToAction } from '../sections/CallToAction'
import { FAQ } from '../sections/FAQ'

export function LandingPage() {
  return (
    <main id="main-content">
      <HeroImage />
      <TryItNow />
      <WhyResolvio />
      <Capabilities />
      <DevDocs />
      <FAQ />
      <CallToAction />
    </main>
  )
}
