import { TestBed } from '@angular/core/testing';

import { TranslatorConfig, TRANSLATOR_CONFIG, TranslatorService } from './translator.service';

const mockConfig: TranslatorConfig = {
  supportedLanguages: ["en", "pt"],
  defaultLanguage: "en",
  translations: {
    en: {
      "menu": {
        "home": "Home",
        "about": "About"
      },
      "/": {
        "button": "Botão"
      }
    },
    pt: {
      "menu": {
        "home": "Início",
        "about": "Sobre"
      },
      "/": {
        "button": "Button"
      }
    }
  }
};

describe('TranslatorService', () => {
  let service: TranslatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: TRANSLATOR_CONFIG, useValue: mockConfig},
        TranslatorService
      ]
    });
    service = TestBed.inject(TranslatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default language', () => {
    expect(service.getDefaultLanguage()).toBe("en");
  })

  it('should initialize with preferred language as default language', () => {
    expect(service.getPreferredLanguage()).toBe(service.getDefaultLanguage());
  })

  it('should allow to change default language', () => {
    service.setDefaultLanguage('pt');
    expect(service.getDefaultLanguage()).toBe('pt');
  })

  it('should allow setting preferred language', () => {
    service.setPreferredLanguage('pt');
    expect(service.getPreferredLanguage()).toBe('pt');
  });

  it('should initialize source translation correctly', () => {
    expect(service.getTranslations()).toEqual(mockConfig.translations);
  });

  it('should throw error if default language is not in the supported languages', () => {
    const language = "fr";
    expect(() => service.setDefaultLanguage(language)).toThrowError(`Language "${language}" is not in the supported languages: ${mockConfig.supportedLanguages.join(', ')}`);
  });

  it('should throw error if preferred language is not in the supported languages', () => {
    const language = "fr";
    expect(() => service.setPreferredLanguage(language)).toThrowError(`Language "${language}" is not in the supported languages: ${mockConfig.supportedLanguages.join(', ')}`);
  });

  it('should update translation based on preferred language', () => {
    service.setPreferredLanguage('en');
    expect(service.getTranslation()).toEqual(mockConfig.translations['en']);

    service.setPreferredLanguage('pt');
    expect(service.getTranslation()).toEqual(mockConfig.translations['pt']);
  });
});

describe('TranslatorService with invalid config', () => {
  const invalidConfig: TranslatorConfig = {
    supportedLanguages: ["en", "pt"],
    defaultLanguage: "fr", // default language not supported
    translations: {
      en: {
        "menu": {
          "home": "Home",
          "about": "About"
        }
      },
      pt: {
        "menu": {
          "home": "Início",
          "about": "Sobre"
        }
      }
    }
  };

  it('should throw error if default language is not in the supported languages', () => {
    expect(() => 
      TestBed.configureTestingModule({
        providers: [
          {provide: TRANSLATOR_CONFIG, useValue: invalidConfig},
          TranslatorService
        ]
      }).inject(TranslatorService)
    ).toThrowError(`Language "${invalidConfig.defaultLanguage}" is not in the supported languages: ${invalidConfig.supportedLanguages.join(', ')}`)
  });
});