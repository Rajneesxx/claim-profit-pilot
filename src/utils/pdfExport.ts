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
  let yPosition = 30;

  // Create chart canvas
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  
  // Chart data
  const chartData = [
    { label: 'Cost Savings', value: data.calculations.totalCostSavings },
    { label: 'Revenue Increase', value: data.calculations.totalRevenueIncrease },
    { label: 'Risk Reduction', value: data.calculations.totalRiskReduction }
  ];
  
  const chartColors = ['#10b981', '#3b82f6', '#8b5cf6'];
  createChart(canvas, 300, 200, chartData, chartColors);

  // Header with improved styling
  doc.setFillColor(59, 130, 246); // Blue background
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('RapidROI by RapidClaims', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Medical Coding ROI Analysis Report', pageWidth / 2, 30, { align: 'center' });
  
  // Reset colors
  doc.setTextColor(0, 0, 0);
  yPosition = 50;
  
  // Report metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`, margin, yPosition);
  doc.text(`Report for: ${data.userEmail}`, margin, yPosition + 7);
  
  yPosition += 25;

  // Executive Summary Box
  doc.setFillColor(240, 248, 255);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'F');
  doc.setDrawColor(59, 130, 246);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 60, 'S');
  
  yPosition += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('📊 Executive Summary', margin + 10, yPosition);
  
  yPosition += 15;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  
  // Key metrics in a grid layout
  const col1X = margin + 10;
  const col2X = pageWidth / 2 + 10;
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('Total Annual Impact:', col1X, yPosition);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(data.calculations.totalImpact), col1X + 65, yPosition);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('Implementation Cost:', col2X, yPosition);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(data.calculations.implementationCost), col2X + 60, yPosition);
  
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('Payback Period:', col1X, yPosition);
  doc.setTextColor(0, 0, 0);
  const paybackMonths = (data.calculations.implementationCost / (data.calculations.totalImpact / 12)).toFixed(1);
  doc.text(`${paybackMonths} months`, col1X + 50, yPosition);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(234, 88, 12);
  doc.text('Annual Revenue:', col2X, yPosition);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(data.metrics.revenueClaimed), col2X + 50, yPosition);

  yPosition += 25;

  // Add chart
  try {
    const chartDataUrl = canvas.toDataURL('image/png');
    doc.addImage(chartDataUrl, 'PNG', margin, yPosition, 80, 50);
    
    // Chart legend
    const legendX = margin + 90;
    let legendY = yPosition + 10;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Impact Breakdown:', legendX, legendY);
    
    legendY += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    chartData.forEach((item, index) => {
      doc.setFillColor(...hexToRgb(chartColors[index]));
      doc.circle(legendX + 2, legendY - 2, 2, 'F');
      doc.text(`${item.label}: ${formatCurrency(item.value)}`, legendX + 8, legendY);
      legendY += 6;
    });
  } catch (error) {
    console.warn('Could not add chart to PDF:', error);
  }

  yPosition += 60;

  // Detailed Analysis Section
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 70, 'F');
  doc.setDrawColor(148, 163, 184);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 70, 'S');
  
  yPosition += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('💼 Detailed Financial Analysis', margin + 10, yPosition);
  
  yPosition += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const detailedData = [
    ['Annual Cost Savings:', formatCurrency(data.calculations.totalCostSavings), 'From operational efficiency gains'],
    ['Revenue Enhancement:', formatCurrency(data.calculations.totalRevenueIncrease), 'Through improved coding accuracy'],
    ['Risk Mitigation Value:', formatCurrency(data.calculations.totalRiskReduction), 'Compliance and audit protection'],
    ['Net Annual Benefit:', formatCurrency(data.calculations.totalImpact), 'Total financial impact per year']
  ];

  detailedData.forEach(([label, value, description]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin + 10, yPosition);
    doc.setFont('helvetica', 'bold');
    doc.text(value, margin + 80, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(description, margin + 130, yPosition);
    doc.setTextColor(0, 0, 0);
    yPosition += 8;
  });

  yPosition += 20;

  // Input Parameters Section
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('⚙️ Analysis Parameters', margin, yPosition);
  
  yPosition += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const inputData = [
    ['Organization Size', ''],
    ['Annual Revenue Claimed:', formatCurrency(data.metrics.revenueClaimed)],
    ['Number of Coders:', formatNumber(data.metrics.numberOfCoders)],
    ['Number of Billers:', formatNumber(data.metrics.numberOfBillers)],
    ['Number of Physicians:', formatNumber(data.metrics.numberOfPhysicians)],
    ['', ''],
    ['Current Performance', ''],
    ['Claims Denied Rate:', `${data.metrics.claimDeniedPercent}%`],
    ['Coding Backlog:', `${data.metrics.codingBacklogPercent}%`],
    ['Claims Per Year:', formatNumber(data.metrics.claimsPerAnnum)]
  ];

  inputData.forEach(([label, value]) => {
    if (label && !value) {
      // Section header
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text(label, margin, yPosition);
      doc.setTextColor(0, 0, 0);
    } else if (label && value) {
      doc.setFont('helvetica', 'normal');
      doc.text(label, margin + 5, yPosition);
      doc.setFont('helvetica', 'bold');
      doc.text(value, margin + 80, yPosition);
    }
    yPosition += label ? 8 : 4;
  });

  // Footer
  yPosition = pageHeight - 25;
  doc.setDrawColor(59, 130, 246);
  doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('This comprehensive analysis was generated by RapidROI Calculator', pageWidth / 2, yPosition, { align: 'center' });
  doc.text('RapidClaims AI-Powered Medical Coding Solutions | rapidclaims.com', pageWidth / 2, yPosition + 7, { align: 'center' });
  doc.text('For questions or to schedule a consultation, contact us at info@rapidclaims.com', pageWidth / 2, yPosition + 14, { align: 'center' });

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