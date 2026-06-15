// Global unit-test setup (registered via angular.json `test.options.setupFiles`).
// jsdom does not implement matchMedia, which Angular CDK's BreakpointObserver and
// several Material components depend on — provide a minimal stub.
const noop = (): void => undefined;

if (!('matchMedia' in window)) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: noop,
        removeEventListener: noop,
        addListener: noop,
        removeListener: noop,
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  });
}
