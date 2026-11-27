import React from 'react';
import { Toast as BaseToast } from '@base-ui/react/toast';
import type {
  ToastManager as BaseToastManager,
  ToastManagerAddOptions,
  ToastManagerUpdateOptions,
  ToastObject as BaseToastObject,
  UseToastManagerReturnValue,
} from '@base-ui/react/toast';

// Toasts come from Base UI's toast manager, as in shadcn/ui's Base UI toast (DD-034, DD-036).
// An app adds a toast with a call, `toast.add({ title, description, type })`, from a manager
// (createToastManager) or the hook (useToastManager). ToastStack is the provider and the
// viewport, and renders each toast with Bob's classes. Base UI does the timers, the pause on
// hover and focus, swipe to dismiss, and F6 to the viewport.

/** A toast in the list that useToastManager() returns. */
export type ToastObject<Data extends object = any> = BaseToastObject<Data>;
export type ToastType = 'success' | 'error';

/** What `toast.add` takes. `title` is required: it names the toast for a screen reader. `type`
 *  is `'success'` (the default) or `'error'`. Base UI's `priority` is left out: Bob announces by
 *  `type` (see Announcer), and priority 'high' would hide the toast from a screen reader while
 *  Tab still reaches it, and announce it a second time. */
export type ToastOptions<Data extends object = any> = Omit<ToastManagerAddOptions<Data>, 'priority' | 'type' | 'title'> & {
  title: React.ReactNode;
  type?: ToastType;
};
/** What `toast.update` takes: any of the add options. */
export type ToastUpdateOptions<Data extends object = any> = Omit<ToastManagerUpdateOptions<Data>, 'priority' | 'type'> & {
  type?: ToastType;
};

/** Bob's manager: Base UI's, with `add` and `update` that take Bob's options. */
export type ToastManager<Data extends object = any> = Omit<BaseToastManager<Data>, 'add' | 'update'> & {
  add: (options: ToastOptions<Data>) => string;
  update: (id: string, updates: ToastUpdateOptions<Data> | ((prev: ToastObject<Data>) => ToastUpdateOptions<Data>)) => void;
};
/** What useToastManager() returns: the toasts, and Bob's add and update. */
export type UseToastManager<Data extends object = any> = Omit<UseToastManagerReturnValue<Data>, 'add' | 'update'> & {
  add: ToastManager<Data>['add'];
  update: ToastManager<Data>['update'];
};

// Every toast passes through here on its way to Base UI. `priority` is dropped at run time too,
// for an app without TypeScript.
function bobOptions<O extends { priority?: unknown; type?: unknown; timeout?: number }>(options: O): O {
  const { priority: _dropped, ...rest } = options;
  // An error stays until the user closes it, unless the app gives it a timeout (WCAG 2.2.1).
  if (rest.type === 'error' && rest.timeout === undefined) rest.timeout = 0;
  return rest as O;
}

type Adder<Data extends object> = Pick<BaseToastManager<Data>, 'add' | 'update'>;
function bobAddUpdate<Data extends object>(base: Adder<Data>): Pick<ToastManager<Data>, 'add' | 'update'> {
  return {
    add: (options) => base.add(bobOptions(options) as ToastManagerAddOptions<Data>),
    update: (id, updates) =>
      base.update(
        id,
        typeof updates === 'function'
          ? (prev) => bobOptions(updates(prev)) as ToastManagerUpdateOptions<Data>
          : (bobOptions(updates) as ToastManagerUpdateOptions<Data>),
      ),
  };
}

// Functions, not `export const createToastManager = BaseToast.createToastManager`: a property
// read at the top of the module keeps Base UI's toast in every app bundle, also one that
// imports only Button.

/** A manager to add toasts from anywhere, also outside React. Pass it to ToastStack. */
export function createToastManager<Data extends object = any>(): ToastManager<Data> {
  const base = BaseToast.createToastManager<Data>();
  return { ...base, ...bobAddUpdate(base) };
}

/** The toasts and the add, close, update and promise calls, inside a ToastStack. */
export function useToastManager<Data extends object = any>(): UseToastManager<Data> {
  const base = BaseToast.useToastManager<Data>();
  const { add, update } = base;
  const wrapped = React.useMemo(() => bobAddUpdate<Data>({ add, update }), [add, update]);
  return { ...base, ...wrapped };
}

export interface ToastStackProps {
  /** The app. A component inside it can call useToastManager(). */
  children?: React.ReactNode;
  /** A manager from createToastManager(), to add toasts from outside the stack. */
  toastManager?: ToastManager;
  /** Milliseconds before a toast closes itself. 0 keeps it until the user closes it. Each
   *  toast can set its own `timeout`. */
  timeout?: number;
  /** The most toasts on screen at once. An older one waits, hidden, until a newer one closes. */
  limit?: number;
}

/** The provider and the place on screen where toasts appear: bottom centre, newest at the
 *  bottom. Render one, at the root of the app, and keep it mounted. */
export function ToastStack({ children, toastManager, timeout = 4000, limit = 3 }: ToastStackProps) {
  return (
    // Bob's manager is Base UI's with a wrapped add and update, so Base UI's provider takes it.
    <BaseToast.Provider toastManager={toastManager as BaseToastManager | undefined} timeout={timeout} limit={limit}>
      {children}
      {/* The viewport is the region "Notifications" that F6 moves focus to. It is not a live
          region (aria-live="off"): the Announcer below reads each toast once. In a polite
          region an error toast would be read twice, once there and once as an alert. */}
      <BaseToast.Viewport className="toast-stack" aria-live="off">
        <ToastList />
      </BaseToast.Viewport>
      <Announcer />
    </BaseToast.Provider>
  );
}

function ToastList() {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => (
    <BaseToast.Root
      key={toast.id}
      toast={toast}
      className={toast.type === 'error' ? 'toast toast-error' : 'toast'}
      // A dialog needs a name. Base UI names it by its title; a toast with only a description
      // (toast.promise with a string, or an update) takes the description as its name.
      aria-label={!toast.title && typeof toast.description === 'string' ? toast.description : undefined}
    >
      <div className="toast-text">
        <BaseToast.Title className="toast-title" render={<div />} />
        <BaseToast.Description className="toast-description" render={<div />} />
      </div>
      {/* Base UI hides the button from a screen reader until the stack is hovered or focused,
          so a live region does not read "Close". Bob's viewport is not a live region, and a
          hidden button that Tab reaches fails WCAG 4.1.2 (axe aria-hidden-focus). */}
      <BaseToast.Close className="toast-close" aria-label="Close" aria-hidden={undefined}>
        &times;
      </BaseToast.Close>
    </BaseToast.Root>
  ));
}

// Two live regions, side by side and never nested: polite for a success, assertive for an
// error. They are in the page before the first toast, so a screen reader reads each text added
// to them. Each toast's text is in exactly one of them; a toast that closes takes its text
// away, and a removal is not read (aria-relevant="additions text").
const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  margin: -1,
  padding: 0,
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

function Announcer() {
  const { toasts } = BaseToast.useToastManager();
  // Oldest first, so a screen reader reads them in the order they came.
  const shown = toasts.filter((t) => t.transitionStatus !== 'ending').reverse();
  const region = (live: 'polite' | 'assertive', error: boolean) => (
    <div aria-live={live} aria-atomic="false" aria-relevant="additions text" style={visuallyHidden} data-bob-toast-announcer={live}>
      {shown
        .filter((t) => (t.type === 'error') === error)
        .map((t) => (
          <div key={t.id}>
            {t.title}
            {t.title && t.description ? '. ' : null}
            {t.description}
          </div>
        ))}
    </div>
  );
  return (
    <>
      {region('polite', false)}
      {region('assertive', true)}
    </>
  );
}
