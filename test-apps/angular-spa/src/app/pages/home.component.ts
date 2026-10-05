import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScenarioStateService } from '../shared/scenario-state.service';

@Component({
  imports: [RouterLink],
  template: `
    <!-- Baseline route for verifying ordinary text before stressing DOM lifecycle behavior. -->
    <section class="page-heading">
      <p class="eyebrow">Baseline route</p>
      <h1>Welcome to the translation test workshop</h1>
      <p>This page contains stable content rendered by an Angular route without a full browser reload.</p>
    </section>

    <section class="test-section">
      <h2>Explore a realistic content structure</h2>
      <p>Headings, paragraphs, links, buttons, and <strong>nested emphasis</strong> should all translate consistently.</p>
      <div class="button-row">
        <button type="button">Open account settings</button>
        <a class="button-link" routerLink="/products">Browse available products</a>
      </div>
      <article class="sample-block">
        <h3>Nested editorial content</h3>
        <p>A customer can compare plans, read delivery information, and continue to a detailed product page.</p>
        <p>Repeated visits to this route should not create duplicate wrappers or preserve text from another page.</p>
      </article>
    </section>
  `
})
export class HomeComponent {
  private readonly state = inject(ScenarioStateService);
  protected readonly instanceId = this.state.activate('home');
}
