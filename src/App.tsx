import { TopNavigation } from "./sections/TopNavigation";
import { HeroImage } from "./sections/HeroImage";
import { StatsBar } from "./sections/StatsBar";
import { TryItNow } from "./sections/TryItNow";

export default function App() {
  return (
    <div>
      <TopNavigation />
      <HeroImage />
      <StatsBar />
      <TryItNow />
    </div>
  )
}
