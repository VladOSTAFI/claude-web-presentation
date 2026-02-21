interface SlideLayoutProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export default function SlideLayout({
  children,
  className = "",
  gradient = false,
}: SlideLayoutProps) {
  return (
    <section
      className={`relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16 ${
        gradient
          ? "bg-gradient-to-b from-primary to-secondary"
          : "bg-primary"
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
