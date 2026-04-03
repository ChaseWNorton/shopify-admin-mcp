import { describe, expect, it } from "vitest";
import { ThrottleManager } from "../src/throttle.js";

describe("ThrottleManager", () => {
  it("updates its bucket state from Shopify throttle status", () => {
    const throttle = new ThrottleManager();

    throttle.update({
      requestedQueryCost: 25,
      actualQueryCost: 20,
      maximumAvailable: 1000,
      currentlyAvailable: 640,
      restoreRate: 100,
    });

    expect(throttle.getSnapshot()).toMatchObject({
      available: 640,
      maxAvailable: 1000,
      restoreRate: 100,
    });
  });

  it("waits until enough capacity is restored", async () => {
    let now = 0;
    const waits: number[] = [];
    const throttle = new ThrottleManager({
      now: () => now,
      sleep: async (milliseconds) => {
        waits.push(milliseconds);
        now += milliseconds;
      },
      initialAvailable: 10,
      initialRestoreRate: 50,
    });

    await throttle.waitForCapacity(60);

    expect(waits).toEqual([1000]);
    expect(throttle.getSnapshot().available).toBe(60);
  });

  it("calculates retry delays from the current bucket state", () => {
    let now = 0;
    const throttle = new ThrottleManager({
      now: () => now,
      initialAvailable: 0,
      initialRestoreRate: 20,
    });

    expect(throttle.calculateRetryDelayMs(40)).toBe(2000);

    now = 1000;
    expect(throttle.getSnapshot().available).toBe(20);
  });
});
