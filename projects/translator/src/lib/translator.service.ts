import { Inject, inject, Injectable, InjectionToken } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject, filter, Observable } from "rxjs";

export type Translation = {[key: string]: {[key: string]: string}};
export type Translations = {[key:string]: Translation};

export type TranslatorConfig = {
  supportedLanguages: string[];
  defaultLanguage: string;
  translations: Translations;
};

export const TRANSLATOR_CONFIG = new InjectionToken<TranslatorConfig>("TRANSLATOR_CONFIG");

@Injectable({
  providedIn: 'root'
})
export class TranslatorService {
  private config: TranslatorConfig;
  private defaultLanguageSubject: BehaviorSubject<string>;
  public defaultLanguage$: Observable<string>;
  private preferredLanguageSubject: BehaviorSubject<string>;
  public preferredLanguage$: Observable<string>;

  private translationsSubject: BehaviorSubject<Translations>;
  public translations$: Observable<Translations>;
  private translationSubject: BehaviorSubject<Translation>;
  public translation$: Observable<Translation>;

  constructor(@Inject(TRANSLATOR_CONFIG) config: TranslatorConfig){
    this.defaultLanguageSubject = new BehaviorSubject<string>('');
    this.defaultLanguage$ = this.defaultLanguageSubject.asObservable();
    this.preferredLanguageSubject = new BehaviorSubject<string>('');
    this.preferredLanguage$ = this.preferredLanguageSubject.asObservable();
    this.translationsSubject = new BehaviorSubject<Translations>({});
    this.translations$ = this.translationsSubject.asObservable();
    this.translationSubject = new BehaviorSubject<Translation>({});
    this.translation$ = this.translationSubject.asObservable();
    this.translationsSubject.next(config.translations);

    this.config = config;
    
    this.setDefaultLanguage(config.defaultLanguage);
    this.setPreferredLanguage(config.defaultLanguage);
  }

  public setTranslations(translations: Translations){
    this.translationsSubject.next(translations);
  }

  public getTranslations(){
    return this.translationsSubject.getValue();
  }

  public setDefaultLanguage(language: string){
    this.defaultLanguageSubject.next(language);
    this.updateTranslation();
  }

  public getDefaultLanguage(){
    return this.defaultLanguageSubject.getValue();
  }

  public setPreferredLanguage(language: string){
    this.preferredLanguageSubject.next(language);
    this.updateTranslation();
  }

  public getTranslation(){
    return this.translationSubject.getValue();
  }

  public getPreferredLanguage(){
    return this.preferredLanguageSubject.getValue();
  }

  private updateTranslation(){
    const translations = this.getTranslations();
    const preferredLanguage = this.getPreferredLanguage();
    const translation = translations[preferredLanguage];

    this.translationSubject.next(translation);
  }
}