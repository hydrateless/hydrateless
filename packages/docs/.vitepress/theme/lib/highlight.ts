/**
 * A tiny, dependency-free syntax highlighter. The docs render code snippets at
 * runtime (the framework switcher and the live demos change them on the fly),
 * so a build-time highlighter like Shiki cannot help here, and pulling a WASM
 * highlighter into the client would betray the whole "near-zero runtime" point.
 *
 * This scanner is intentionally pragmatic, not a parser: it colors comments,
 * strings, tags, attributes, keywords, and numbers well enough to read, and it
 * degrades to plain text rather than ever throwing. One markup-aware pass
 * covers HTML, Vue, Svelte, and JSX/TSX, since they all share `<tag>` syntax.
 */

type TokenType = 'comment' | 'string' | 'tag' | 'attr' | 'keyword' | 'number' | 'punct' | 'text';

const CLASS: Record<TokenType, string> = {
  comment: 'hl-c',
  string: 'hl-s',
  tag: 'hl-t',
  attr: 'hl-a',
  keyword: 'hl-k',
  number: 'hl-n',
  punct: 'hl-p',
  text: '',
};

const KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'default',
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'switch',
  'case',
  'break',
  'continue',
  'new',
  'class',
  'extends',
  'async',
  'await',
  'yield',
  'type',
  'interface',
  'enum',
  'typeof',
  'instanceof',
  'in',
  'of',
  'as',
  'this',
  'super',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'try',
  'catch',
  'finally',
  'throw',
]);

const escapeHtml = (value: string): string =>
  value.replace(/[&<>]/g, (ch) => (ch === '&' ? '&amp;' : ch === '<' ? '&lt;' : '&gt;'));

const isIdentStart = (ch: string): boolean => /[A-Za-z_$@:#/.-]/.test(ch);
const isIdent = (ch: string): boolean => /[A-Za-z0-9_$@:#/.-]/.test(ch);

interface Token {
  type: TokenType;
  value: string;
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  const n = code.length;
  let i = 0;
  let inTag = false;
  let expectAttr = false;

  const push = (type: TokenType, value: string): void => {
    if (value) tokens.push({ type, value });
  };

  while (i < n) {
    const ch = code[i];

    // HTML comments.
    if (code.startsWith('<!--', i)) {
      const end = code.indexOf('-->', i + 4);
      const stop = end === -1 ? n : end + 3;
      push('comment', code.slice(i, stop));
      i = stop;
      continue;
    }

    // Line and block comments (script blocks, JSX expressions, plain JS).
    if (!inTag && code.startsWith('//', i)) {
      const end = code.indexOf('\n', i);
      const stop = end === -1 ? n : end;
      push('comment', code.slice(i, stop));
      i = stop;
      continue;
    }
    if (code.startsWith('/*', i)) {
      const end = code.indexOf('*/', i + 2);
      const stop = end === -1 ? n : end + 2;
      push('comment', code.slice(i, stop));
      i = stop;
      continue;
    }

    // Strings (and template literals).
    if (ch === '"' || ch === "'" || ch === '`') {
      let j = i + 1;
      while (j < n && code[j] !== ch) {
        if (code[j] === '\\') j += 1;
        j += 1;
      }
      push('string', code.slice(i, Math.min(j + 1, n)));
      i = j + 1;
      continue;
    }

    // Opening of a tag: `<`, `</`, then the tag name.
    if (ch === '<' && /[A-Za-z/]/.test(code[i + 1] ?? '')) {
      const slash = code[i + 1] === '/';
      push('punct', slash ? '</' : '<');
      i += slash ? 2 : 1;
      let j = i;
      while (j < n && /[A-Za-z0-9._-]/.test(code[j])) j += 1;
      push('tag', code.slice(i, j));
      i = j;
      inTag = true;
      expectAttr = true;
      continue;
    }

    // Closing of a tag.
    if (inTag && (ch === '>' || code.startsWith('/>', i))) {
      const token = ch === '>' ? '>' : '/>';
      push('punct', token);
      i += token.length;
      inTag = false;
      expectAttr = false;
      continue;
    }

    // Whitespace passes through untouched.
    if (/\s/.test(ch)) {
      push('text', ch);
      if (inTag) expectAttr = true;
      i += 1;
      continue;
    }

    // Numbers.
    if (/[0-9]/.test(ch) && (tokens.length === 0 || !isIdent(code[i - 1] ?? ' '))) {
      let j = i;
      while (j < n && /[0-9._a-fA-Fx]/.test(code[j])) j += 1;
      push('number', code.slice(i, j));
      i = j;
      continue;
    }

    // Identifiers: attribute names inside tags, keywords elsewhere.
    if (isIdentStart(ch)) {
      let j = i;
      while (j < n && isIdent(code[j])) j += 1;
      const word = code.slice(i, j);
      if (inTag && expectAttr) {
        push('attr', word);
        expectAttr = false;
      } else if (KEYWORDS.has(word)) {
        push('keyword', word);
      } else {
        push('text', word);
      }
      i = j;
      continue;
    }

    // Everything else is punctuation.
    if (ch === '=' && inTag) expectAttr = false;
    push('punct', ch);
    i += 1;
  }

  return tokens;
}

/**
 * Highlight `code` and return an HTML string of `<span>`s. The `lang` is only a
 * hint today (markup and code share one scanner), but it keeps call sites
 * future-proof and self-documenting.
 */
export function highlight(code: string, _lang?: string): string {
  return tokenize(code)
    .map((token) => {
      const escaped = escapeHtml(token.value);
      const cls = CLASS[token.type];
      return cls ? `<span class="${cls}">${escaped}</span>` : escaped;
    })
    .join('');
}
