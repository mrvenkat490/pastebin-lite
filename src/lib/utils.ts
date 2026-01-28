export function getCurrentTime(headers: Headers): number {
  const testNow = headers.get('x-test-now-ms');
  if (process.env.TEST_MODE === '1' && testNow) {
    return parseInt(testNow);
  }
  return Date.now();
}