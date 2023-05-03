/* eslint no-console: "warn" */
import languages from '../../localization/localization'

export class TextLocalization {
  public mergeLocalized (lang:string, contents:object) {
    const base = JSON.parse(JSON.stringify(languages[lang]))
    this.merge(base, contents)

    console.log(JSON.stringify(base))
  }

  public extractUnlocalized () {
    const filesToDownoad:{ [key:string]:string; } = {}

    for (const lang in languages) {
      if (lang === 'en') {
        filesToDownoad[lang] = JSON.stringify(languages.en)
        continue
      }
      else {
        const localizationStats:{
            localized:number,
            missing:number
        } = {
          localized: 0,
          missing: 0
        }
        const baseLanguage = JSON.parse(JSON.stringify(languages.en))
        const targetLanguage = JSON.parse(JSON.stringify(languages[lang]))
        this.extractUnlocalizedLanguage(baseLanguage, targetLanguage, localizationStats)
        console.log(`lang: ${lang}`)
        console.log(`localized: ${localizationStats.localized}, missing: ${localizationStats.missing}`)

        filesToDownoad[lang] = JSON.stringify(baseLanguage)
      }
    }
    this.downloadAll(filesToDownoad)
  }

  private merge (base:any, target:any) {
    for (const key in base) {
      if (typeof (base[key]) === 'object') {
        this.merge(base[key], target[key])
      }
      else {
        if (target[key]) {
          base[key] = target[key]
        }
      }
    }
  }

  private pause (msec:number) {
    return new Promise(
      (resolve, reject) => {
        setTimeout(resolve, msec || 1000)
      }
    )
  }

  /**
   * Chrome only allows for 10 downloads, then it needs some pause, otherwise it wont work :)
   * @param filesToDownload
   */
  private async downloadAll (filesToDownload: { [key:string]:string; }) {
    let count = 0
    for (const lang in filesToDownload) {
      this.download(lang, filesToDownload[lang])

      if (++count >= 10) {
        await this.pause(1000)
        count = 0
      }
    }
    console.log('All downloads complete')
  }

  private download (lang: string, contents:string) {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(contents)
    const download = document.createElement('a')
    download.setAttribute('href', dataStr)
    download.setAttribute('download', `${lang}.json`)
    download.click()
  }

  /**
   * Remove keys from base language which are not localized
   * @param base
   * @param target
   * @param localizationStats
   */
  private extractUnlocalizedLanguage (base:any, target:any, localizationStats: { localized: number; missing: number }) {
    for (const key in base) {
      if (typeof (base[key]) === 'object') {
        this.extractUnlocalizedLanguage(base[key], target[key], localizationStats)
      }
      else {
        if (this.isLocalized(base[key], target[key])) {
          delete base[key]
          localizationStats.localized++
        }
        else {
          localizationStats.missing++
        }
      }
    }
  }

  private isLocalized (base:any, target:any) {
    return target && base !== target
  }
}
