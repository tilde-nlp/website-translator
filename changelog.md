# Changelog

All notable changes to the Website Translator Widget are documented here.

These release iterations are published under the npm `beta` dist-tag.

## [8.3.0]

### Added

- Added support for translating content in open Shadow DOM roots, including nested roots and dynamically inserted or replaced content.
- Added observation of dynamically created Shadow DOM roots and same-origin iframe documents.
- Added the `translation.dynamicContentDiscoveryDelayMs` integration option for configuring the inactivity window in single-batch and word-count modes.

### Changed

- Improved discovery and restoration of dynamically updated SPA content and translatable attributes.
- Improved translation of dynamically loaded same-origin iframes.
- Preserved the existing 5000 ms dynamic content discovery delay as the default.
- Prevented empty discovery passes from postponing pending dynamic translation batches.

## [8.2.0]

### Added

- Added authentication using short-lived widget tokens.
- Added in-memory token caching and automatic refresh.
- Added token-based authorization for translation and word-count requests.
- Added automatic token renewal and request retry after unauthorized responses.

## [8.1.0]

### Added

- Added page-level word-count reporting.
- Added the `WORD_COUNT` widget execution mode.
- Added support for discovering and reporting translatable page segments without translating them.

## [8.0.0]

### Changed

- Introduced batch translation to provide the translation engine with more context.
- Grouped related page segments into structured translation requests.
- Improved translation quality and consistency across related content.
- Added alignment handling to map translated batch content back to the correct page elements.
