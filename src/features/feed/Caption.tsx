/**
 * A post caption with its hashtags and mentions picked out.
 *
 * Purely presentational: the tags are coloured, not linked. A hashtag that
 * looks like a link but goes nowhere would be one more dead control in the
 * keyboard path, and this feed already promises not to have those.
 */
export function Caption({ text }: { text: string }) {
  return (
    <>
      {splitTags(text).map((part, index) =>
        part.tag ? (
          <span key={index} className="text-accent-ink">
            {part.text}
          </span>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}

type Part = { text: string; tag: boolean };

/**
 * Splits on `#tag` and `@handle`. Kept deliberately narrow - letters, digits,
 * underscore and the German umlauts, so `#küchenchaos` survives and a trailing
 * full stop does not get swallowed into the tag.
 */
function splitTags(text: string): Part[] {
  const parts: Part[] = [];
  const pattern = /[#@][\wäöüÄÖÜß]+/g;
  let lastIndex = 0;

  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      parts.push({ text: text.slice(lastIndex, start), tag: false });
    }
    parts.push({ text: match[0], tag: true });
    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), tag: false });
  }
  return parts;
}
