import type { Meta, StoryObj } from '@storybook/react-vite';
import { ContrastPairs, ContrastText, GrayScale, HueScales, RolesHue, RolesNeutral, ShapeAndSpace, TypeScale } from './tokens/TokenPages';

// The token pages. Tokens.mdx puts them together with the text; each one is also a
// story, so the screenshot suite covers it.
export default { title: 'Tokens', tags: ['!autodocs'], parameters: { layout: 'fullscreen' } } satisfies Meta;

type Story = StoryObj;
export const Gray: Story = { render: () => <GrayScale /> };
export const Hues: Story = { render: () => <HueScales /> };
export const RolesSurfacesBordersText: Story = { name: 'Roles: surfaces, borders, text', render: () => <RolesNeutral /> };
export const RolesAccentStatusTints: Story = { name: 'Roles: accent, status, tints', render: () => <RolesHue /> };
export const ContrastTextOnSurfaces: Story = { name: 'Contrast: text on surfaces', render: () => <ContrastText /> };
export const ContrastPairsInUse: Story = { name: 'Contrast: pairs in use', render: () => <ContrastPairs /> };
export const Type: Story = { render: () => <TypeScale /> };
export const RadiusShadowSpace: Story = { name: 'Radius, shadow, space', render: () => <ShapeAndSpace /> };
