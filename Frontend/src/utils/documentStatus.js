// Utility functions for managing document acceptance status

const STORAGE_KEY = 'acceptedDocuments';

/**
 * Check if a document is already accepted
 * @param {string} invoiceId - The invoice ID to check
 * @returns {boolean} - True if document is accepted
 */
export const isDocumentAccepted = (invoiceId) => {
  if (!invoiceId) return false;
  
  try {
    const acceptedDocuments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return acceptedDocuments.includes(invoiceId);
  } catch (error) {
    console.error('Error checking document acceptance status:', error);
    return false;
  }
};

/**
 * Mark a document as accepted
 * @param {string} invoiceId - The invoice ID to mark as accepted
 */
export const markDocumentAsAccepted = (invoiceId) => {
  if (!invoiceId) return;
  
  try {
    const acceptedDocuments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!acceptedDocuments.includes(invoiceId)) {
      acceptedDocuments.push(invoiceId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(acceptedDocuments));
    }
  } catch (error) {
    console.error('Error marking document as accepted:', error);
  }
};

/**
 * Remove a document from accepted list (if needed for testing or admin functions)
 * @param {string} invoiceId - The invoice ID to remove
 */
export const removeDocumentAcceptance = (invoiceId) => {
  if (!invoiceId) return;
  
  try {
    const acceptedDocuments = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const updatedDocuments = acceptedDocuments.filter(id => id !== invoiceId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDocuments));
  } catch (error) {
    console.error('Error removing document acceptance:', error);
  }
};

/**
 * Get all accepted document IDs
 * @returns {string[]} - Array of accepted document IDs
 */
export const getAcceptedDocuments = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Error getting accepted documents:', error);
    return [];
  }
};

/**
 * Clear all accepted documents (for admin or reset purposes)
 */
export const clearAllAcceptedDocuments = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing accepted documents:', error);
  }
};