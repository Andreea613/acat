export interface LocalizationModule {
    registerTranslations(language: string, translations: Record<string, string>): void;
    translate(key: string, values?: Record<string, string>): string;
}
