import { TopNavigation } from "./sections/TopNavigation";
import { HeroImage } from "./sections/HeroImage";
import { StatsBar } from "./sections/StatsBar";
import { TryItNow } from "./sections/TryItNow";
import { DevDocs } from "./sections/DevDocs";

export default function App() {
  return (
    <div>
      <TopNavigation />
      <HeroImage />
      <StatsBar />
      <TryItNow />
      <DevDocs />
    </div>
  )
}
