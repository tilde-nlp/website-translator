import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ScenarioStateService } from '../shared/scenario-state.service';

@Component({
  template: `
    <!-- Every control creates a distinct mutation pattern for observer testing. -->
    <section class="page-heading">
      <p class="eyebrow">Mutation laboratory</p>
      <h1>Dynamic content</h1>
      <p>Add, delay, replace, or rapidly update content after the route has already been translated.</p>
    </section>

    <section class="test-section">
      <div class="button-row">
        <button type="button" (click)="addImmediate()">Add content immediately</button>
        <button type="button" (click)="addDelayed(3000, 'Content returned by the API after three seconds.')">Add after 3 seconds</button>
        <button type="button" (click)="addDelayed(10000, 'Content returned after ten seconds, beyond the old discovery window.')">Add after 10 seconds</button>
        <button type="button" (click)="replaceContent()">Replace component content</button>
        <button type="button" (click)="appendGroup()">Append infinite-scroll group</button>
        <button type="button" (click)="rapidUpdates()">Run rapid updates</button>
      </div>
      <p class="status" translate="no">{{ status() }}</p>
    </section>

    @if (generation() % 2 === 0) {
      <section class="test-section sample-block replacement-even">
        <h2>Replacement component, generation {{ generation() }}</h2>
        <p>{{ replacementText() }}</p>
      </section>
    } @else {
      <article class="test-section sample-block replacement-odd">
        <h2>Replaceable component, generation {{ generation() }}</h2>
        <p>{{ replacementText() }}</p>
      </article>
    }

    <section class="dynamic-list" aria-live="polite">
      @for (item of items(); track item.id) {
        <article class="sample-block">
          <h2>{{ item.title }}</h2>
          <p>{{ item.text }}</p>
        </article>
      }
    </section>

    <section class="test-section">
      <h2>Rapidly changing value</h2>
      <p>{{ rapidText() }}</p>
    </section>
  `
})
export class DynamicContentComponent implements OnDestroy {
  private readonly state = inject(ScenarioStateService);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  private rapidTimer?: ReturnType<typeof setInterval>;
  private nextId = 1;
  protected readonly items = signal<{ id: number; title: string; text: string }[]>([]);
  protected readonly generation = signal(1);
  protected readonly replacementText = signal('This is the first component content rendered by Angular.');
  protected readonly rapidText = signal('Rapid updates have not started.');
  protected readonly status = signal('No delayed operation is pending.');

  constructor() { this.state.activate('dynamic-content'); }

  ngOnDestroy(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    if (this.rapidTimer) clearInterval(this.rapidTimer);
  }

  protected addImmediate(): void { this.addItem('Immediate content', 'This text was inserted as soon as the control was activated.'); }

  protected addDelayed(delay: number, text: string): void {
    this.status.set(`Waiting ${delay / 1000} seconds for delayed content.`);
    this.timers.push(setTimeout(() => {
      this.addItem('Delayed API result', text);
      this.status.set('Delayed content was inserted.');
    }, delay));
  }

  protected replaceContent(): void {
    this.generation.update(value => value + 1);
    this.replacementText.set(`Angular destroyed the previous view and rendered replacement generation ${this.generation()}.`);
  }

  protected appendGroup(): void {
    const group = this.generation();
    for (let index = 1; index <= 3; index++) {
      this.addItem(`Infinite-scroll item ${group}.${index}`, 'This group was appended after the existing translated list.');
    }
  }

  protected rapidUpdates(): void {
    if (this.rapidTimer) clearInterval(this.rapidTimer);
    let update = 0;
    this.rapidTimer = setInterval(() => {
      update++;
      this.rapidText.set(`Rapid update ${update}: this sentence changed without replacing the surrounding section.`);
      if (update === 8 && this.rapidTimer) clearInterval(this.rapidTimer);
    }, 180);
  }

  private addItem(title: string, text: string): void {
    this.items.update(items => [...items, { id: this.nextId++, title, text }]);
    this.state.setDynamicItemCount(this.items().length);
  }
}
