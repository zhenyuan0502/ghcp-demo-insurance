import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { vi } from 'vitest';
import { LanguageContext, LanguageContextType } from '../i18n/LanguageContext';
import { Language, getTranslations } from '../i18n/translations';

export const createMockLanguageContext = (language: Language = 'vi'): LanguageContextType => ({
  language,
  setLanguage: vi.fn(),
  t: getTranslations(language),
});

export const renderWithProviders = (
  component: React.ReactElement,
  options?: {
    language?: Language;
    languageContext?: Partial<LanguageContextType>;
  }
) => {
  const theme = createTheme();
  const mockLanguageContext = createMockLanguageContext(options?.language);
  const languageContext = { ...mockLanguageContext, ...options?.languageContext };

  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <LanguageContext.Provider value={languageContext}>
          {component}
        </LanguageContext.Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
};