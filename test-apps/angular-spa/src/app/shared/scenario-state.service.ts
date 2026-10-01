import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScenarioStateService {
  readonly componentInstance = signal('waiting for route');
  readonly componentCreatedAt = signal(Date.now());
  readonly dynamicItemCount = signal(0);

  activate(name: string): string {
    const instanceId = `${name}-${Math.random().toString(36).slice(2, 8)}`;
    this.componentInstance.set(instanceId);
    this.componentCreatedAt.set(Date.now());
    this.dynamicItemCount.set(0);
    return instanceId;
  }

  setDynamicItemCount(count: number): void {
    this.dynamicItemCount.set(count);
  }
}
