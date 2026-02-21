interface SectionHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  headingLevel?: "h1" | "h2";
}

export default function SectionHeader({
  overline,
  title,
  subtitle,
  headingLevel = "h2",
}: SectionHeaderProps) {
  const Heading = headingLevel;
  return (
    <header className="mb-12 md:mb-16">
      {overline && (
        <p className="mb-3 text-sm uppercase tracking-[0.1em] text-accent-purple md:mb-4">
          {overline}
        </p>
      )}
      <Heading className="text-4xl font-medium leading-tight text-text-primary md:text-6xl">
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary md:mt-6 md:text-lg">
          {subtitle}
        </p>
      )}
    </header>
  );
}
