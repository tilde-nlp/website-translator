import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./pages/home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./pages/products.component').then(m => m.ProductsComponent) },
  { path: 'products/:id', loadComponent: () => import('./pages/product-detail.component').then(m => m.ProductDetailComponent) },
  { path: 'dynamic-content', loadComponent: () => import('./pages/dynamic-content.component').then(m => m.DynamicContentComponent) },
  { path: 'attributes', loadComponent: () => import('./pages/attributes.component').then(m => m.AttributesComponent) },
  { path: 'iframes', loadComponent: () => import('./pages/iframes.component').then(m => m.IframesComponent) },
  { path: 'shadow-dom', loadComponent: () => import('./pages/shadow-dom.component').then(m => m.ShadowDomComponent) },
  { path: 'slow-content', loadComponent: () => import('./pages/slow-content.component').then(m => m.SlowContentComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', redirectTo: 'home' }
];
