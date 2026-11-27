import { describe, expect, it } from 'vitest';
import * as source from '../src/index';
import * as built from '@terjeballestad/bob';

// The runtime exports of Time Turtle's client/src/ds/index.ts at bb93eea, which Bob 0.1.0
// moved unchanged (DD-007), with Bob 1.0's changes (DD-036): Select is a set of parts on Base
// UI's Select.
const EXPORTS = [
  'Avatar', 'Button', 'Chip', 'FormRow', 'Input', 'Kbd', 'ListRow', 'Modal', 'NavRow',
  'ProgressBar', 'SearchInput', 'SectionLabel', 'SegToggle', 'Select', 'StatusDot',
  'Textarea', 'TicketCard', 'Toast', 'ToastStack', 'normalizeOption',
  'SelectContent', 'SelectGroup', 'SelectItem', 'SelectLabel', 'SelectSeparator', 'SelectTrigger', 'SelectValue',
].sort();

describe('exports', () => {
  it('the built package exports exactly these names', () => {
    expect(Object.keys(built).sort()).toEqual(EXPORTS);
  });

  it('the built package exports the same names as the source barrel', () => {
    expect(Object.keys(built).sort()).toEqual(Object.keys(source).sort());
  });
});
