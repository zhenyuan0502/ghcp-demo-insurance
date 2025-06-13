import viTranslations from './vi_vn.json';
import enTranslations from './en_us.json';

export type Language = 'vi' | 'en';

export interface Translations {
  common: {
    currency: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    save: string;
  };
  navbar: {
    title: string;
    home: string;
    quote: string;
    dashboard: string;
    switchToDark: string;
    switchToLight: string;
    switchToVietnamese: string;
    switchToEnglish: string;
  };
  home: {
    title: string;
    subtitle: string;
    getQuoteButton: string;
    lifeInsurance: {
      title: string;
      description: string;
    };
    autoInsurance: {
      title: string;
      description: string;
    };
    homeInsurance: {
      title: string;
      description: string;
    };
  };
  quote: {
    title: string;
    productType: string;
    purchaserInfo: string;
    insuredInfo: string;
    sameAsInsured: string;
    gender: string;
    age: string;
    occupation: string;
    paymentYears: string;
    monthlyPremium: string;
    yearlyPremium: string;
    insuranceAmount: string;
    submitButton: string;
    validation: {
      selectProduct: string;
      enterGender: string;
      enterAge: string;
      enterOccupation: string;
      enterAmount: string;
      enterMonthlyPremium: string;
      enterYearlyPremium: string;
    };
    notifications: {
      submitSuccess: string;
      submitError: string;
    };
  };
  dashboard: {
    title: string;
    actions: string;
    totalQuotes: string;
    pendingQuotes: string;
    approvedQuotes: string;
    status: {
      pending: string;
      approved: string;
      rejected: string;
      expired: string;
      unknown: string;
    };
    statusActions: {
      approve: string;
      reject: string;
      markPending: string;
    };
    notifications: {
      updateSuccess: string;
      updateError: string;
      deleteSuccess: string;
      deleteError: string;
    };
    deleteDialog: {
      title: string;
      message: string;
    };
  };
  insuranceTypes: {
    health: string;
    life: string;
    auto: string;
    home: string;
    travel: string;
    other: string;
  };
  table: {
    columns: {
      purchaserName: string;
      insuredName: string;
      insuranceType: string;
      coverageAmount: string;
      premium: string;
      status: string;
      createdAt: string;
    };
    actions: {
      viewDetails: string;
      edit: string;
      delete: string;
    };
    defaultValues: {
      customer: string;
      insuredPerson: string;
    };
    boolean: {
      yes: string;
      no: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  vi: viTranslations as Translations,
  en: enTranslations as Translations,
};

export const getTranslations = (language: Language): Translations => {
  return translations[language];
};