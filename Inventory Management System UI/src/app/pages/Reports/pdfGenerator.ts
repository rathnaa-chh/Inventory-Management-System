import jsPDF from 'jspdf';
import { Product, ReportMetrics } from './types';
import { getProductStatus, formatCurrency } from './reportUtils';

interface PDFCardData {
  label: string;
  value: string | number;
  color: [number, number, number];
}

const PDF_CONFIG = {
  pageMargin: 15,
  lineHeight: 6,
  rowHeight: 5.5,
  colors: {
    primary: [59, 130, 246] as [number, number, number],
    dark: [15, 23, 42] as [number, number, number],
    lightBg: [248, 250, 252] as [number, number, number],
    success: [16, 185, 129] as [number, number, number],
    warning: [245, 158, 11] as [number, number, number],
    danger: [239, 68, 68] as [number, number, number],
  },
};

const generatePDFHeader = (pdf: jsPDF, pageWidth: number, now: Date): number => {
  let yPosition = 10;

  // Top bar with gradient effect (using rectangles)
  pdf.setFillColor(...PDF_CONFIG.colors.dark);
  pdf.rect(0, 0, pageWidth, 20, 'F');

  // Title
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Inventory Management System', PDF_CONFIG.pageMargin, 12);

  // Subtitle
  pdf.setTextColor(200, 220, 255);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Inventory Report', PDF_CONFIG.pageMargin, 17);

  // Report info (right side)
  pdf.setTextColor(200, 220, 255);
  pdf.setFontSize(8);
  const dateStr = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.text(`Report Date: ${dateStr}`, pageWidth - PDF_CONFIG.pageMargin, 12, { align: 'right' });
  pdf.text(`Time: ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, 
    pageWidth - PDF_CONFIG.pageMargin, 16, { align: 'right' });

  yPosition = 25;

  // Reset text color
  pdf.setTextColor(0, 0, 0);

  return yPosition;
};

const generatePDFMetricsCards = (
  pdf: jsPDF,
  pageWidth: number,
  yPosition: number,
  metrics: ReportMetrics
): number => {
  const cardWidth = (pageWidth - 30) / 4;
  const cardHeight = 22;

  const cardData: PDFCardData[] = [
    { label: 'Total Stock In', value: metrics.totalStockIn, color: PDF_CONFIG.colors.primary },
    { label: 'Total Stock Out', value: metrics.totalStockOut, color: [99, 102, 241] },
    { label: 'Net Movement', value: metrics.netMovement, color: metrics.netMovement >= 0 ? PDF_CONFIG.colors.success : PDF_CONFIG.colors.danger },
    { label: 'Inventory Value', value: `$${(metrics.inventoryValue / 1000).toFixed(0)}K`, color: PDF_CONFIG.colors.warning },
  ];

  pdf.setFontSize(7);
  cardData.forEach((card, index) => {
    const x = PDF_CONFIG.pageMargin + index * cardWidth;

    // Card background
    pdf.setFillColor(245, 250, 255);
    pdf.rect(x, yPosition, cardWidth - 2, cardHeight, 'F');

    // Card border with color
    pdf.setDrawColor(...card.color);
    pdf.setLineWidth(0.5);
    pdf.rect(x, yPosition, cardWidth - 2, cardHeight);

    // Label
    pdf.setTextColor(100, 116, 139);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text(card.label, x + 3, yPosition + 5);

    // Value
    pdf.setTextColor(...card.color);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(String(card.value), x + 3, yPosition + 16);
  });

  pdf.setLineWidth(0.3);
  pdf.setDrawColor(200, 213, 228);
  pdf.line(PDF_CONFIG.pageMargin, yPosition + cardHeight + 3, pageWidth - PDF_CONFIG.pageMargin, yPosition + cardHeight + 3);

  return yPosition + cardHeight + 8;
};

const generatePDFTableHeader = (
  pdf: jsPDF,
  pageWidth: number,
  yPosition: number,
  headers: string[],
  columnWidths: number[]
): number => {
  // Header background
  pdf.setFillColor(...PDF_CONFIG.colors.dark);
  pdf.rect(PDF_CONFIG.pageMargin, yPosition - 4, pageWidth - 30, 7, 'F');

  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(255, 255, 255);

  let xPos = PDF_CONFIG.pageMargin;
  headers.forEach((header, index) => {
    pdf.text(header, xPos + 1, yPosition + 1, { maxWidth: columnWidths[index] - 2 });
    xPos += columnWidths[index];
  });

  yPosition += 5;
  pdf.setLineWidth(0.5);
  pdf.setDrawColor(...PDF_CONFIG.colors.primary);
  pdf.line(PDF_CONFIG.pageMargin, yPosition, pageWidth - PDF_CONFIG.pageMargin, yPosition);

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(7.5);

  return yPosition + 3;
};

const generatePDFProductRows = (
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  yPosition: number,
  products: Product[],
  headers: string[],
  columnWidths: number[]
): number => {
  let currentPage = 1;
  let rowCount = 0;

  products.forEach((p, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 25) {
      // Footer
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${currentPage}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

      // Add new page
      pdf.addPage();
      currentPage++;
      yPosition = 20;

      // Re-add header on new page
      pdf.setFillColor(...PDF_CONFIG.colors.dark);
      pdf.rect(PDF_CONFIG.pageMargin, yPosition - 4, pageWidth - 30, 7, 'F');

      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);

      let xPos = PDF_CONFIG.pageMargin;
      headers.forEach((header, i) => {
        pdf.text(header, xPos + 1, yPosition + 1, { maxWidth: columnWidths[i] - 2 });
        xPos += columnWidths[i];
      });
      yPosition += 5;

      pdf.setLineWidth(0.5);
      pdf.setDrawColor(...PDF_CONFIG.colors.primary);
      pdf.line(PDF_CONFIG.pageMargin, yPosition, pageWidth - PDF_CONFIG.pageMargin, yPosition);
      yPosition += 3;

      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(7.5);
    }

    const status = getProductStatus(p);
    const rowData = [
      status.label,
      String(p.id),
      p.name,
      p.category?.name || 'N/A',
      `$${p.price}`,
      String(p.quantity),
      `$${(p.price * p.quantity).toLocaleString()}`,
      // String(p.reorder_level || 10),
      p.supplier || 'N/A',
    ];

    // Alternating row colors
    if (rowCount % 2 === 0) {
      pdf.setFillColor(...PDF_CONFIG.colors.lightBg);
      pdf.rect(PDF_CONFIG.pageMargin, yPosition - 4.5, pageWidth - 30, PDF_CONFIG.rowHeight, 'F');
    }

    let xPos = PDF_CONFIG.pageMargin;
    rowData.forEach((cell, colIndex) => {
      pdf.text(String(cell), xPos + 1, yPosition, { maxWidth: columnWidths[colIndex] - 2 });
      xPos += columnWidths[colIndex];
    });

    yPosition += PDF_CONFIG.rowHeight;
    rowCount++;
  });

  return yPosition;
};

const generatePDFFooter = (pdf: jsPDF, pageWidth: number, pageHeight: number): void => {
  // Footer bar
  pdf.setFillColor(...PDF_CONFIG.colors.lightBg);
  pdf.rect(0, pageHeight - 12, pageWidth, 12, 'F');

  pdf.setLineWidth(0.5);
  pdf.setDrawColor(...PDF_CONFIG.colors.primary);
  pdf.line(0, pageHeight - 12, pageWidth, pageHeight - 12);

  // Footer text
  pdf.setFontSize(7);
  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'normal');

  const footerText = '© 2026 Inventory Management System | Professional Inventory Report | System Generated';
  pdf.text(footerText, pageWidth / 2, pageHeight - 6, { align: 'center' });
};

export const generateInventoryPDF = (products: Product[], metrics: ReportMetrics): void => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const now = new Date();

  let yPosition = generatePDFHeader(pdf, pageWidth, now);
  yPosition = generatePDFMetricsCards(pdf, pageWidth, yPosition, metrics);

  // Add "Inventory Details" section title
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...PDF_CONFIG.colors.dark);
  pdf.text('Inventory Details', PDF_CONFIG.pageMargin, yPosition);
  yPosition += 6;

  const tableHeaders = ['STATUS', 'ID', 'NAME', 'CATEGORY', 'PRICE', 'QTY', 'VALUE', 'SUPPLIER'];
  const columnWidths = [14, 10, 26, 26, 18, 16, 18, 18];

  yPosition = generatePDFTableHeader(pdf, pageWidth, yPosition, tableHeaders, columnWidths);
  yPosition = generatePDFProductRows(pdf, pageWidth, pageHeight, yPosition, products, tableHeaders, columnWidths);

  // Add footer to last page
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  const totalPages = pdf.internal.pages.length - 1;
  pdf.text(`Page ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

  generatePDFFooter(pdf, pageWidth, pageHeight);

  pdf.save(`Inventory_Report_${now.getTime()}.pdf`);
};
