import { jsPDF } from 'jspdf';

/**
 * Helper to load font file and convert to base64
 */
const loadFontAsBase64 = async (fontPath: string): Promise<string> => {
  try {
    const response = await fetch(fontPath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to load font:', error);
    throw error;
  }
};

/**
 * Add Poppins fonts to jsPDF document
 */
export const addPoppinsFonts = async (doc: jsPDF) => {
  try {
    // Load Poppins Regular
    const poppinsRegular = await loadFontAsBase64('/fonts/Poppins-Regular.ttf');
    doc.addFileToVFS('Poppins-Regular.ttf', poppinsRegular);
    doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');

    // Load Poppins Bold
    const poppinsBold = await loadFontAsBase64('/fonts/Poppins-Bold.ttf');
    doc.addFileToVFS('Poppins-Bold.ttf', poppinsBold);
    doc.addFont('Poppins-Bold.ttf', 'Poppins', 'bold');

    return true;
  } catch (error) {
    console.error('Failed to add Poppins fonts:', error);
    return false;
  }
};

