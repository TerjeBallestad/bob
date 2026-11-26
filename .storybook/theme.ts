import { create } from 'storybook/theming';
import { Tokens, hex } from '../stories/tokens/model';

// Bob's Storybook theme, for the manager (sidebar, toolbar, panels) and for the docs pages.
// Every colour comes from Bob's tokens through `tokens`, so the theme follows the token files.
// The manager cannot load Bob's CSS, so main.ts hands it the token CSS as text (managerHead).
export function bobTheme(tokens: Tokens, version: string) {
  const c = (name: string) => hex(tokens.color(name));
  return create({
    base: 'dark',
    brandTitle: brand(version, c('--accent'), c('--text'), c('--text-3'), c('--border-2')),
    brandUrl: './',
    brandTarget: '_self',

    colorPrimary: c('--accent'),
    colorSecondary: c('--accent-deep'),

    appBg: c('--surface-sidebar'),
    appContentBg: c('--surface-app'),
    appPreviewBg: c('--surface-app'),
    appHoverBg: c('--gray-10'),
    appBorderColor: c('--border'),
    appBorderRadius: 8,

    fontBase: "'Schibsted Grotesk', system-ui, sans-serif",
    fontCode: "'JetBrains Mono', ui-monospace, monospace",

    textColor: c('--text'),
    textInverseColor: c('--on-accent'),
    textMutedColor: c('--text-2'),

    barBg: c('--surface-sidebar'),
    barTextColor: c('--text-2'),
    barHoverColor: c('--text'),
    barSelectedColor: c('--accent'),

    buttonBg: c('--surface-card'),
    buttonBorder: c('--border-2'),
    booleanBg: c('--surface-input'),
    booleanSelectedBg: c('--accent-deep'),
    inputBg: c('--surface-input'),
    inputBorder: c('--input-border'),
    inputTextColor: c('--text'),
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
