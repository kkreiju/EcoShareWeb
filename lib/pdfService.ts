import jsPDF from 'jspdf';
import { addPoppinsFonts } from './poppins-font';

interface ReceiptData {
  planName: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  transactionId: string;
  invoiceNumber: string;
  billingDetails: {
    firstName: string;
    lastName: string;
    address: string;
  };
}

export const generateReceiptPDF = async (data: ReceiptData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Load Poppins fonts
  const fontsLoaded = await addPoppinsFonts(doc);
  const fontFamily = fontsLoaded ? 'Poppins' : 'helvetica';

  // Header with Logo and Text
  doc.setFontSize(24);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(0, 0, 0);
  
  const text = 'EcoShare';
  const textWidth = doc.getTextWidth(text);
  const logoSize = 12;
  const spacing = 3;
  const totalWidth = logoSize + spacing + textWidth;
  const startX = (pageWidth - totalWidth) / 2;
  
  try {
    const logoImg = '/icons/ic_leaf.png';
    doc.addImage(logoImg, 'PNG', startX, yPos - logoSize + 3, logoSize, logoSize);
  } catch (error) {
    console.error('Failed to load logo image:', error);
  }
  
  doc.text(text, startX + logoSize + spacing, yPos);
  
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont(fontFamily, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Subscription Receipt', pageWidth / 2, yPos, { align: 'center' });
  
  // Line separator
  yPos += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  // Receipt Details
  yPos += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  
  // Plan
  doc.setFont(fontFamily, 'normal');
  doc.text('Plan:', 20, yPos);
  doc.setFont(fontFamily, 'bold');
  doc.text(data.planName, pageWidth - 20, yPos, { align: 'right' });
  
  // Amount
  yPos += 10;
  doc.setFont(fontFamily, 'normal');
  doc.text('Amount:', 20, yPos);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(34, 197, 94); // Green color
  doc.text(`${formatCurrency(data.amount, data.currency)}/month`, pageWidth - 20, yPos, { align: 'right' });
  
  // Date
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont(fontFamily, 'normal');
  doc.text('Date:', 20, yPos);
  doc.setFont(fontFamily, 'bold');
  doc.text(data.date, pageWidth - 20, yPos, { align: 'right' });
  
  // Status
  yPos += 10;
  doc.setFont(fontFamily, 'normal');
  doc.text('Status:', 20, yPos);
  doc.setFont(fontFamily, 'bold');
  const statusColor = getStatusPDFColor(data.status);
  doc.setTextColor(statusColor.r, statusColor.g, statusColor.b);
  doc.text(data.status, pageWidth - 20, yPos, { align: 'right' });
  
  // Transaction ID
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont(fontFamily, 'normal');
  doc.text('Transaction ID:', 20, yPos);
  doc.setFont(fontFamily, 'normal');
  doc.setFontSize(10);
  doc.text(data.transactionId, pageWidth - 20, yPos, { align: 'right' });
  
  // Invoice Number
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont(fontFamily, 'normal');
  doc.text('Invoice #:', 20, yPos);
  doc.setFont(fontFamily, 'normal');
  doc.setFontSize(10);
  doc.text(data.invoiceNumber, pageWidth - 20, yPos, { align: 'right' });
  
  // Billing Information Section
  yPos += 20;
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(20, yPos - 5, pageWidth - 40, 30, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(34, 197, 94); // Green color
  doc.text('Billing Information', 25, yPos + 3);
  
  yPos += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFont(fontFamily, 'bold');
  doc.text(`${data.billingDetails.firstName} ${data.billingDetails.lastName}`, 25, yPos + 3);
  
  yPos += 7;
  doc.setFont(fontFamily, 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  const addressLines = doc.splitTextToSize(data.billingDetails.address, pageWidth - 50);
  doc.text(addressLines, 25, yPos + 3);
  
  // Thank You Message
  yPos += 30;
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont(fontFamily, 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Thank you for choosing EcoShare Premium!', pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 7;
  doc.setFontSize(9);
  doc.setFont(fontFamily, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Your support helps us create a more sustainable future.', pageWidth / 2, yPos, { align: 'center' });
  
  // Footer
  yPos = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('EcoShare - Food Waste Reduction Platform', pageWidth / 2, yPos, { align: 'center' });
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos + 5, { align: 'center' });
  
  // Save the PDF
  doc.save(`EcoShare-Receipt-${data.invoiceNumber}.pdf`);
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

const getStatusPDFColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('success')) {
    return { r: 34, g: 197, b: 94 }; // Green
  } else if (statusLower.includes('fail') || statusLower.includes('cancel')) {
    return { r: 239, g: 68, b: 68 }; // Red
  } else if (statusLower.includes('pending')) {
    return { r: 234, g: 179, b: 8 }; // Yellow
  } else {
    return { r: 100, g: 100, b: 100 }; // Gray
  }
};

