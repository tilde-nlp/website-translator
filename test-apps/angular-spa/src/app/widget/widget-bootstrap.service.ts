import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { widgetConfig } from './widget.config';

interface WebsiteTranslatorApi {
  Options: {
    api: { clientId: string; url: string };
    debug: boolean;
    translation: { languageUrlMode: 'push' | 'replace' | 'none' };
    ui: { toolbarPosition: string };
  };
  Initialize(): Promise<void>;
}

declare global {
  interface Window { WebsiteTranslator?: WebsiteTranslatorApi; }
}

@Injectable({ providedIn: 'root' })
export class WidgetBootstrapService {
  private readonly document = inject(DOCUMENT);

  initialize(): void {
    const script = this.document.createElement('script');
    script.src = widgetConfig.scriptUrl;
    script.onload = () => {
      const widget = window.WebsiteTranslator;
      if (!widget) return;
      widget.Options.debug = true;
      widget.Options.api.clientId = widgetConfig.websiteId;
      widget.Options.api.url = widgetConfig.apiUrl;
      widget.Options.translation.languageUrlMode = 'none';
      widget.Options.ui.toolbarPosition = 'top';
      void widget.Initialize();
    };
    script.onerror = () => console.error(`Website Translator script could not be loaded from ${widgetConfig.scriptUrl}`);
    this.document.head.appendChild(script);
  }
}
