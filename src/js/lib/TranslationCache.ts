
let CACHE:{[key:string]:string} = {}

export default class TranslationCache {
  public get (key:string, language:string):string {
    return CACHE[`${language}-${key}`]
  }

  public set (key:string, language:string, value:string) {
    CACHE[`${language}-${key}`] = value
  }

  public clear () {
    CACHE = {}
  }
}
