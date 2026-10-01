import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScenarioStateService } from '../shared/scenario-state.service';

const DETAILS: Record<number, { name: string; summary: string; details: string }> = {
  1: { name: 'Field notebook', summary: 'Designed for dependable notes in changing conditions.', details: 'The stitched binding opens flat and the numbered pages make field references easy to find.' },
  2: { name: 'Reading lamp', summary: 'Balanced illumination for a quiet workspace.', details: 'Three brightness levels support focused reading, detailed drawing, and gentle evening light.' },
  3: { name: 'Travel guide', summary: 'A compact companion for an unfamiliar city.', details: 'Neighborhood walks, transport guidance, and practical phrases help travelers explore confidently.' }
};

@Component({
  imports: [RouterLink],
  template: `
    <!-- Parameter navigation reuses this component while replacing all visible product content. -->
    <section class="page-heading">
      <p class="eyebrow">Route parameter {{ productId() }}</p>
      <h1>{{ product().name }}</h1>
      <p>{{ product().summary }}</p>
    </section>
    <article class="test-section sample-block">
      <h2>Product information</h2>
      <p>{{ product().details }}</p>
      <button type="button">Request availability</button>
    </article>
    <div class="button-row">
      <button type="button" (click)="changeProduct(1)">Show product 1</button>
      <button type="button" (click)="changeProduct(2)">Show product 2</button>
      <button type="button" (click)="changeProduct(3)">Show product 3</button>
      <a class="button-link secondary" routerLink="/products">Return to products</a>
    </div>
  `
})
export class ProductDetailComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly state = inject(ScenarioStateService);
  private readonly subscription: Subscription;
  protected readonly productId = signal(1);
  protected readonly product = signal(DETAILS[1]);

  constructor() {
    this.state.activate('product-detail');
    this.subscription = this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id')) || 1;
      this.productId.set(id);
      this.product.set(DETAILS[id] ?? {
        name: `Product ${id}`,
        summary: 'This product was generated from an unknown route parameter.',
        details: 'Changing the route parameter should replace this entire content block without a page reload.'
      });
    });
  }

  ngOnDestroy(): void { this.subscription.unsubscribe(); }
  protected changeProduct(id: number): void { void this.router.navigate(['/products', id]); }
}
