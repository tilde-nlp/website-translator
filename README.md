<div align="center">
   <a href="https://translate.tilde.com/">
    <img width="200" height="200" src="https://tilde.ai/wp-content/uploads/2024/05/Tilde_logo_1080.png">
  </a>
</div>

<br/>

# Website Translator

[![Publish Beta Package](https://github.com/tilde-nlp/website-translator/actions/workflows/publish-beta.yml/badge.svg)](https://github.com/tilde-nlp/website-translator/actions/workflows/publish-beta.yml)

Quickly scale up from one language to a dozen!
No coding, manual translation, or duplicated webpages! Simply select the target languages and  Website Translator will instantly translate the content. For quality control, you can review and edit translations with a visual editor.

Versions `8.x` are currently published under the npm `beta` dist-tag. See the [changelog](changelog.md) for release details.

```bash
npm install @tilde-nlp/website-translator@beta
```

This installs the version currently assigned to npm's `beta` dist-tag. The tag is updated to the newest beta build after each successful beta publication. For reproducible installations, pin a full version such as `8.2.0-beta.42`.

# Usage

Include a reference to the Website Translator

```HTML
<script src="/dist/widget.js"></script>
```


## Integrate using the default language selector
Default language selector can be displayed as a dropdown or a list of buttons that can be styled by css to further match your style.  It will load the available languages automatically and start translation on making a selection.

```HTML
<html lang="en">
<head>
   <!-- Enter the correct source code path -->
   <script src="/dist/widget.js"></script>
</head>
<body>
   <div class="website-translator"></div>
   <!-- This will be translated  -->
   <p>This will be translated</p>

   <!-- This will not be translated  -->
   <p translate="no">This will not be translated</p>

   <!-- This will not be translated  -->
   <p lang='ja'>これを訳して</p>
</body>
<footer>
   <script>
      // Configure

      // Change XXXXXXXXXXX to your Client-ID
      WebsiteTranslator.Options.api.clientId = "XXXXXXXXXXX";

      // Change backend url 
      WebsiteTranslator.Options.api.url = "https://example.com"

      WebsiteTranslator.Options.ui.toolbarPosition = "top";

      // Display the language selector as a dropdown:
      //    menu - "menu"
      //    list of buttons - "list"
      WebsiteTranslator.Options.ui.layout = "menu";

      // Display UI in the language your visitors are translating into:
      //    target language - "target",
      //    the original language - "source"
      WebsiteTranslator.Options.ui.translate = "target";

      WebsiteTranslator.Initialize()
   </script>
</footer>
</html>
```

## Configure dynamic content discovery

`single-batch` and `word-count` modes wait for an inactivity window before completing dynamic content discovery. The window restarts whenever another discovery pass runs and defaults to 5000 ms.

Set `dynamicContentDiscoveryDelayMs` before initialization to accommodate the website's loading behaviour:

```HTML
<script>
   WebsiteTranslator.Options.translation.mode = "single-batch";
   WebsiteTranslator.Options.translation.dynamicContentDiscoveryDelayMs = 10000;
   WebsiteTranslator.Initialize();
</script>
```

The same setting applies when `mode` is `"word-count"`. Set it to `0` to complete discovery immediately after the initial pass. Invalid or negative values use the 5000 ms default.

## Configure language URL persistence

By default, language changes preserve the existing behaviour: the widget stores the selected language in the `lang` query parameter and creates a browser history entry.

The `lang` parameter also gives each translated language a distinct URL that search engines can discover. The widget uses these URLs when localizing links and generating canonical and `hreflang` metadata. Use `"push"` or `"replace"` when translated variants should remain discoverable through `?lang=...` URLs.

SPAs can update the parameter without adding history entries, or leave routing entirely to the host application:

```HTML
<script>
   // Use "replace" to keep ?lang=lv without creating a history entry.
   WebsiteTranslator.Options.translation.languageUrlMode = "replace";

   // Use "none" to prevent the widget from reading or writing ?lang and from adding it to links.
   WebsiteTranslator.Options.translation.languageUrlMode = "none";
</script>
```

Use `"none"` only when the host application owns language routing or translated pages should not be indexed separately. When using `"none"` for indexable translated pages, the host application must provide stable localized URLs and the corresponding canonical and `hreflang` metadata. Otherwise, search engines may not discover or correctly associate translated variants.

## SPA route translation lifecycle

The widget applies the same route lifecycle to `history.pushState`, `history.replaceState`, browser back/forward navigation, and hash-based navigation:

1. Invalidate queued, delayed, and in-flight work from the previous route.
2. Restore translated DOM that remains connected and remove detached translation state.
3. Reset route-specific discovery and processing state.
4. Prepare the current DOM for translation and restart dynamic content observation.
5. Translate content rendered immediately or discovered later by the SPA.

Route navigation uses a **restore and reprocess** policy. The widget does not preserve translated markup on elements that survive navigation because the host framework may reuse or mutate those elements as part of rendering the new route. Restoring source markup first gives the framework and the next discovery pass a consistent DOM.

Translation strings are cached by source content, item type, attribute, and target language. Route changes retain this cache, so unchanged content can be reapplied without another translation API request. Explicit language changes start a fresh translation execution and clear the cache. Source-language and third-party-language routes only invalidate and restore widget state; they do not start widget translation observation.

# Browser support

<!--
Browser support comes from [tsconfig.json] -> target (ES6)
https://www.w3schools.com/js/js_versions.asp
-->

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /></br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /></br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /></br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /></br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /></br>Opera |
| --------- | --------- | --- | --- | --- |
| 14+ | 52+ | 51+ | 10+ | 38+ |

Edge Legacy and Internet Explorer browsers are not supported.
