import type { ContentResponse } from "@/lib/api";
import { resolveMediaUrl } from "@/lib/media";
import { getSeoLabel, getSeoSettings } from "@/lib/seo";

export function SeoDocument({ content }: { content: ContentResponse }) {
  const { cv } = content;
  const { personal } = cv;
  const logoUrl = resolveMediaUrl(personal.avatar);

  return (
    <article className="sr-only" aria-label="Portfolio full content">
      <header id="seo-hero">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${personal.name} logo`}
            width={512}
            height={512}
            loading="eager"
            fetchPriority="high"
          />
        )}
        <h1>{personal.name}</h1>
        <p>{personal.title}</p>
        <p>{personal.bio}</p>
        <address>
          <span>{personal.email}</span>
          <span>{personal.phone}</span>
          <span>{personal.location}</span>
        </address>
        {personal.social.length > 0 && (
          <ul>
            {personal.social.map((link) => (
              <li key={link.platform}>
                <a href={link.url}>{link.platform}</a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <section id="seo-about" aria-labelledby="seo-about-title">
        <h2 id="seo-about-title">{getSeoLabel(content, "about.title")}</h2>
        <p>{personal.bio}</p>
        {(personal.aboutDetails ?? []).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        {(personal.highlights ?? []).map((item) => (
          <p key={item.label}>
            <strong>{item.label}:</strong> {item.value}
          </p>
        ))}
        {(personal.interests ?? []).length > 0 && (
          <p>{personal.interests?.join(", ")}</p>
        )}
      </section>

      <section id="seo-experience" aria-labelledby="seo-experience-title">
        <h2 id="seo-experience-title">
          {getSeoLabel(content, "experience.title")}
        </h2>
        {cv.experiences.map((exp) => (
          <article key={exp.id}>
            <h3>
              {exp.role} — {exp.company}
            </h3>
            <time>{exp.period}</time>
            <p>{exp.description}</p>
            <p>{exp.technologies.join(", ")}</p>
          </article>
        ))}
      </section>

      <section id="seo-skills" aria-labelledby="seo-skills-title">
        <h2 id="seo-skills-title">{getSeoLabel(content, "skills.title")}</h2>
        {cv.skills.map((skill) => (
          <p key={skill.id}>
            {skill.name} ({skill.category}) — {skill.level}%
          </p>
        ))}
      </section>

      <section id="seo-projects" aria-labelledby="seo-projects-title">
        <h2 id="seo-projects-title">
          {getSeoLabel(content, "projects.title")}
        </h2>
        {cv.projects.map((project) => (
          <article key={project.id}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {project.content && <div>{project.description}</div>}
            <p>{project.technologies.join(", ")}</p>
            {project.liveUrl && <a href={project.liveUrl}>Live</a>}
            {project.repoUrl && <a href={project.repoUrl}>Code</a>}
            {project.likes != null && <p>Likes: {project.likes}</p>}
            {project.views != null && <p>Views: {project.views}</p>}
          </article>
        ))}
      </section>

      <section id="seo-contact" aria-labelledby="seo-contact-title">
        <h2 id="seo-contact-title">{getSeoLabel(content, "contact.title")}</h2>
        <p>
          {getSeoLabel(content, "contact.email")}: {personal.email}
        </p>
        <p>
          {getSeoLabel(content, "contact.phone")}: {personal.phone}
        </p>
      </section>

      {getSeoSettings(content).hiddenContent.trim() && (
        <section id="seo-extra" aria-labelledby="seo-extra-title">
          <h2 id="seo-extra-title">SEO</h2>
          {getSeoSettings(content).hiddenContent
            .split(/\n{2,}|\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          {getSeoSettings(content).keywords.trim() && (
            <p>{getSeoSettings(content).keywords}</p>
          )}
        </section>
      )}
    </article>
  );
}
