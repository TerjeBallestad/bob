// Type checks of Bob's toast options (npm run typecheck). Each @ts-expect-error must fail to
// compile; if Bob's types let the line through, tsc reports an unused directive.
import { createToastManager, type UseToastManager } from '@terjeballestad/bob';

const toast = createToastManager();
toast.add({ title: 'Saved' });
toast.add({ title: 'Could not save', description: 'Try again', type: 'error', timeout: 0 });
toast.update('id', { title: 'Saved again', type: 'success' });

// @ts-expect-error Bob announces by type; Base UI's priority is not an option.
toast.add({ title: 'Could not save', priority: 'high' });
// @ts-expect-error type is 'success' or 'error'.
toast.add({ title: 'Careful', type: 'warning' });
// @ts-expect-error a toast needs a title: it names the toast for a screen reader.
toast.add({ description: 'The server did not answer.' });
// @ts-expect-error update takes Bob's options too.
toast.update('id', { priority: 'high' });

export function fromHook(local: UseToastManager) {
  local.add({ title: 'Saved' });
  // @ts-expect-error the hook's add takes Bob's options.
  local.add({ title: 'Saved', priority: 'high' });
}
