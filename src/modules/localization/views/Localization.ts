import { App } from "../../../App";
import { Module } from "../../../types/Module";
import { LocalizationListener } from "./LocalizationListener";
import { TRANSLATIONS } from "./translations";

export class Localization implements Module {
    private translations: Record<string, Record<string, string>> = TRANSLATIONS;
    private currentLanguage: string = "en";
    private app: App | null = null;
    private listeners: Array<LocalizationListener> = [];
    initialize(app: App) {
        this.app = app;
    }
    registerTranslations(language: string, translations: Record<string, string>): void {
        this.translations[language] = { ...(this.translations[language] || {}), ...translations };
;
    }

    translate(key: string): string {
        // loading language from dictionary
        const translation = this.translations[this.currentLanguage] || null;

        // if no language, returning the original key
        if (!translation) return key;

        return translation[key] || key;
    }

    setLanguage(language: string): void {
        this.currentLanguage = language;
        this.listeners.forEach(l => l.onLanguageChange(language));
       
    }
    subcribe(listener: LocalizationListener) {
        this.listeners.push(listener);
    }
    unsubscribe(listener: LocalizationListener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}
