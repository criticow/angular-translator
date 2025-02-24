import { Provider } from "@angular/core";
import { TRANSLATOR_CONFIG, TranslatorConfig, TranslatorService } from "./translator.service";

export function provideTranslator(config: TranslatorConfig): Provider[] {
  return [
    { provide: TRANSLATOR_CONFIG, useValue: config },
    {
      provide: TranslatorService,
      useClass: TranslatorService,
      deps: [TRANSLATOR_CONFIG]
    }
  ]
}