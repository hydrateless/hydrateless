import type { ComponentDoc } from './types';

/**
 * Render a component's registry entry as Markdown for VitePress's local search
 * index. Component pages mount `<ComponentDoc>` at runtime, so their Markdown
 * source files contain almost no text on their own; feeding this generated
 * Markdown into `search.options._render` keeps the registry as the single
 * source of truth while making every component, prop, event, token, and note
 * searchable with deep links matching `<ComponentDoc>`'s heading ids.
 */
export function renderComponentSearchMarkdown(doc: ComponentDoc): string {
  const lines: string[] = [
    `# ${doc.name} {#${doc.slug}}`,
    '',
    `${doc.category}. ${doc.summary}`,
    '',
    doc.description,
    '',
  ];

  const meta: string[] = [`Stylesheet: hydrateless/${doc.cssFile}`];
  if (doc.cssOnly) meta.push('CSS only, works with no JavaScript');
  if (doc.native) meta.push(`Built on ${doc.native}`);
  if (doc.enhancer) meta.push(`Enhancer: ${doc.enhancer.fn} (${doc.enhancer.subpath})`);
  lines.push(meta.join('. '), '');

  if (doc.demos.length) {
    lines.push('## Examples {#examples}', '');
    for (const demo of doc.demos) {
      if (demo.title) {
        lines.push(`### ${demo.title} {#demo-${demo.id}}`, '');
      }
      if (demo.description) {
        lines.push(demo.description, '');
      }
    }
  }

  if (doc.enhancer) {
    lines.push('## JavaScript {#javascript}', '');
    lines.push(
      `Optional enhancer \`${doc.enhancer.fn}\` from \`${doc.enhancer.subpath}\`.`,
      doc.enhancer.signature ? `Signature: \`${doc.enhancer.signature}\`.` : '',
      '',
    );
  }

  if (doc.props?.length) {
    lines.push('## Props {#props}', '');
    for (const prop of doc.props) {
      const def = prop.default ? ` (default ${prop.default})` : '';
      lines.push(`- \`${prop.name}\`: \`${prop.type}\`${def} ${prop.description}`);
    }
    lines.push('');
  }

  if (doc.events?.length) {
    lines.push('## Events and callbacks {#events}', '');
    for (const event of doc.events) {
      const detail = event.detail ? ` \`${event.detail}\`` : '';
      lines.push(`- \`${event.name}\`${detail}: ${event.description}`);
    }
    lines.push('');
  }

  if (doc.tokens?.length) {
    lines.push('## CSS variables {#css-variables}', '');
    for (const token of doc.tokens) {
      lines.push(`- \`${token.name}\`: ${token.description}`);
    }
    lines.push('');
  }

  if (doc.a11y?.length) {
    lines.push('## Accessibility {#accessibility}', '');
    for (const note of doc.a11y) {
      lines.push(`- ${note}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
