import HomeHero from "@/components/home/HomeHero";
import HomeIntro from "@/components/home/HomeIntro";
import HomeSection, { ViewAll } from "@/components/home/HomeSection";
import Carousel from "@/components/home/Carousel";
import { AchievementItem, CredentialItem, WorkItem } from "@/components/home/HomeCards";
import AskSection from "@/components/home/AskSection";
import ScrollReveal from "@/components/home/ScrollReveal";
import cards from "@/components/home/HomeCards.module.css";
import {
  ACHIEVEMENT_ITEMS,
  ACHIEVEMENTS,
  CREDENTIAL_CARDS,
  CREDENTIALS,
  VIEW_ALL_WORK,
  WORK,
  WORK_CARDS,
} from "@/lib/home";
import type { Achievement, CredentialCard, WorkCard } from "@/lib/home";

// Home, structured like the reference: scene → intro → Credentials → Selected work →
// Achievements → Ask (the footer band comes from the shell). Content lives in lib/home.ts.
export default function Home() {
  return (
    <main id="main">
      <HomeHero />
      <HomeIntro />

      <HomeSection id="credentials" copy={CREDENTIALS} tone="pale">
        <Carousel gridClassName={cards.gridCards} label="credential" count={CREDENTIAL_CARDS.length}>
          {CREDENTIAL_CARDS.map((card: CredentialCard) => (
            <CredentialItem key={card.name} card={card} />
          ))}
        </Carousel>
      </HomeSection>

      <HomeSection
        id="selected-work"
        copy={WORK}
        tone="paper2"
        action={<ViewAll href="/projects" label={VIEW_ALL_WORK} />}
      >
        <Carousel gridClassName={cards.gridCards} label="project" count={WORK_CARDS.length}>
          {WORK_CARDS.map((card: WorkCard) => (
            <WorkItem key={card.name} card={card} />
          ))}
        </Carousel>
      </HomeSection>

      <HomeSection id="achievements" copy={ACHIEVEMENTS} tone="paper">
        <Carousel gridClassName={cards.gridAwards} label="achievement" count={ACHIEVEMENT_ITEMS.length}>
          {ACHIEVEMENT_ITEMS.map((item: Achievement) => (
            <AchievementItem key={item.name} item={item} />
          ))}
        </Carousel>
      </HomeSection>

      <AskSection />
      <ScrollReveal />
    </main>
  );
}
