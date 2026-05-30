import type { PostProcessorModule } from 'i18next';
import { normalizeWesternDigits } from '@hirra/shared';

/** Ensures all Arabic UI copy uses Western digits (0-9). */
export const westernDigitsPostProcessor: PostProcessorModule = {
  type: 'postProcessor',
  name: 'westernDigits',
  process(value: string, _key, _options, translator) {
    if (translator.language !== 'ar') return value;
    return normalizeWesternDigits(value);
  },
};
