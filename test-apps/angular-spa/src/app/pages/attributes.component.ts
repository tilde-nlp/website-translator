import { Component, inject, signal } from '@angular/core';
import { ScenarioStateService } from '../shared/scenario-state.service';

@Component({
  template: `
    <!-- Property bindings mutate existing DOM attributes instead of replacing their elements. -->
    <section class="page-heading">
      <p class="eyebrow">In-place attribute changes</p>
      <h1>Dynamic translatable attributes</h1>
      <p>Translate this route, then change each application-provided value and inspect the live element.</p>
    </section>

    <section class="attribute-grid">
      <article class="sample-block">
        <h2>Placeholder</h2>
        <input [attr.placeholder]="placeholder()" />
        <button type="button" (click)="changePlaceholder()">Change placeholder</button>
      </article>
      <article class="sample-block">
        <h2>Title</h2>
        <span class="attribute-target" [attr.title]="title()">Hover over this text</span>
        <button type="button" (click)="changeTitle()">Change title</button>
      </article>
      <article class="sample-block">
        <h2>ARIA label</h2>
        <button type="button" [attr.aria-label]="ariaLabel()">Open details</button>
        <button type="button" (click)="changeAriaLabel()">Change ARIA label</button>
      </article>
      <article class="sample-block">
        <h2>Image alternative text</h2>
        <img src="/attribute-sample.svg" [attr.alt]="altText()" />
        <button type="button" (click)="changeAltText()">Change alternative text</button>
      </article>
    </section>

    <section class="test-section raw-values" translate="no">
      <h2>Current Angular source values</h2>
      <dl>
        <dt>placeholder</dt><dd>{{ placeholder() }}</dd>
        <dt>title</dt><dd>{{ title() }}</dd>
        <dt>aria-label</dt><dd>{{ ariaLabel() }}</dd>
        <dt>alt</dt><dd>{{ altText() }}</dd>
      </dl>
    </section>
  `
})
export class AttributesComponent {
  private readonly state = inject(ScenarioStateService);
  protected readonly placeholder = signal('Search products');
  protected readonly title = signal('View product information');
  protected readonly ariaLabel = signal('Open product details');
  protected readonly altText = signal('A notebook resting on a wooden desk');

  constructor() { this.state.activate('attributes'); }
  protected changePlaceholder(): void { this.placeholder.set('Search archived products'); }
  protected changeTitle(): void { this.title.set('View archived product information'); }
  protected changeAriaLabel(): void { this.ariaLabel.set('Open archived product details'); }
  protected changeAltText(): void { this.altText.set('An archived notebook beside a reading lamp'); }
}
