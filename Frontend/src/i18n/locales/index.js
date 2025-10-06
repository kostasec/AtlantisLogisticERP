import enCommon from './en/common';
import enInvoice from './en/invoice';
import enFinance from './en/finance';
import enLogistics from './en/logistics';
import enStatus from './en/status';
import enClient from './en/client';

import serCommon from './ser/common';
import serInvoice from './ser/invoice';
import serFinance from './ser/finance';
import serLogistics from './ser/logistics';
import serStatus from './ser/status';
import serClient from './ser/client';

// Merge domain modules per language
const en = { ...enCommon, ...enInvoice, ...enFinance, ...enLogistics, ...enStatus, ...enClient };
const ser = { ...serCommon, ...serInvoice, ...serFinance, ...serLogistics, ...serStatus, ...serClient };

export const modularResources = {
  en: { translation: en },
  ser: { translation: ser }
};

export const availableLanguages = ['en', 'ser'];
