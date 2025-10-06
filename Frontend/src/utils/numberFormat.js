
export const EUROPEAN_NUMBER_PATTERN = "[0-9]{1,3}(\\.[0-9]{3})*,[0-9]{2}";
export const NUMBER_FORMAT_TITLE = "Format: 1.234,56";

/**
 * Formatira broj u evropski format (1.234,56)
 * @param {string} value - Vrednost za formatiranje
 * @returns {string} - Formatirana vrednost
 */
export const formatNumber = (value) => {
  const cleaned = value.replace(/[^\d,]/g, '');
  const parts = cleaned.split(',');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts[1] !== undefined ? `${intPart},${parts[1].slice(0,2)}` : intPart;
};

/**
 * Parsira evropski format broja u decimalni broj
 * @param {string} value - Vrednost u evropskom formatu (1.234,56)
 * @returns {number} - Decimalni broj (1234.56)
 */
export const parseEuropeanNumber = (value) => {
  if (!value || value === '') return 0;
  return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
};

/**
 * Helper objekat za input props sa validacijom
 */
export const numberInputProps = {
  pattern: EUROPEAN_NUMBER_PATTERN,
  title: NUMBER_FORMAT_TITLE
};

/**
 * Kreira onChange handler za automatsko formatiranje
 * @param {Function} setValue - react-hook-form setValue funkcija (opciono)
 * @param {string} fieldName - Naziv polja (opciono)
 * @returns {Function} - onChange handler funkcija
 */
export const createNumberInputHandler = (setValue, fieldName) => {
  return (e) => {
    const formatted = formatNumber(e.target.value);
    if (formatted !== e.target.value) {
      e.target.value = formatted;
      // Ako je proslijeđen setValue, ažuriraj i react-hook-form
      if (setValue && fieldName) {
        setValue(fieldName, formatted);
      }
    }
  };
};