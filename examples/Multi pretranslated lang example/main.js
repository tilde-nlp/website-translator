// Configure your personal API key
WebsiteTranslator.Options.api.clientId = 'x-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

// Step #1: Specify embedded languages of your webpage that has translation already
WebsiteTranslator.Options.translation.thirdPartyTranslationLanguages = ['en', 'fr', 'de']
// Step #2: Set language of the webpage that is currently rendered
WebsiteTranslator.Options.currentLanguage = document.documentElement.getAttribute('lang')

console.log('Current document language: ' + WebsiteTranslator.Options.currentLanguage)
// Step #3: Add custom logic to use embedded translations instead of machine translation
WebsiteTranslator.Options.translation.onLanguageSelected = function (selectedLanguage) {
  return new Promise(function (resolve) {
    let translationHandled = false
    console.info('Language selected: ' + selectedLanguage)
    // Check if custom action must be perform to open embedded translation bypassing machine translation process
    if (WebsiteTranslator.Options.translation.thirdPartyTranslationLanguages.includes(selectedLanguage)) {
      translationHandled = true
      if (WebsiteTranslator.Options.currentLanguage !== selectedLanguage) {
        console.info('Redirecting to embedded language version of the page')
        // Add your own logic on how to transform URL of current language to URL of selected target language
        // or other necessary actions.
        // Note. This replacement logic is to transform http://example.com/page_en.html to http://example.com/page_de.html
        // and vice versa.
        window.location.href = window.location.href.replace(/page_\w+/, 'page_' + selectedLanguage)
        // For example, for page https://example.com/en/news to transform to https://example.com/de/news
        // window.location.href = window.location.href.replace(/example.com\/\w+/, "/example.com/" + selectedLanguage)
      }
    }
    resolve(translationHandled)
  })
}

WebsiteTranslator.Initialize()
