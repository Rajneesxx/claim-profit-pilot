import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ROIMetrics } from '@/types/roi';
import { formatCurrency, formatNumber } from './formatters';

interface ExportData {
  metrics: ROIMetrics;
  calculations: {
    totalCostSavings: number;
    totalRevenueIncrease: number;
    totalRiskReduction: number;
    totalImpact: number;
    implementationCost: number;
    roi: number;
  };
  userEmail: string;
}

const createChart = (canvas: HTMLCanvasElement, width: number, height: number, data: any[], colors: string[]) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Draw pie chart
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.3;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2;
  
  data.forEach((item, index) => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;
    
    // Draw slice
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.lineTo(centerX, centerY);
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius + 20);
    const labelY = centerY + Math.sin(labelAngle) * (radius + 20);
    
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, labelX, labelY);
    
    currentAngle += sliceAngle;
  });
};

export const generatePDFReport = async (data: ExportData): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  let yPosition = 20;

  // ================== HEADER SECTION ==================
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('RapidROI by RapidClaims', pageWidth / 2, 18, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Medical Coding ROI Analysis Report', pageWidth / 2, 28, { align: 'center' });
  
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })} | Report for: ${data.userEmail}`, pageWidth / 2, 36, { align: 'center' });
  
  yPosition = 55;

  // ================== EXECUTIVE SUMMARY ==================
  doc.setTextColor(0, 0, 0);
  doc.setFillColor(240, 248, 255);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 45, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(1);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 45, 'S');
  
  yPosition += 8;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Executive Summary', margin + 8, yPosition);
  
  yPosition += 12;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  
  // Two-column layout for key metrics
  const leftCol = margin + 8;
  const rightCol = pageWidth / 2 + 5;
  
  // Left column
  doc.setFont('helvetica', 'normal');
  doc.text('Total Annual Impact:', leftCol, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(formatCurrency(data.calculations.totalImpact), leftCol + 55, yPosition);
  
  // Right column
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Implementation Cost:', rightCol, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(239, 68, 68);
  doc.text(formatCurrency(data.calculations.implementationCost), rightCol + 55, yPosition);
  
  yPosition += 8;
  
  // Second row
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Payback Period:', leftCol, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  const paybackMonths = (data.calculations.implementationCost / (data.calculations.totalImpact / 12)).toFixed(1);
  doc.text(`${paybackMonths} months`, leftCol + 45, yPosition);
  
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Annual Revenue:', rightCol, yPosition);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text(formatCurrency(data.metrics.revenueClaimed), rightCol + 45, yPosition);
  
  yPosition += 20;

  // ================== IMPACT BREAKDOWN CHART ==================
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Impact Breakdown', margin, yPosition);
  
  yPosition += 10;
  
  // Create and add chart
  const canvas = document.createElement('canvas');
  canvas.width = 280;
  canvas.height = 160;
  
  const chartData = [
    { label: '', value: data.calculations.totalCostSavings },
    { label: '', value: data.calculations.totalRevenueIncrease },
    { label: '', value: data.calculations.totalRiskReduction }
  ];
  
  const chartColors = ['#10b981', '#3b82f6', '#8b5cf6'];
  createChart(canvas, 280, 160, chartData, chartColors);

  try {
    const chartDataUrl = canvas.toDataURL('image/png');
    doc.addImage(chartDataUrl, 'PNG', margin, yPosition, 70, 45);
    
    // Chart legend - properly aligned
    const legendX = margin + 80;
    let legendY = yPosition + 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Impact Categories:', legendX, legendY);
    
    legendY += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    chartData.forEach((item, index) => {
      doc.setFillColor(...hexToRgb(chartColors[index]));
      doc.circle(legendX + 3, legendY - 1, 2, 'F');
      doc.setTextColor(0, 0, 0);
      doc.text(`${item.label}:`, legendX + 10, legendY);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(item.value), legendX + 60, legendY);
      doc.setFont('helvetica', 'normal');
      legendY += 6;
    });
  } catch (error) {
    console.warn('Chart generation failed:', error);
  }

  yPosition += 55;

  // ================== DETAILED ANALYSIS ==================
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 55, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 55, 'S');
  
  yPosition += 8;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Financial Analysis', margin + 8, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Organized in a table format
  const tableData = [
    ['Category', 'Annual Value', 'Description'],
    ['Cost Savings', formatCurrency(data.calculations.totalCostSavings), 'Operational efficiency gains'],
    ['Revenue Enhanced', formatCurrency(data.calculations.totalRevenueIncrease), 'Improved coding accuracy'],
    ['Risk Mitigation', formatCurrency(data.calculations.totalRiskReduction), 'Compliance protection'],
    ['Total Benefit', formatCurrency(data.calculations.totalImpact), 'Combined annual impact']
  ];

  const colWidths = [36, 45, 70];
  const startX = margin + 9;

  tableData.forEach((row, index) => {
    let xPos = startX;
    
    if (index === 0) {
      // Header row
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
    } else if (index === tableData.length - 1) {
      // Total row
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
    } else {
      // Data rows
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
    }
    
    row.forEach((cell, colIndex) => {
      doc.text(cell, xPos, yPosition);
      xPos += colWidths[colIndex];
    });
    
    yPosition += 6;
  });

  yPosition += 15;

  // ================== ORGANIZATION PARAMETERS ==================
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Organization Parameters', margin, yPosition);
  
  yPosition += 8;
  doc.setFontSize(10);
  
  // Two-column parameter layout
  const paramLeftCol = margin;
  const paramRightCol = pageWidth / 2;
  let leftY = yPosition;
  let rightY = yPosition;
  
  // Left column parameters
  const leftParams = [
    ['Annual Revenue Claimed:', formatCurrency(data.metrics.revenueClaimed)],
    ['Number of Coders:', formatNumber(data.metrics.numberOfCoders)],
    ['Number of Billers:', formatNumber(data.metrics.numberOfBillers)],
    ['Claims Per Year:', formatNumber(data.metrics.claimsPerAnnum)]
  ];
  
  // Right column parameters
  const rightParams = [
    ['Number of Physicians:', formatNumber(data.metrics.numberOfPhysicians)],
    ['Claims Denied Rate:', `${data.metrics.claimDeniedPercent}%`],
    ['Coding Backlog:', `${data.metrics.codingBacklogPercent || 15}%`],
    ['Avg Cost/Claim:', `$${data.metrics.averageCostPerClaim}`]
  ];
  
  // Render left column
  leftParams.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, paramLeftCol, leftY);
    doc.setFont('helvetica', 'bold');
    doc.text(value, paramLeftCol + 60, leftY);
    leftY += 6;
  });
  
  // Render right column
  rightParams.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(label, paramRightCol, rightY);
    doc.setFont('helvetica', 'bold');
    doc.text(value, paramRightCol + 60, rightY);
    rightY += 6;
  });

  // ================== FOOTER ==================
  const footerY = pageHeight - 20;
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 8, pageWidth - margin, footerY - 8);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('RapidClaims AI-Powered Medical Coding Solutions', pageWidth / 2, footerY - 3, { align: 'center' });
  doc.text('For consultation: info@rapidclaims.com | rapidclaims.com', pageWidth / 2, footerY + 3, { align: 'center' });

  // Save the PDF
  const fileName = `rapidroi-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
};
