interface KeyboardShortcutProps {
  keys: string;
}

export default function KeyboardShortcut({ keys }: KeyboardShortcutProps) {
  const keyParts = keys.split("+");

  return (
    <kbd className="inline-flex items-center gap-0.5" aria-label={keys}>
      {keyParts.map((key, index) => (
        <span key={index} className="inline-flex items-center">
          {index > 0 && (
            <span className="mx-0.5 text-text-muted" aria-hidden="true">
              +
            </span>
          )}
          <span className="inline-block rounded-md border border-border-subtle bg-secondary px-2 py-0.5 font-mono text-xs font-medium text-text-secondary shadow-[0_2px_0_rgba(255,255,255,0.1)]">
            {key.trim()}
          </span>
        </span>
      ))}
    </kbd>
  );
}
