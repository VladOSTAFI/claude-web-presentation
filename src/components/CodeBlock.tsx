interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

function highlightSyntax(code: string, language?: string): string {
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Comments: # ... only for bash/shell/python; // ... for other languages
  if (language === "bash" || language === "shell" || language === "python") {
    html = html.replace(
      /(#.*$)/gm,
      '<span style="color:#666666;font-style:italic">$1</span>'
    );
  }
  html = html.replace(
    /(\/\/.*$)/gm,
    '<span style="color:#666666;font-style:italic">$1</span>'
  );

  // Multi-line comments: /* ... */
  html = html.replace(
    /(\/\*[\s\S]*?\*\/)/g,
    '<span style="color:#666666;font-style:italic">$1</span>'
  );

  // Strings: double-quoted and single-quoted
  html = html.replace(
    /(?<!<span[^>]*>.*?)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)(?![^<]*<\/span>)/g,
    '<span style="color:#98C379">$1</span>'
  );

  // Keywords
  const keywords =
    language === "python"
      ? "\\b(def|class|import|from|return|if|elif|else|for|while|try|except|finally|with|as|yield|async|await|pass|break|continue|and|or|not|in|is|None|True|False|self|lambda|raise|global|nonlocal)\\b"
      : "\\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|implements|interface|type|import|export|from|default|new|this|super|try|catch|finally|throw|async|await|yield|typeof|instanceof|void|null|undefined|true|false|enum|abstract|static|public|private|protected|readonly)\\b";

  html = html.replace(
    new RegExp(`(?<!<span[^>]*>.*?)${keywords}(?![^<]*<\\/span>)`, "g"),
    '<span style="color:#C678DD">$1</span>'
  );

  // Numbers
  html = html.replace(
    /(?<!<span[^>]*>.*?)\b(\d+\.?\d*)\b(?![^<]*<\/span>)/g,
    '<span style="color:#D19A66">$1</span>'
  );

  // Function calls
  html = html.replace(
    /(?<!<span[^>]*>.*?)(\w+)(?=\s*\()(?![^<]*<\/span>)/g,
    '<span style="color:#61AFEF">$1</span>'
  );

  return html;
}

export default function CodeBlock({
  code,
  language = "typescript",
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  const lines = code.split("\n");
  const highlightedCode = highlightSyntax(code, language);

  return (
    <div
      className="overflow-hidden rounded-xl border border-border-subtle"
      role="region"
      aria-label={title ? `Code block: ${title}` : "Code block"}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between bg-secondary px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#FF5F56]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#FFBD2E]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#27C93F]" aria-hidden="true" />
        </div>
        <div className="flex items-center gap-3">
          {title && (
            <span className="text-xs text-text-secondary">{title}</span>
          )}
          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-text-muted">
            {language}
          </span>
        </div>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto bg-secondary/80 p-4 md:p-6">
        <pre className="font-mono text-sm leading-relaxed md:text-base">
          {showLineNumbers ? (
            <table className="w-full border-collapse" role="presentation">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td
                      className="select-none pr-4 text-right align-top text-text-muted/50"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </td>
                    <td>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: highlightSyntax(line, language),
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          )}
        </pre>
      </div>
    </div>
  );
}
