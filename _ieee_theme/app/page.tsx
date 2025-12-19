
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section" 
import { EventsSection } from "@/components/events-section"
import { ExecutiveSection } from "@/components/executive-section"
import { MembershipSection } from "@/components/membership-section"
import { ContactSection } from "@/components/contact-section"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <ExecutiveSection />
      <MembershipSection />
      <ContactSection />
    </main>
  )
}
