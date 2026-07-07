import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SiteAnnouncements } from "@/components/layout/site-announcements";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { DraggableBadge } from "@/components/layout/draggable-badge";
import { SiteParticlesBackground } from "@/components/layout/site-particles-background";
import { InspectGuard } from "@/components/layout/inspect-guard";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <InspectGuard />
      <SiteParticlesBackground />
      <Header />
      <SiteAnnouncements />
      <main className="relative flex-1 overflow-x-clip">{children}</main>
      <Footer />
      <DraggableBadge />
      <ScrollToTop />
    </>
  );
}
