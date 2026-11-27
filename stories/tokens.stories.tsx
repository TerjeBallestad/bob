import type { Meta, StoryObj } from '@storybook/react-vite';
import { TypeUtilities } from './tokens/TypeUtilities';
import { ContrastPairs, ContrastText, GrayScale, HueScales, RolesHue, RolesNeutral, ShapeAndSpace, TypeScale } from './tokens/TokenPages';

// The token pages. Tokens.mdx puts them together with the text; each one is also a
// story, so the screenshot suite covers it.
export default { title: 'Foundations/Tokens', id: 'tokens', tags: ['!autodocs'], parameters: { layout: 'fullscreen' } } satisfies Meta;

type Story = StoryObj;
export const Gray: Story = { render: () => <GrayScale /> };
export const Hues: Story = { render: () => <HueScales /> };
// The two role stories keep their 0.x export names (RolesSurfacesBordersText, RolesAccentStatusTints),
// so their story ids and baseline file names stay the same across the DD-033 rename.
export const RolesSurfacesBordersText: Story = { name: 'Roles: backgrounds, borders', render: () => <RolesNeutral /> };
export const RolesAccentStatusTints: Story = { name: 'Roles: text, tints', render: () => <RolesHue /> };
export const ContrastTextOnSurfaces: Story = { name: 'Contrast: text on surfaces', render: () => <ContrastText /> };
export const ContrastPairsInUse: Story = { name: 'Contrast: pairs in use', render: () => <ContrastPairs /> };
export const Type: Story = { render: () => <TypeScale /> };
export const TypeClasses: Story = { name: 'Type: Tailwind classes', render: () => <TypeUtilities /> };
export const RadiusShadowSpace: Story = { name: 'Radius, shadow, space', render: () => <ShapeAndSpace /> };
