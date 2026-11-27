import { create } from 'storybook/theming';
import { Tokens, hex } from '../stories/tokens/model';

// Bob's Storybook theme, for the manager (sidebar, toolbar, panels) and for the docs pages.
// Every colour comes from Bob's tokens through `tokens`, so the theme follows the token files.
// The manager cannot load Bob's CSS, so main.ts hands it the token CSS as text (managerHead).
export function bobTheme(tokens: Tokens, version: string) {
  const c = (name: string) => hex(tokens.color(name));
  return create({
    base: 'dark',
    brandTitle: brand(version, c('--bg-accent'), c('--text-primary'), c('--text-muted'), c('--border-strong')),
    brandUrl: './',
    brandTarget: '_self',

    colorPrimary: c('--bg-accent'),
    colorSecondary: c('--bg-accent-strong'),

    appBg: c('--bg-sidebar'),
    appContentBg: c('--bg-app'),
    appPreviewBg: c('--bg-app'),
    appHoverBg: c('--bg-nav-hover'),
    appBorderColor: c('--border-subtle'),
    appBorderRadius: 8,

    fontBase: "'Schibsted Grotesk', system-ui, sans-serif",
    fontCode: "'JetBrains Mono', ui-monospace, monospace",

    textColor: c('--text-primary'),
    textInverseColor: c('--text-on-accent'),
    textMutedColor: c('--text-secondary'),

    barBg: c('--bg-sidebar'),
    barTextColor: c('--text-secondary'),
    barHoverColor: c('--text-primary'),
    barSelectedColor: c('--text-accent'),

    buttonBg: c('--bg-card'),
    buttonBorder: c('--border-strong'),
    booleanBg: c('--bg-input'),
    booleanSelectedBg: c('--bg-accent-strong'),
    inputBg: c('--bg-input'),
    inputBorder: c('--border-input'),
    inputTextColor: c('--text-primary'),
    inputBorderRadius: 7,
  });
}

/** The sidebar's brand: a dot in the accent, the name, and the version in mono. */
function brand(version: string, accent: string, text: string, muted: string, border: string) {
  const dot = `<span style="width:10px;height:10px;border-radius:50%;background:${accent};box-shadow:0 0 10px ${accent}80;flex-shrink:0"></span>`;
  const name = `<span style="font:700 17px/1 'Schibsted Grotesk',system-ui,sans-serif;letter-spacing:-0.02em;color:${text}">Bob</span>`;
  const ver = `<span style="font:500 10px/1 'JetBrains Mono',ui-monospace,monospace;color:${muted};border:1px solid ${border};border-radius:4px;padding:3px 5px">${version}</span>`;
  return `<span style="display:inline-flex;align-items:center;gap:9px">${dot}${name}${ver}</span>`;
}
