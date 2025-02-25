# Translator

Simple translation library for Angular.

## Install

```
npm install @waddahex/translator
```

## Setup
``` ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import { provideTranslator, TranslatorConfig } from "@waddahex/translator";

const translatorConfig: TranslatorConfig = {
  supportedLanguages: ['en', 'pt'],
  defaultLanguage: 'en',
  translations: {
    en: {
      app: {
        language: "Language",
        default: "Default",
        message: "Hello world!"
      },
      languages: {
        en: "English",
        pt: "Portuguese",
      }
    },
    pt: {
      app: {
        language: "Idioma",
        default: "Padrão",
        message: "Ola mundo!"
      },
      languages: {
        en: "Inglês",
        pt: "Português"
      }
    }
  }
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTranslator(translatorConfig)
  ]
};
```

## Usage

``` ts
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Translation, TranslatorService } from "@waddahex/translator";
import { Observable } from "rxjs";

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TranslatorComponent {
  private translator: TranslatorService;
  public translation$: Observable<Translation>;
  public preferredLanguage$: Observable<string>;

  constructor(){
    this.translator = inject(TranslatorService);
    this.translation$ = this.translator.translation$;
    this.preferredLanguage$ = this.translator.preferredLanguage$;
  }

  public updateLanguage(language: string){
    this.translator.setPreferredLanguage(language === "default" ?
      this.translator.getDefaultLanguage() :
      language
    );

    language === "default" ?
      localStorage.removeItem("preferredLanguage") :
      localStorage.setItem("preferredLanguage", language);
  }

  public getSupportedLanguages(languages: {[key: string]: string}){
    return Object.keys(languages);
  }
}
```

``` html
@if(translation$ | async; as translation)
{
  <div class="flex gap-1 items-center">
    <label for="language" class="font-medium text-xs">
      {{translation["app"]["language"]}}
    </label>
    <select
      name="language"
      id="language"
      [ngModel]="preferredLanguage$ | async"
      (ngModelChange)="updateLanguage($event)"
      class="text-sm px-2 py-1"
    >
      <option value="default">{{translation["app"]["default"]}}</option>
      @for(language of getSupportedLanguages(translation["languages"]); track $index)
      {
        <option [value]="language">{{translation["languages"][language]}}</option>
      }
    </select>
  </div>
}
```