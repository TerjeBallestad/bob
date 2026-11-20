import { describe, expect, it } from 'vitest';
import * as source from '../src/index';
import * as built from '@terjeballestad/bob';

// The runtime exports of Time Turtle's client/src/ds/index.ts at bb93eea.
// Bob 0.1.0 is that code moved unchanged (DD-007), so the list must match exactly.
const TT_EXPORTS = [
  'Avatar', 'Button', 'Chip', 'FormRow', 'Input', 'Kbd', 'ListRow', 'Modal', 'NavRow',
  'ProgressBar', 'SearchInput', 'SectionLabel', 'SegToggle', 'Select', 'StatusDot',
  'Textarea', 'TicketCard', 'Toast', 'ToastStack', 'normalizeOption',
].sort();

describe('exports', () => {
  it('the built package exports every name that Time Turtle\'s ds exported, and no other', () => {
    expect(Object.keys(built).sort()).toEqual(TT_EXPORTS);
  });

  it('the built package exports the same names as the source barrel', () => {
    expect(Object.keys(built).sort()).toEqual(Object.keys(source).sort());
  });
});
