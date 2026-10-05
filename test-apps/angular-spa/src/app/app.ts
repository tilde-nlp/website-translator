import { afterNextRender, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DebugPanelComponent } from './shared/debug-panel.component';
import { WidgetBootstrapService } from './widget/widget-bootstrap.service';

@Component({
  selector: 'app-root',
  imports: [DebugPanelComponent, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly widgetBootstrap = inject(WidgetBootstrapService);
  protected readonly navigation = [
    { path: '/home', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/dynamic-content', label: 'Dynamic content' },
    { path: '/attributes', label: 'Attributes' },
    { path: '/iframes', label: 'Iframes' },
    { path: '/shadow-dom', label: 'Shadow DOM' },
    { path: '/slow-content', label: 'Slow content' }
  ];

  constructor() {
    afterNextRender(() => this.widgetBootstrap.initialize());
  }
}
