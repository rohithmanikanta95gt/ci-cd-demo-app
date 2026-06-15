const test = require('node:test');
const assert = require('node:assert');
const { formatUptime } = require('./app');

test('Uptime Formatter Module Unit Tests', async (t) => {
  
  await t.test('formats seconds to h m s format correctly', () => {
    // 3665 seconds = 1 hour, 1 minute, 5 seconds
    const result = formatUptime(3665);
    assert.strictEqual(result, '1h 1m 5s');
  });

  await t.test('formats small durations correctly', () => {
    // 45 seconds = 0 hours, 0 minutes, 45 seconds
    const result = formatUptime(45);
    assert.strictEqual(result, '0h 0m 45s');
  });

  await t.test('formats exactly one hour correctly', () => {
    // 3600 seconds = 1 hour, 0 minutes, 0 seconds
    const result = formatUptime(3600);
    assert.strictEqual(result, '1h 0m 0s');
  });

  await t.test('handles zero seconds gracefully', () => {
    const result = formatUptime(0);
    assert.strictEqual(result, '0h 0m 0s');
  });

  await t.test('handles negative values by defaulting to zero format', () => {
    const result = formatUptime(-120);
    assert.strictEqual(result, '0h 0m 0s');
  });

  await t.test('handles non-number inputs by defaulting to zero format', () => {
    assert.strictEqual(formatUptime('invalid'), '0h 0m 0s');
    assert.strictEqual(formatUptime(null), '0h 0m 0s');
    assert.strictEqual(formatUptime(undefined), '0h 0m 0s');
    assert.strictEqual(formatUptime({}), '0h 0m 0s');
  });
});
