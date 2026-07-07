export {
  HeroSkeleton,
  AboutSkeleton,
  ExperienceSkeleton,
  SkillsSkeleton,
  ProjectsSkeleton,
  ContactSkeleton,
} from "./sections";

import {
  HeroSkeleton,
  AboutSkeleton,
  ExperienceSkeleton,
  SkillsSkeleton,
  ProjectsSkeleton,
  ContactSkeleton,
} from "./sections";

export function PageSkeleton() {
  return (
    <div className="animate-in fade-in duration-300">
      <HeroSkeleton />
      <AboutSkeleton />
      <ExperienceSkeleton />
      <SkillsSkeleton />
      <ProjectsSkeleton />
      <ContactSkeleton />
    </div>
  );
}
