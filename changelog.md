# Changelog

All notable changes to the Website Translator Widget are documented here.

These release iterations are published under the npm `beta` dist-tag.

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
