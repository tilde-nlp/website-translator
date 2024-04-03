import { IWebsiteLanguageDirection } from './IWebsiteLanguageDirection'

export default interface IConfiguration{
    id:string,
    languageDirections: Array<IWebsiteLanguageDirection>,
    siteUrls: Array<string>
}
