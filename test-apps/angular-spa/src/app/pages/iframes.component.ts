import { Component, ElementRef, inject, OnDestroy, signal } from '@angular/core';
import { ScenarioStateService } from '../shared/scenario-state.service';

@Component({
  template: `
    <!-- Same-origin fixtures are readable; the cross-origin frame must be ignored without errors. -->
    <section class="page-heading">
      <p class="eyebrow">Document boundaries</p>
      <h1>Iframe insertion</h1>
      <p>Compare frames present at route creation with frames inserted or assigned a source later.</p>
    </section>

    <section class="test-section">
      <div class="button-row">
        <button type="button" (click)="insertIframe()">Insert same-origin iframe</button>
        <button type="button" (click)="insertThenAssignSource()">Insert iframe, then assign source</button>
      </div>
    </section>

    <section class="iframe-grid">
      <article class="sample-block">
        <h2>Initial same-origin frame</h2>
        <iframe src="/iframe-content.html?fixture=initial" title="Initial same-origin test frame"></iframe>
      </article>
      @for (frame of frames(); track frame.id) {
        <article class="sample-block">
          <h2>{{ frame.label }}</h2>
          <iframe [attr.src]="frame.src" [title]="frame.label"></iframe>
        </article>
      }
      @if (lateSourceVisible()) {
        <article class="sample-block">
          <h2>Source assigned after insertion</h2>
          <iframe data-late-source title="Source assigned after insertion"></iframe>
        </article>
      }
      <article class="sample-block">
        <h2>Cross-origin frame</h2>
        <iframe src="https://example.com" title="Cross-origin frame that should be ignored"></iframe>
      </article>
    </section>
  `
})
export class IframesComponent implements OnDestroy {
  private readonly state = inject(ScenarioStateService);
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly timers: ReturnType<typeof setTimeout>[] = [];
  private nextId = 1;
  protected readonly frames = signal<{ id: number; label: string; src: string }[]>([]);
  protected readonly lateSourceVisible = signal(false);

  constructor() { this.state.activate('iframes'); }
  ngOnDestroy(): void { this.timers.forEach(timer => clearTimeout(timer)); }

  protected insertIframe(): void {
    this.frames.update(frames => [...frames, { id: this.nextId++, label: 'Dynamically inserted same-origin frame', src: '/iframe-content.html?fixture=dynamic' }]);
    this.state.setDynamicItemCount(this.frames().length);
  }

  protected insertThenAssignSource(): void {
    this.lateSourceVisible.set(true);
    this.state.setDynamicItemCount(this.frames().length + 1);
    this.timers.push(setTimeout(() => {
      const iframe = this.element.nativeElement.querySelector('iframe[data-late-source]') as HTMLIFrameElement | null;
      if (iframe) iframe.src = '/iframe-content.html?fixture=late-source';
    }, 1200));
  }
}
