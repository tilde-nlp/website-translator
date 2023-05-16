<div align="center">
   <a href="https://translate.tilde.com/">
    <img width="200" height="200" src="https://tilde.com/themes/custom/drupal8_zymphonies_theme/logo.svg">
  </a>
</div>

<br/>

# Website Translator

Quickly scale up from one language to a dozen!
No coding, manual translation, or duplicated webpages! Simply select the target languages and  Website Translator will instantly translate the content. For quality control, you can review and edit translations with a visual editor.

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

# Browser support

<!--
Browser support comes from [tsconfig.json] -> target (ES6)
https://www.w3schools.com/js/js_versions.asp
-->

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" /></br>Edge | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" /></br>Firefox | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" /></br>Chrome | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" /></br>Safari | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" /></br>Opera |
| --------- | --------- | --- | --- | --- |
| 14+ | 52+ | 51+ | 10+ | 38+ |

Edge Legacy and Internet Explorer browsers are not supported.