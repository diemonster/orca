export default function watch(milliseconds, fn) {
  const timer = setInterval(() => {
    const stop = () => { clearInterval(timer); };
    fn(stop);
  }, milliseconds);
}
