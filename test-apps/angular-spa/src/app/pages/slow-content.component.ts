import { Component, inject, OnDestroy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScenarioStateService } from '../shared/scenario-state.service';

@Component({
  imports: [RouterLink],
  template: `
    <!-- Timers are cancelled on destroy; navigate away while requests are pending to test stale widget work. -->
    <section class="page-heading">
      <p class="eyebrow">Asynchronous route</p>
      <h1>Slow content delivery</h1>
      <p>Blocks appear at one, three, six, and ten seconds after this component is created.</p>
    </section>
    <section class="test-section">
      <a class="button-link" routerLink="/home">Navigate away before all content arrives</a>
      <button type="button" (click)="restart()">Restart delayed content</button>
      <p class="status" translate="no">{{ pendingCount() }} delayed blocks pending</p>
    </section>
    <section class="dynamic-list" aria-live="polite">
      @for (block of blocks(); track block.delay) {
        <article class="sample-block">
          <h2>Content delivered after {{ block.delay }} seconds</h2>
          <p>{{ block.text }}</p>
        </article>
      }
    </section>
  `
})
export class SlowContentComponent implements OnDestroy {
  private readonly state = inject(ScenarioStateService);
  private timers: ReturnType<typeof setTimeout>[] = [];
  protected readonly blocks = signal<{ delay: number; text: string }[]>([]);
  protected readonly pendingCount = signal(4);

  constructor() {
    this.state.activate('slow-content');
    this.scheduleBlocks();
  }

  ngOnDestroy(): void { this.clearTimers(); }

  protected restart(): void {
    this.clearTimers();
    this.blocks.set([]);
    this.pendingCount.set(4);
    this.state.setDynamicItemCount(0);
    this.scheduleBlocks();
  }

  private scheduleBlocks(): void {
    [1, 3, 6, 10].forEach(delay => {
      this.timers.push(setTimeout(() => {
        this.blocks.update(blocks => [...blocks, { delay, text: `The simulated service completed its ${delay}-second response and Angular rendered this new paragraph.` }]);
        this.pendingCount.update(count => count - 1);
        this.state.setDynamicItemCount(this.blocks().length);
      }, delay * 1000));
    });
  }

  private clearTimers(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
  }
}
