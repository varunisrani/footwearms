import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Invoice, Sale, SaleItem, Customer, Product, AppSettings } from '../types/database.types';
import { formatCurrency, formatDate } from '../utils/format';

export class PDFGeneratorService {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  generateInvoicePDF(
    invoice: Invoice,
    sale: Sale,
    saleItems: SaleItem[],
    customer: Customer,
    products: Product[],
    settings: AppSettings
  ): void {
    // Reset document
    this.doc = new jsPDF();

    const pageWidth = this.doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Header - Business Info
    this.doc.setFontSize(20);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(settings.businessName, 14, yPos);

    yPos += 8;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    if (settings.businessAddress) {
      this.doc.text(settings.businessAddress, 14, yPos);
      yPos += 5;
    }
    if (settings.businessPhone) {
      this.doc.text(`Phone: ${settings.businessPhone}`, 14, yPos);
      yPos += 5;
    }
    if (settings.businessEmail) {
      this.doc.text(`Email: ${settings.businessEmail}`, 14, yPos);
      yPos += 5;
    }
    if (settings.businessGstin) {
      this.doc.text(`GSTIN: ${settings.businessGstin}`, 14, yPos);
      yPos += 5;
    }

    // Invoice Title
    yPos += 10;
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('INVOICE', pageWidth - 14, 20, { align: 'right' });

    // Invoice Details
    yPos = 40;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Invoice #: ${invoice.invoiceNumber}`, pageWidth - 14, yPos, { align: 'right' });
    yPos += 5;
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Date: ${formatDate(invoice.invoiceDate)}`, pageWidth - 14, yPos, { align: 'right' });
    yPos += 5;
    this.doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, pageWidth - 14, yPos, { align: 'right' });
    yPos += 5;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Status: ${invoice.status.toUpperCase()}`, pageWidth - 14, yPos, { align: 'right' });

    // Bill To Section
    yPos += 10;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Bill To:', 14, yPos);

    yPos += 6;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(customer.name, 14, yPos);
    yPos += 5;
    this.doc.text(customer.businessName, 14, yPos);
    yPos += 5;

    // Split address into lines if too long
    const addressLines = this.doc.splitTextToSize(customer.billingAddress, 80);
    addressLines.forEach((line: string) => {
      this.doc.text(line, 14, yPos);
      yPos += 5;
    });

    if (customer.gstin) {
      this.doc.text(`GSTIN: ${customer.gstin}`, 14, yPos);
      yPos += 5;
    }
    this.doc.text(`Phone: ${customer.phone}`, 14, yPos);
    yPos += 5;
    this.doc.text(`Email: ${customer.email}`, 14, yPos);

    // Items Table
    yPos += 10;

    const tableData = saleItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return [
        product?.name || 'Unknown Product',
        item.quantity.toString(),
        formatCurrency(item.unitPrice),
        `${item.discountPercent}%`,
        formatCurrency(item.discountAmount),
        `${item.taxPercent}%`,
        formatCurrency(item.taxAmount),
        formatCurrency(item.totalAmount),
      ];
    });

    autoTable(this.doc, {
      startY: yPos,
      head: [['Item', 'Qty', 'Unit Price', 'Disc %', 'Discount', 'Tax %', 'Tax', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center', cellWidth: 15 },
        2: { halign: 'right', cellWidth: 25 },
        3: { halign: 'center', cellWidth: 18 },
        4: { halign: 'right', cellWidth: 22 },
        5: { halign: 'center', cellWidth: 15 },
        6: { halign: 'right', cellWidth: 20 },
        7: { halign: 'right', cellWidth: 25 },
      },
    });

    // Get final Y position after table
    const finalY = (this.doc as any).lastAutoTable.finalY || yPos + 50;

    // Totals Section
    yPos = finalY + 10;
    const totalsX = pageWidth - 70;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');

    this.doc.text('Subtotal:', totalsX, yPos);
    this.doc.text(formatCurrency(invoice.subtotal), pageWidth - 14, yPos, { align: 'right' });
    yPos += 6;

    this.doc.text('Discount:', totalsX, yPos);
    this.doc.setTextColor(220, 38, 38); // Red color
    this.doc.text(`-${formatCurrency(invoice.discountAmount)}`, pageWidth - 14, yPos, { align: 'right' });
    yPos += 6;

    this.doc.setTextColor(0, 0, 0); // Reset to black
    this.doc.text('Tax:', totalsX, yPos);
    this.doc.text(formatCurrency(invoice.taxAmount), pageWidth - 14, yPos, { align: 'right' });
    yPos += 8;

    // Total Amount
    this.doc.setLineWidth(0.5);
    this.doc.line(totalsX, yPos, pageWidth - 14, yPos);
    yPos += 6;

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Total Amount:', totalsX, yPos);
    this.doc.text(formatCurrency(invoice.totalAmount), pageWidth - 14, yPos, { align: 'right' });
    yPos += 6;

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(34, 197, 94); // Green color
    this.doc.text('Paid:', totalsX, yPos);
    this.doc.text(formatCurrency(invoice.paidAmount), pageWidth - 14, yPos, { align: 'right' });
    yPos += 6;

    this.doc.setTextColor(220, 38, 38); // Red color
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Balance Due:', totalsX, yPos);
    this.doc.text(formatCurrency(invoice.balanceAmount), pageWidth - 14, yPos, { align: 'right' });

    // Payment Terms
    this.doc.setTextColor(0, 0, 0); // Reset to black
    yPos += 15;
    if (invoice.paymentTerms) {
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Payment Terms:', 14, yPos);
      yPos += 5;
      this.doc.setFont('helvetica', 'normal');
      this.doc.text(invoice.paymentTerms, 14, yPos);
    }

    // Notes
    if (invoice.notes) {
      yPos += 10;
      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Notes:', 14, yPos);
      yPos += 5;
      this.doc.setFont('helvetica', 'normal');
      const notesLines = this.doc.splitTextToSize(invoice.notes, pageWidth - 28);
      notesLines.forEach((line: string) => {
        this.doc.text(line, 14, yPos);
        yPos += 4;
      });
    }

    // Footer
    const pageHeight = this.doc.internal.pageSize.getHeight();
    this.doc.setFontSize(8);
    this.doc.setTextColor(128, 128, 128);
    this.doc.text(
      'Thank you for your business!',
      pageWidth / 2,
      pageHeight - 15,
      { align: 'center' }
    );
    this.doc.text(
      `Generated on ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  download(filename: string): void {
    this.doc.save(filename);
  }

  getBlob(): Blob {
    return this.doc.output('blob');
  }

  getDataUri(): string {
    return this.doc.output('datauristring');
  }
}
