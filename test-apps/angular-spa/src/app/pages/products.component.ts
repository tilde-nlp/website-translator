import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScenarioStateService } from '../shared/scenario-state.service';

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Field notebook', category: 'books', description: 'A durable notebook for observations and project notes.' },
  { id: 2, name: 'Reading lamp', category: 'home', description: 'A focused desk lamp with adjustable warm light.' },
  { id: 3, name: 'Travel guide', category: 'books', description: 'Practical advice for planning an independent city journey.' },
  { id: 4, name: 'Storage basket', category: 'home', description: 'A woven basket for organizing everyday supplies.' },
  { id: 5, name: 'Garden journal', category: 'books', description: 'Seasonal prompts for recording plants and harvests.' },
  { id: 6, name: 'Kitchen timer', category: 'home', description: 'A simple timer with a clear display and audible alert.' }
];

@Component({
  imports: [FormsModule, RouterLink],
  template: `
    <!-- Filtering destroys list nodes; loading more appends nodes after translation. -->
    <section class="page-heading">
      <p class="eyebrow">Generated list</p>
      <h1>Products</h1>
      <p>Filter this Angular-rendered list, append more products, or change query parameters without reloading.</p>
    </section>

    <section class="test-section controls-grid">
      <label>
        Filter products
        <input [ngModel]="filterText()" (ngModelChange)="setFilter($event)" placeholder="Search product names" />
      </label>
      <div class="button-row">
        <a class="button-link" [routerLink]="['/products']" [queryParams]="{ category: 'books', page: 2 }">Books, page 2</a>
        <a class="button-link secondary" [routerLink]="['/products']" [queryParams]="{ category: 'home', page: 1 }">Home, page 1</a>
      </div>
    </section>

    <section class="product-grid" aria-live="polite">
      @for (product of visibleProducts(); track product.id) {
        <article class="sample-block">
          <p class="eyebrow">{{ product.category }}</p>
          <h2>{{ product.name }}</h2>
          <p>{{ product.description }}</p>
          <a [routerLink]="['/products', product.id]">View product details</a>
          <button type="button">Add product to basket</button>
        </article>
      } @empty {
        <p>No products match the current filter.</p>
      }
    </section>

    <button type="button" (click)="loadMore()">Load more products</button>
  `
})
export class ProductsComponent {
  private readonly state = inject(ScenarioStateService);
  protected readonly filterText = signal('');
  private readonly visibleCount = signal(3);
  protected readonly visibleProducts = computed(() => {
    const filter = this.filterText().trim().toLowerCase();
    return PRODUCTS.filter(product => !filter || product.name.toLowerCase().includes(filter)).slice(0, this.visibleCount());
  });

  constructor() {
    this.state.activate('products');
    this.state.setDynamicItemCount(this.visibleProducts().length);
  }

  protected loadMore(): void {
    this.visibleCount.update(count => Math.min(PRODUCTS.length, count + 2));
    this.state.setDynamicItemCount(this.visibleProducts().length);
  }

  protected setFilter(value: string): void {
    this.filterText.set(value);
    this.state.setDynamicItemCount(this.visibleProducts().length);
  }
}
