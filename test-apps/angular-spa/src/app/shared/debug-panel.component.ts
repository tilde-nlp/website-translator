import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ScenarioStateService } from './scenario-state.service';

@Component({
  selector: 'app-debug-panel',
  template: `
    <aside class="debug-panel" translate="no" aria-label="SPA test controls">
      <div class="readout">
        <strong>Route</strong><code>{{ route() }}</code>
        <strong>Query</strong><code>{{ query() }}</code>
        <strong>Instance</strong><code>{{ state.componentInstance() }}</code>
        <strong>Age</strong><code>{{ ageSeconds() }}s</code>
        <strong>Dynamic items</strong><code>{{ state.dynamicItemCount() }}</code>
      </div>
      <div class="controls">
        <button type="button" (click)="back()">Back</button>
        <button type="button" (click)="forward()">Forward</button>
        <button type="button" (click)="goToProduct()">Product 2</button>
        <button type="button" (click)="setQuery()">Books, page 2</button>
        <button type="button" [disabled]="stressRunning()" (click)="runStressSequence()">
          {{ stressRunning() ? 'Stress sequence running' : 'Run route stress sequence' }}
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .debug-panel { background: #f3f6f4; border-top: 2px solid #17211d; bottom: 0; box-shadow: 0 -4px 18px #17211d22; left: 0; padding: .75rem clamp(1rem, 3vw, 2.5rem); position: fixed; right: 0; z-index: 20; }
    .readout { display: grid; gap: .2rem .6rem; grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr) auto minmax(0, 1fr); margin-bottom: .65rem; }
    code { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .controls { display: flex; flex-wrap: wrap; gap: .45rem; }
    @media (max-width: 800px) { .readout { grid-template-columns: auto 1fr; } }
  `]
})
export class DebugPanelComponent implements OnInit, OnDestroy {
  protected readonly state = inject(ScenarioStateService);
  private readonly router = inject(Router);
  private readonly subscriptions = new Subscription();
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  protected readonly route = signal('');
  protected readonly query = signal('(none)');
  protected readonly now = signal(Date.now());
  protected readonly stressRunning = signal(false);
  protected readonly ageSeconds = computed(() => Math.max(0, Math.floor((this.now() - this.state.componentCreatedAt()) / 1000)));
  private clock?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.captureUrl(this.router.url);
    this.subscriptions.add(this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => this.captureUrl(event.urlAfterRedirects)));
    this.clock = setInterval(() => this.now.set(Date.now()), 1000);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.clock) clearInterval(this.clock);
    this.timers.forEach(timer => clearTimeout(timer));
  }

  protected back(): void { history.back(); }
  protected forward(): void { history.forward(); }
  protected goToProduct(): void { void this.router.navigate(['/products', 2]); }
  protected setQuery(): void { void this.router.navigate(['/products'], { queryParams: { category: 'books', page: 2 } }); }

  protected runStressSequence(): void {
    this.stressRunning.set(true);
    void this.router.navigate(['/products', 1]);
    this.timers.push(setTimeout(() => void this.router.navigate(['/dynamic-content']), 1200));
    this.timers.push(setTimeout(() => void this.router.navigate(['/products', 2]), 2400));
    this.timers.push(setTimeout(() => this.stressRunning.set(false), 2600));
  }

  private captureUrl(value: string): void {
    const url = new URL(value, window.location.origin);
    this.route.set(url.pathname);
    this.query.set(url.search || '(none)');
  }
}
