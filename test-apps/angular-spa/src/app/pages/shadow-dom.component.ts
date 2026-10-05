import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, ViewChild } from '@angular/core';
import { ScenarioStateService } from '../shared/scenario-state.service';

class SpaShadowFixture extends HTMLElement {
  private generation = 1;
  private readonly content: HTMLElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>:host{display:block;border:1px solid #82968b;padding:1rem} article{padding:.75rem;background:#f3f6f4} h2{margin-top:0}</style><article><h2>Static text inside an open shadow root</h2><p id="content">This paragraph exists when the custom element is created.</p><div id="dynamic"></div><nested-shadow-fixture></nested-shadow-fixture></article>`;
    this.content = root.querySelector('#content') as HTMLElement;
  }

  appendContent(): void {
    const paragraph = document.createElement('p');
    paragraph.textContent = 'This sentence was dynamically inserted into the open shadow root.';
    this.shadowRoot?.querySelector('#dynamic')?.appendChild(paragraph);
  }

  replaceContent(): void {
    this.generation++;
    this.content.textContent = `The original shadow text was replaced with generation ${this.generation}.`;
  }
}

class NestedShadowFixture extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = '<section><h3>Nested open shadow root</h3><p>This nested sentence tests recursive shadow traversal.</p></section>';
  }
}

if (!customElements.get('nested-shadow-fixture')) customElements.define('nested-shadow-fixture', NestedShadowFixture);
if (!customElements.get('spa-shadow-fixture')) customElements.define('spa-shadow-fixture', SpaShadowFixture);

@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- The fixture intentionally uses open roots so traversal is possible. -->
    <section class="page-heading">
      <p class="eyebrow">Encapsulated DOM</p>
      <h1>Open Shadow DOM</h1>
      <p>Use these controls after translation to test static, inserted, replaced, nested shadow content.</p>
    </section>
    <section class="test-section">
      <div class="button-row">
        <button type="button" (click)="appendShadowContent()">Insert shadow text</button>
        <button type="button" (click)="replaceShadowContent()">Replace shadow text</button>
      </div>
    </section>
    <spa-shadow-fixture #fixture></spa-shadow-fixture>
  `
})
export class ShadowDomComponent {
  private readonly state = inject(ScenarioStateService);
  @ViewChild('fixture', { read: ElementRef }) private fixture?: ElementRef<SpaShadowFixture>;

  constructor() { this.state.activate('shadow-dom'); }
  protected appendShadowContent(): void { this.fixture?.nativeElement.appendContent(); }
  protected replaceShadowContent(): void { this.fixture?.nativeElement.replaceContent(); }
}
