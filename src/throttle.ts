import { setTimeout as sleep } from "node:timers/promises";

export interface ThrottleStatus {
  requestedQueryCost: number;
  actualQueryCost: number;
  maximumAvailable: number;
  currentlyAvailable: number;
  restoreRate: number;
}

interface ThrottleManagerOptions {
  now?: () => number;
  sleep?: (milliseconds: number) => Promise<void>;
  initialAvailable?: number;
  initialMaxAvailable?: number;
  initialRestoreRate?: number;
}

export class ThrottleManager {
  private available: number;
  private maxAvailable: number;
  private restoreRate: number;
  private lastUpdate: number;
  private readonly now: () => number;
  private readonly wait: (milliseconds: number) => Promise<void>;

  constructor(options: ThrottleManagerOptions = {}) {
    this.available = options.initialAvailable ?? 1000;
    this.maxAvailable = options.initialMaxAvailable ?? 1000;
    this.restoreRate = options.initialRestoreRate ?? 50;
    this.now = options.now ?? Date.now;
    this.wait = options.sleep ?? ((milliseconds) => sleep(milliseconds).then(() => undefined));
    this.lastUpdate = this.now();
  }

  update(status: ThrottleStatus): void {
    this.available = status.currentlyAvailable;
    this.maxAvailable = status.maximumAvailable;
    this.restoreRate = status.restoreRate;
    this.lastUpdate = this.now();
  }

  async waitForCapacity(estimatedCost: number): Promise<void> {
    const clampedCost = Math.max(0, estimatedCost);
    this.rehydrate();

    if (this.available >= clampedCost) {
      return;
    }

    const missing = clampedCost - this.available;
    const restoreRate = this.restoreRate > 0 ? this.restoreRate : 50;
    const waitMs = Math.ceil((missing / restoreRate) * 1000);

    await this.wait(waitMs);
    this.rehydrate();
  }

  getSnapshot(): {
    available: number;
    maxAvailable: number;
    restoreRate: number;
    lastUpdate: number;
  } {
    this.rehydrate();
    return {
      available: this.available,
      maxAvailable: this.maxAvailable,
      restoreRate: this.restoreRate,
      lastUpdate: this.lastUpdate,
    };
  }

  calculateRetryDelayMs(estimatedCost: number): number {
    this.rehydrate();
    const missing = Math.max(0, estimatedCost - this.available);
    const restoreRate = this.restoreRate > 0 ? this.restoreRate : 50;
    return Math.max(250, Math.ceil((missing / restoreRate) * 1000));
  }

  private rehydrate(): void {
    const now = this.now();
    const elapsedSeconds = Math.max(0, now - this.lastUpdate) / 1000;
    if (elapsedSeconds <= 0) {
      return;
    }

    const replenished = elapsedSeconds * this.restoreRate;
    this.available = Math.min(this.maxAvailable, this.available + replenished);
    this.lastUpdate = now;
  }
}
