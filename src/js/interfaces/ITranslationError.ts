export interface ITranslationError {
    ErrorCode: string,
    ErrorMessage: string | {
        error?: {
            message?: string
        }
    }
}
