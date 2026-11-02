import { describe, expect, it } from '@jest/globals'
import { TranslatableItemType } from '../enums/TranslatableItemType'
import { ITranslatableItem } from '../interfaces/ITranslatableItem'
import { TranslationTextRange } from '../models/TranslationTextRange'
import { classifySegment } from './ContentClassifier'

function itemFor (element:HTMLElement, type = TranslatableItemType.ELEMENT, description:string = null):ITranslatableItem {
  const range = new TranslationTextRange()
  range.element = element

  return {
    attributeName: null,
    description,
    tagName: element.tagName,
    text: element.textContent || '',
    translatableItem: range,
    type
  }
}

describe('ContentClassifier', () => {
  it.each([
    ['h1', 'HEADING'],
    ['p', 'PARAGRAPH'],
    ['button', 'BUTTON'],
    ['a', 'LINK'],
    ['label', 'INPUT'],
    ['li', 'LIST'],
    ['th', 'TABLE'],
    ['figcaption', 'MEDIA'],
    ['div', 'OTHER']
  ])('classifies the %s element as %s', (tagName, expectedType) => {
    const element = document.createElement(tagName)

    expect(classifySegment(itemFor(element), 'g1').elementType).toBe(expectedType)
  })

  it('collects multiple semantic and ARIA content locations', () => {
    document.body.innerHTML = '<header><nav><main><p>Text</p></main></nav></header>'
    const paragraph = document.querySelector('p') as HTMLElement

    expect(classifySegment(itemFor(paragraph), 'g7')).toEqual({
      id: 'g7',
      contentLocations: ['MAIN_CONTENT', 'NAVIGATION', 'HEADER'],
      elementType: 'PARAGRAPH'
    })
  })

  it.each([
    ['<nav><span>Text</span></nav>', 'NAVIGATION'],
    ['<div role="banner"><span>Text</span></div>', 'HEADER'],
    ['<footer><span>Text</span></footer>', 'FOOTER'],
    ['<form><span>Text</span></form>', 'FORM'],
    ['<main><span>Text</span></main>', 'MAIN_CONTENT'],
    ['<div role="alertdialog"><span>Text</span></div>', 'DIALOG'],
    ['<section><span>Text</span></section>', 'OTHER']
  ])('classifies the content location for %s', (html, expectedLocation) => {
    document.body.innerHTML = html
    const element = document.querySelector('span') as HTMLElement

    expect(classifySegment(itemFor(element), 'g1').contentLocations).toEqual([expectedLocation])
  })

  it('classifies dynamic form, dialog, footer and breadcrumb contexts from the current DOM', () => {
    const input = document.createElement('input')
    const dialog = document.createElement('div')
    dialog.setAttribute('role', 'dialog')
    const footer = document.createElement('footer')
    footer.setAttribute('aria-label', 'Breadcrumb')
    footer.appendChild(dialog)
    document.body.appendChild(footer)
    dialog.appendChild(input)

    expect(classifySegment(itemFor(input), 'g1')).toEqual({
      id: 'g1',
      contentLocations: ['DIALOG', 'NAVIGATION', 'FOOTER', 'FORM'],
      elementType: 'INPUT'
    })

    const form = document.createElement('form')
    form.appendChild(input)
    document.body.appendChild(form)
    expect(classifySegment(itemFor(input), 'g1').contentLocations).toEqual(['FORM'])
  })

  it.each([
    [TranslatableItemType.ELEMENT_SEO, 'TITLE', null, 'PAGE_TITLE'],
    [TranslatableItemType.ATTRIBUTE_SEO, 'META', 'description', 'META_DESCRIPTION'],
    [TranslatableItemType.ATTRIBUTE_SEO, 'META', 'og:title', 'OG_TITLE'],
    [TranslatableItemType.ATTRIBUTE_SEO, 'META', 'og:description', 'OG_DESCRIPTION'],
    [TranslatableItemType.ATTRIBUTE_SEO, 'META', 'twitter:title', 'TWITTER_TITLE'],
    [TranslatableItemType.ATTRIBUTE_SEO, 'META', 'twitter:description', 'TWITTER_DESCRIPTION']
  ])('classifies SEO metadata without regular DOM labels', (type, tagName, description, seoType) => {
    const element = document.createElement(tagName)

    expect(classifySegment(itemFor(element, type, description), 'g1')).toEqual({
      id: 'g1',
      seoType
    })
  })

  it('falls back when no DOM element is available', () => {
    const item = itemFor(document.createElement('div'))
    item.translatableItem.element = null

    expect(classifySegment(item, 'g1')).toEqual({
      id: 'g1',
      contentLocations: ['OTHER'],
      elementType: 'OTHER'
    })
  })
})
