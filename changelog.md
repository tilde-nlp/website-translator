# Changelog

All notable changes to the Website Translator Widget are documented here.

These release iterations are published under the npm `beta` dist-tag.

## [8.4.0]

### Added

- Added detection of SPA navigation through `history.pushState`, `history.replaceState`, browser back and forward navigation, and hash changes.
- Added the `translation.languageUrlMode` option to let integrations choose `push`, `replace`, or host-managed (`none`) language URL handling.
- Added the `wt-crawler-discovery-complete` DOM event for signaling completion of single-batch and word-count discovery.

### Changed

- Added an SPA route translation lifecycle that invalidates previous-route work, restores surviving DOM, clears detached state, and reprocesses the committed route.
- Preserved cached translation strings across route changes while keeping explicit language changes as fresh translation executions.
- Refreshed canonical links, `hreflang` links, and localized URLs after SPA navigation.
- Improved dynamic content handling and test coverage for content inserted after initial translation.

### Fixed

- Prevented delayed, queued, and in-flight translation work from previous routes from modifying the current route.
- Prevented route translation from starting before the host SPA finishes rendering its destination view.
- Removed translation state associated with disconnected DOM elements.
- Prevented widget language changes from interfering with host-managed SPA routing when URL management is disabled.

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
