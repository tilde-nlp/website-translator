import { IWebsiteLanguage } from './IWebsiteLanguage'

export default interface IConfiguration{
    id:string
    srcLang:string,
    languages: Array<IWebsiteLanguage>,
    siteUrls: Array<string>
}
