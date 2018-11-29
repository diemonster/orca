export const DEFAULT_INTERVAL = 1000;

export default function watch(milliseconds, fn) {
  const timer = setInterval(() => {
    const stop = () => { clearInterval(timer); };
    fn(stop);
  }, milliseconds);
}
