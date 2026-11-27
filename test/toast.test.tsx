// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import * as Bob from '@terjeballestad/bob';

// Bob's toast options at run time, from the built package: priority is dropped on every path,
// and a toast without a title still has a name.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function mount(element: JSX.Element) {
  const host = document.body.appendChild(document.createElement('div'));
  const root = createRoot(host);
  act(() => root.render(element));
  return { host, done: () => (act(() => root.unmount()), host.remove()) };
}

// What a screen reader would get twice with Base UI's priority 'high': the toast hidden from it
// (aria-hidden) and a second role=alert copy outside the stack.
function highPriorityTraces(host: HTMLElement) {
  return {
    alertdialog: host.querySelectorAll('[role="alertdialog"]').length,
    alert: host.querySelectorAll('[role="alert"]').length,
    hidden: host.querySelectorAll('.toast-stack [aria-hidden="true"], .toast[aria-hidden="true"]').length,
  };
}

describe('toast options', () => {
  it('a manager drops priority from add and update', () => {
    const toast = Bob.createToastManager();
    const { host, done } = mount(<Bob.ToastStack toastManager={toast} timeout={0} />);
    let id = '';
    act(() => void (id = toast.add({ title: 'Could not save', type: 'error', priority: 'high' } as Bob.ToastOptions)));
    act(() => toast.update(id, { title: 'Still not saved', priority: 'high' } as Bob.ToastUpdateOptions));
    expect(highPriorityTraces(host)).toEqual({ alertdialog: 0, alert: 0, hidden: 0 });
    expect(host.querySelector('[data-bob-toast-announcer="assertive"]')!.textContent).toBe('Still not saved');
    done();
  });

  it('the hook drops priority from add', () => {
    function Add() {
      const toast = Bob.useToastManager();
      React.useEffect(() => void toast.add({ title: 'Could not save', type: 'error', priority: 'high' } as Bob.ToastOptions), []);
      return null;
    }
    const { host, done } = mount(<Bob.ToastStack timeout={0}><Add /></Bob.ToastStack>);
    expect(host.querySelector('.toast-error')).not.toBeNull();
    expect(highPriorityTraces(host)).toEqual({ alertdialog: 0, alert: 0, hidden: 0 });
    done();
  });

  it('a toast with only a description is named by it', () => {
    const toast = Bob.createToastManager();
    const { host, done } = mount(<Bob.ToastStack toastManager={toast} timeout={0} />);
    let id = '';
    act(() => void (id = toast.add({ title: 'Saving' })));
    act(() => toast.update(id, { title: undefined, description: 'Saved to the server' }));
    const dialog = host.querySelector('[role="dialog"]')!;
    expect(dialog.getAttribute('aria-label')).toBe('Saved to the server');
    expect(dialog.hasAttribute('aria-labelledby')).toBe(false);
    done();
  });

  it('an error stays until closed, unless it has its own timeout', () => {
    let seen: Bob.ToastObject[] = [];
    function Probe() {
      seen = Bob.useToastManager().toasts;
      return null;
    }
    const toast = Bob.createToastManager();
    const { done } = mount(<Bob.ToastStack toastManager={toast}><Probe /></Bob.ToastStack>);
    act(() => {
      toast.add({ title: 'Could not save', type: 'error' });
      toast.add({ title: 'Saved' });
      toast.add({ title: 'Retrying', type: 'error', timeout: 500 });
    });
    const timeout = (title: string) => seen.find((t) => t.title === title)?.timeout;
    expect(timeout('Could not save')).toBe(0);
    expect(timeout('Saved')).toBeUndefined();
    expect(timeout('Retrying')).toBe(500);
    done();
  });
});
