interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <article className="group rounded-xl border border-border-subtle bg-secondary p-6 transition-all duration-300 hover:scale-[1.02] hover:border-accent-purple/30 hover:shadow-[0_0_30px_rgba(127,86,217,0.15)] md:p-8">
      {icon && (
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <h3 className="mb-2 text-lg font-medium text-text-primary md:text-xl">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-text-secondary md:text-base">
        {description}
      </p>
    </article>
  );
}
