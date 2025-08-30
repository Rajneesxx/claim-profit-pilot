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
  const radius = Math.min(width, height) * 0.35;
  
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
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw speech bubble labels
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelRadius = radius + 45;
    const labelX = centerX + Math.cos(labelAngle) * labelRadius;
    const labelY = centerY + Math.sin(labelAngle) * labelRadius;
    
    // Speech bubble dimensions
    const bubbleWidth = 35;
    const bubbleHeight = 20;
    const cornerRadius = 10;
    
    // Draw black rounded speech bubble
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(labelX - bubbleWidth/2, labelY - bubbleHeight/2, bubbleWidth, bubbleHeight, cornerRadius);
    ctx.fill();
    
    // Draw pointer triangle
    const triangleSize = 6;
    const triangleX = centerX + Math.cos(labelAngle) * (radius + 25);
    const triangleY = centerY + Math.sin(labelAngle) * (radius + 25);
    
    ctx.beginPath();
    ctx.moveTo(triangleX, triangleY);
    ctx.lineTo(labelX - Math.cos(labelAngle) * triangleSize, labelY - Math.sin(labelAngle) * triangleSize);
    ctx.lineTo(labelX + Math.cos(labelAngle + Math.PI/3) * triangleSize, labelY + Math.sin(labelAngle + Math.PI/3) * triangleSize);
    ctx.closePath();
    ctx.fill();
    
    // Draw white percentage text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.label, labelX, labelY);
    
    currentAngle += sliceAngle;
  });
};

const createGrowthChart = (canvas: HTMLCanvasElement, width: number, height: number) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, width, height);
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#8b5cf6'); // Purple
  gradient.addColorStop(1, '#10b981'); // Green
  
  // Draw rounded background
  const cornerRadius = 20;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(20, 20, width - 40, height - 40, cornerRadius);
  ctx.fill();
  
  // Milestone data
  const milestones = [
    { x: 60, y: height - 60, label: 'Apr \'24', desc: 'Onboarded\nfirst client' },
    { x: 120, y: height - 80, label: 'Aug \'24', desc: 'On-boarded one\nof the largest\nFQHCs in USA' },
    { x: 180, y: height - 100, label: 'Dec \'24', desc: '$1M CARR\nSeries A backed by Accel' },
    { x: 240, y: height - 120, label: 'Apr \'25', desc: '$2.7M CARR\n200 high velocity pipeline' },
    { x: 300, y: height - 140, label: 'Aug \'25', desc: '$5M CARR' },
    { x: 360, y: height - 160, label: 'Dec \'25', desc: '$10M CARR' }
  ];
  
  // Draw curve connecting milestones
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  milestones.forEach((milestone, index) => {
    if (index === 0) {
      ctx.moveTo(milestone.x, milestone.y);
    } else {
      ctx.lineTo(milestone.x, milestone.y);
    }
  });
  ctx.stroke();
  
  // Draw milestone dots and labels
  milestones.forEach((milestone, index) => {
    // Draw white dot
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(milestone.x, milestone.y, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw timeline label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(milestone.label, milestone.x, milestone.y + 20);
    
    // Draw description
    ctx.font = '8px Arial';
    const lines = milestone.desc.split('\n');
    lines.forEach((line, lineIndex) => {
      ctx.fillText(line, milestone.x, milestone.y - 20 - (lines.length - lineIndex - 1) * 10);
    });
  });
};

export const generatePDFBlob = async (data: ExportData): Promise<Blob> => {
  const doc = new jsPDF();
  await createPDFContent(doc, data);
  return doc.output('blob');
};

export const generatePDFReport = async (data: ExportData): Promise<void> => {
  const doc = new jsPDF();
  await createPDFContent(doc, data);
  const fileName = `rapidroi-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

const createPDFContent = async (doc: jsPDF, data: ExportData): Promise<void> => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;

  // ================== COVER PAGE ==================
  // Purple to teal gradient background effect
  doc.setFillColor(139, 92, 246); // Purple
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Gradient overlay simulation with multiple rectangles
  for (let i = 0; i < 20; i++) {
    const alpha = i / 20;
    const red = Math.round(139 + (45 - 139) * alpha);
    const green = Math.round(92 + (212 - 92) * alpha);
    const blue = Math.round(246 + (183 - 246) * alpha);
    doc.setFillColor(red, green, blue);
    doc.rect(0, pageHeight * i / 20, pageWidth, pageHeight / 20, 'F');
  }

  // Cover text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Personalized', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
  doc.text('ROI Blueprint', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Prepared for:', pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });
  doc.text('[Client Company Name]', pageWidth / 2, pageHeight / 2 + 55, { align: 'center' });
  
  // RapidClaims logo text
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 69, 58); // Red for "Rapid"
  doc.text('Rapid', pageWidth / 2 - 25, pageHeight - 50, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.text('Claims', pageWidth / 2 + 5, pageHeight - 50, { align: 'center' });

  
  
  // ================== PAGE 2: EXECUTIVE SUMMARY ==================
     doc.addPage();
  
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  let yPosition = 15;
  
  // Header - very compact
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Financial Future at a Glance', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  
  // Executive Summary section - very compact
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, yPosition);
  
  yPosition += 6;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('This ROI analysis models the financial impact of adopting RapidClaims\' AI-powered medical coding solutions.', margin, yPosition);
  
  yPosition += 10;
  
  // Calculate total from specified values
  const costSavings = 231811;
  const revenueIncrease = 79047;
  const riskReduction = 16750;
  const totalImpact = costSavings + revenueIncrease + riskReduction;
  
  // Large financial impact number - smaller
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('$' + totalImpact.toLocaleString(), margin, yPosition);
  
  yPosition += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Estimated Annual Financial Impact', margin, yPosition);
  
  yPosition += 12;
  
  // Three metric boxes - very small
  const boxWidth = (pageWidth - 2 * margin - 12) / 3;
  const boxHeight = 22;
  const boxY = yPosition;
  
  // Cost Savings box
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, boxY, boxWidth, boxHeight, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, boxY, boxWidth, boxHeight, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('$231,811', margin + boxWidth/2, boxY + 8, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('in Cost Savings', margin + boxWidth/2, boxY + 16, { align: 'center' });
  
  // Revenue Uplift box
  const box2X = margin + boxWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.rect(box2X, boxY, boxWidth, boxHeight, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(box2X, boxY, boxWidth, boxHeight, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('$79,047', box2X + boxWidth/2, boxY + 8, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('in Revenue Uplift', box2X + boxWidth/2, boxY + 16, { align: 'center' });
  
  // Risk Reduction box
  const box3X = margin + 2 * boxWidth + 12;
  doc.setFillColor(248, 250, 252);
  doc.rect(box3X, boxY, boxWidth, boxHeight, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(box3X, boxY, boxWidth, boxHeight, 'S');
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('$16,750', box3X + boxWidth/2, boxY + 8, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('in Risk Reduction', box3X + boxWidth/2, boxY + 16, { align: 'center' });
  
  yPosition += 28;
  
  // Analysis text - very compact
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('The analysis shows a compelling return on investment, with strong cost reductions supported by compliance improvements.', margin, yPosition);
  
  yPosition += 12;
  
  // The Story Behind the Numbers - compact
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('The Story Behind the Numbers', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 12;
  
  // Financial Impact Breakdown
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Impact Breakdown', margin, yPosition);
  
  yPosition += 10;
  
  const costSavingsPercent = Math.round((costSavings / totalImpact) * 100);
  const revenuePercent = Math.round((revenueIncrease / totalImpact) * 100);
  const riskPercent = Math.round((riskReduction / totalImpact) * 100);
  
  // Create very small pie chart
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 100, 100);
  
  // Draw compact pie chart
  const centerX = 50;
  const centerY = 50;
  const radius = 35;
  let currentAngle = -Math.PI / 2;
  
  const segments = [
    { value: costSavings, color: '#8b5cf6', percent: costSavingsPercent },
    { value: revenueIncrease, color: '#10b981', percent: revenuePercent },
    { value: riskReduction, color: '#e9d5ff', percent: riskPercent }
  ];
  
  segments.forEach((segment, index) => {
    const sliceAngle = (segment.value / totalImpact) * 2 * Math.PI;
    
    // Draw slice
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    
    // Add percentage label only for larger slices
    if (segment.percent > 10) {
      const labelAngle = currentAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(labelAngle) * (radius * 0.6);
      const labelY = centerY + Math.sin(labelAngle) * (radius * 0.6);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(segment.percent + '%', labelX, labelY);
    }
    
    currentAngle += sliceAngle;
  });

  try {
    const chartDataUrl = canvas.toDataURL('image/png');
    // Position very small chart
    const chartX = pageWidth - margin - 60;
    const chartY = yPosition;
    doc.addImage(chartDataUrl, 'PNG', chartX, chartY, 50, 50);
    
    // Legend positioned below the chart - very compact
    const legendX = chartX - 15;
    let legendY = chartY + 60;
    
    // Legend items
    const legendItems = [
      { color: '#8b5cf6', label: 'Cost Savings:', value: '$231,811' },
      { color: '#10b981', label: 'Revenue Increase:', value: '$79,047' },
      { color: '#e9d5ff', label: 'Risk Reduction:', value: '$16,750' }
    ];
    
    legendItems.forEach((item, index) => {
      // Color circle
      doc.setFillColor(...hexToRgb(item.color));
      doc.circle(legendX, legendY - 1, 1.5, 'F');
      
      // Label and value
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text(item.label, legendX + 6, legendY);
      doc.setFont('helvetica', 'bold');
      doc.text(item.value, legendX + 32, legendY);
      
      legendY += 6;
    });
    
  } catch (error) {
    console.warn('Chart generation failed:', error);
  }
  
  // Left side breakdown text - very compact
  const breakdownY = yPosition;
  let leftY = breakdownY;
  
  // Cost Savings
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${costSavingsPercent}% Cost Savings`, margin, leftY);
  leftY += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Driven by AI automation that boosts coder productivity', margin, leftY);
  leftY += 4;
  doc.text('and eliminates manual tasks.', margin, leftY);
  
  leftY += 8;
  
  // Revenue Increase
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${revenuePercent}% Revenue Increase`, margin, leftY);
  leftY += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Driven by improved coding accuracy that captures', margin, leftY);
  leftY += 4;
  doc.text('missed reimbursements.', margin, leftY);
  
  leftY += 8;
  
  // Risk Reduction
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${riskPercent}% Risk Reduction`, margin, leftY);
  leftY += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Driven by enhanced compliance, reducing audit', margin, leftY);
  leftY += 4;
  doc.text('and penalty exposure.', margin, leftY);
  
  // Quote section - very minimized
  yPosition = pageHeight - 35;
  
  // Quote background box - smallest possible
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition - 4, pageWidth - 2 * margin, 15, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(margin, yPosition - 4, pageWidth - 2 * margin, 15, 'S');
  
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('"Imagine recovering every collectible dollar, automatically."', pageWidth / 2, yPosition + 2, { align: 'center' });
  
  // RapidClaims footer - very small
  const footerY = pageHeight - 10;
  doc.setTextColor(255, 69, 58);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Rapid', pageWidth - margin - 30, footerY);
  doc.setTextColor(0, 0, 0);
  doc.text('Claims', pageWidth - margin - 8, footerY);

// Helper function for hex to RGB conversion
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}
  // ================== PAGE 3: DETAILED ANALYSIS ==================
  doc.addPage();
  
  yPosition = 30;
  
  // Detailed Financial Analysis
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Financial Analysis', margin, yPosition);
  
  yPosition += 20;
  
  // Analysis table
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 80, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 80, 'S');
  
  yPosition += 15;
  
  const tableData = [
    ['Category', 'Annual Value', 'Description'],
    ['Cost Savings', formatCurrency(data.calculations.totalCostSavings), 'Operational efficiency gains from autonomous coding and reduced manual work.'],
    ['Revenue Enhanced', formatCurrency(data.calculations.totalRevenueIncrease), 'Improved claim accuracy, fewer denials, increased approved reimbursements.'],
    ['Risk Mitigation', formatCurrency(data.calculations.totalRiskReduction), 'Compliance protection, reduced penalties, lower audit exposure.'],
    ['Total Benefit', formatCurrency(data.calculations.totalImpact), 'Combined annual financial impact']
  ];

  const colWidths = [40, 35, 90];
  const startX = margin + 10;

  tableData.forEach((row, index) => {
    let xPos = startX;
    
    if (index === 0) {
      // Header row
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
    } else if (index === tableData.length - 1) {
      // Total row
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
    } else {
      // Data rows
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
    }
    
    row.forEach((cell, colIndex) => {
      if (colIndex === 2) {
        // Description column - wrap text
        const lines = doc.splitTextToSize(cell, colWidths[colIndex] - 5);
        doc.text(lines, xPos, yPosition);
      } else {
        doc.text(cell, xPos, yPosition);
      }
      xPos += colWidths[colIndex];
    });
    
    yPosition += index === 0 ? 8 : 12;
  });

  yPosition += 25;

  // Organization Parameters
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Organization Parameters', margin, yPosition);
  
  yPosition += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('The ROI model uses your organizational inputs:', margin, yPosition);
  
  yPosition += 15;
  
  // Parameters list
  const params = [
    `• Annual Revenue Claimed: ${formatCurrency(data.metrics.revenueClaimed)}`,
    `• Number of Claims Per Year: ~${formatNumber(data.metrics.claimsPerAnnum)}`,
    '• Average Cost per Claim: Derived from revenue and claim data.',
    '• Baseline Denial Rate & Backlog: Applied as per inputs.'
  ];
  
  doc.setFontSize(10);
  params.forEach(param => {
    doc.text(param, margin, yPosition);
    yPosition += 8;
  });
  
  yPosition += 10;
  doc.text('These assumptions create the baseline for measuring cost savings, revenue enhancement,', margin, yPosition);
  yPosition += 6;
  doc.text('and risk reduction.', margin, yPosition);
  
  yPosition += 25;
  
  // Conclusion
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Conclusion', margin, yPosition);
  
  yPosition += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('The model demonstrates a positive ROI, delivering:', margin, yPosition);
  
  yPosition += 12;
  const conclusions = [
    `• ${formatCurrency(data.calculations.totalImpact)} annual benefit, driven primarily by cost savings.`,
    '• Reduced operational strain, freeing coders and physicians from manual tasks.',
    '• Compliance confidence, reducing the risk of costly penalties and audits.'
  ];
  
  doc.setFontSize(10);
  conclusions.forEach(conclusion => {
    doc.text(conclusion, margin, yPosition);
    yPosition += 8;
  });
  
  yPosition += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendation: ', margin, yPosition);
  doc.setFont('helvetica', 'normal');
  const recommendationText = 'Adoption of RapidClaims\' AI solutions provides a sustainable and scalable path to reduce costs, increase revenue capture, and improve compliance simultaneously.';
  const lines = doc.splitTextToSize(recommendationText, pageWidth - 2 * margin - 30);
  doc.text(lines, margin + 30, yPosition);

  // ================== PAGE 4: FOUR PILLARS ==================
  doc.addPage();
  
  yPosition = 30;
  
  // Four Pillars header
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('The Four Pillars of Your Success', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('The Levers Driving Your ROI', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 30;
  
  // Four pillars in a single row
  const pillarWidth = (pageWidth - 2 * margin - 30) / 4;
  const pillarHeight = 50;
  const pillarY = yPosition;
  
  const pillars = [
    { title: 'Coder\nProductivity', desc: 'AI reduces time per\nchart by up to 100%.' },
    { title: 'Billing\nAutomation', desc: '40% fewer denials\nand faster\nturnaround.' },
    { title: 'Physician Time\nSaved', desc: 'Fewer queries and\ndocumentation\nbottlenecks.' },
    { title: 'Tech Cost\nOptimization', desc: 'Replace legacy\nsystems and reduce\nIT overhead.' }
  ];
  
  pillars.forEach((pillar, index) => {
    const pillarX = margin + index * (pillarWidth + 10);
    
    // Draw pillar box with purple accent
    doc.setFillColor(248, 250, 252);
    doc.rect(pillarX, pillarY, pillarWidth, pillarHeight, 'F');
    doc.setDrawColor(139, 92, 246);
    doc.setLineWidth(0.5);
    doc.rect(pillarX, pillarY, pillarWidth, pillarHeight, 'S');
    
    // Add purple accent line at top
    doc.setFillColor(139, 92, 246);
    doc.rect(pillarX, pillarY, pillarWidth, 3, 'F');
    
    // Add icon placeholder (simple geometric shape)
    doc.setFillColor(139, 92, 246);
    doc.circle(pillarX + pillarWidth/2, pillarY + 12, 4, 'F');
    
    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const titleLines = pillar.title.split('\n');
    titleLines.forEach((line, lineIndex) => {
      doc.text(line, pillarX + pillarWidth/2, pillarY + 22 + lineIndex * 5, { align: 'center' });
    });
    
    // Description
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const descLines = pillar.desc.split('\n');
    descLines.forEach((line, lineIndex) => {
      doc.text(line, pillarX + pillarWidth/2, pillarY + 35 + lineIndex * 4, { align: 'center' });
    });
  });
  
  yPosition += 70;
  
  // Quote
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text('"Free your team to focus on what matters most: patient care and complex cases."', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 35;
  
  // Your Path Forward
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Path Forward', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Implementation Journey', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 25;
  
  // Implementation header
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Implementation | Seamless Deployment in 8 Weeks', margin, yPosition);
  
  yPosition += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Accelerate implementation with structured AI integration, real-time automation, and ongoing', margin, yPosition);
  yPosition += 6;
  doc.text('enhancements to maximize accuracy, compliance, and financial impact.', margin, yPosition);
  
  yPosition += 25;
  
  // Proposed Approach header
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Proposed Approach', margin, yPosition);
  
  yPosition += 15;
  
  // Implementation table
  const tableHeaders = ['Overview', 'Baseline Setup\n& Data Integration', 'AI Model Customization\n& Parallel Testing', 'Pilot Deployment & CDI\nWorkflow Optimization', 'Full-Scale Go-Live &\nWorkflow Integration', 'Continuous\nOptimization', 'Measure\nand Adapt'];
  const tableRows = [
    ['2 weeks', '2 weeks', '2 weeks', '2 weeks', '', ''],
    ['Establish seamless\nintegration with EMR, RCM,\nand claims systems.\nIngesting historical data to\ntrain AI models with venue-\nspecific rules.\nSpecify workflows, and\ncompliance settings to align\nAI recommendations with\nservice-specific needs.', 'Fine-tune AI models using\nreal-world data, with coding\npatterns while running\nalongside human coders\nover initial data.\nEnable 24/7 monitoring to\ncontinually assess flags\nMonitor AI-generated coding\ndata vs recommendations\nThresholds.', 'Deploy AI-powered CDI and\nautonomous coding in a\ncontrolled environment.\nOptimize workflow paths,\nadjust automation levels and\nimprove coding efficiency.', 'Transition to full-scale\ndeployment with AI\nintegration, real-time\ncoding, documentation\nimprovements, and\nmaximal revenue with\noptimal automation,\nFinalize billing integration.\nTrain coders and providers on\nworkflow optimizations,\nmaximize revenue cycle\nworkflows for\nsustained accuracy,\ncompliance, and financial\nefficiency.', 'With full automation in place,\nthe focus shifts to\ncontinuous monitoring,\nexpanding AI-driven\nautomation across\nadditional workflows and\nrevenue cycle workflows for\nsustained accuracy,\ncompliance, and financial\nefficiency.', 'AI continuously adapts to\nreal-world workflow patterns\nand incorporates ongoing\ndocumentation workflows,\nand incorporating new\nperformance assessments.\nHeart sustained automation\nefficiency, regulatory\ncompliance, and financial\noptimization.']
  ];
  
  const colWidth = (pageWidth - 2 * margin) / 6;
  
  // Draw table headers
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, yPosition, pageWidth - 2 * margin, 20, 'S');
  
  // Last column (Measure and Adapt) with purple background
  doc.setFillColor(139, 92, 246);
  doc.rect(margin + 5 * colWidth, yPosition, colWidth, 20, 'F');
  
  tableHeaders.forEach((header, index) => {
    const x = margin + index * colWidth + colWidth/2;
    doc.setTextColor(index === 6 ? 255 : 0, index === 6 ? 255 : 0, index === 6 ? 255 : 0);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    const lines = header.split('\n');
    lines.forEach((line, lineIndex) => {
      doc.text(line, x, yPosition + 8 + lineIndex * 4, { align: 'center' });
    });
  });
  
  yPosition += 25;
  
  // Draw table rows
  tableRows.forEach((row, rowIndex) => {
    const rowHeight = rowIndex === 0 ? 15 : 45;
    
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, rowHeight, 'S');
    
    if (rowIndex === 0) {
      // Timeline row
      doc.setTextColor(139, 92, 246);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      row.forEach((cell, colIndex) => {
        if (cell) {
          const x = margin + colIndex * colWidth + colWidth/2;
          doc.text(cell, x, yPosition + 10, { align: 'center' });
        }
      });
    } else {
      // Content row
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      row.forEach((cell, colIndex) => {
        const x = margin + colIndex * colWidth + 2;
        const lines = doc.splitTextToSize(cell, colWidth - 4);
        doc.text(lines, x, yPosition + 8);
      });
    }
    
    yPosition += rowHeight;
  });
  
  yPosition += 10;
  
  // Next Steps
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Next Steps: ', margin, yPosition);
  doc.setFont('helvetica', 'normal');
  const nextStepsText = 'Finalize integration requirements, provide historical data for AI benchmarking, and align on performance goals to initiate seamless deployment and optimization process.';
  const nextStepsLines = doc.splitTextToSize(nextStepsText, pageWidth - 2 * margin - 25);
  doc.text(nextStepsLines, margin + 25, yPosition);

  // ================== PAGE 5: GROWTH CHART ==================
  doc.addPage();
  
  yPosition = 30;
  
  // Header
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Consistently delivering > 6x ROI?', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Create and add growth chart
  const growthCanvas = document.createElement('canvas');
  growthCanvas.width = 400;
  growthCanvas.height = 120;
  createGrowthChart(growthCanvas, 400, 120);
  
  try {
    const growthChartDataUrl = growthCanvas.toDataURL('image/png');
    doc.addImage(growthChartDataUrl, 'PNG', margin, yPosition, pageWidth - 2 * margin, 30);
  } catch (error) {
    console.warn('Growth chart generation failed:', error);
  }
  
  yPosition += 45;
  
  // What makes us different
  doc.setFontSize(20);
  doc.text('What makes us different?', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Clear ROI, seamless integration, and best-in-class automation: a system that pays for', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;
  doc.text('itself in less than 3 months.', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Comparison table header
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('What makes RapidClaims Unique?', margin, yPosition);
  
  doc.setTextColor(255, 69, 58);
  doc.text('RapidClaims', pageWidth / 2 - 20, yPosition);
  
  doc.setTextColor(0, 0, 0);
  doc.text('The Rest', pageWidth - margin - 40, yPosition);
  
  yPosition += 15;
  
  // Comparison rows
  const comparisons = [
    ['Customizations', 'Fully configurable workflows, minimal dev required', 'Limited or require engineering effort'],
    ['Time to go-live', '6-8 weeks', '2-6 months'],
    ['Minimum Charts Required for Go-Live', '500-1000 Charts Per Site', '20,000 - 50,000 Charts'],
    ['Integration time', 'API & FHIR-based plug-ins, < 1 month; RPA', 'Long IT onboarding'],
    ['Specialty coverage', 'Built for multi-specialty including complex care', 'Often limited to primary specialties'],
    ['Documentation improvement', 'Smart query module suggests clarifications in real time', 'Manual follow-up by coders'],
    ['Code Audits', 'Built-in pre-submit audits with real-time flags', 'Post-submission audits'],
    ['Team collaboration', 'Shared queues, in-app notes & escalation paths', 'Disjointed workflows'],
    ['Analytics', 'Real-time dashboards, ROI tracking, denial trends', 'Limited to basic reporting'],
    ['Care gap detection', 'AI flags missed opportunities during coding', 'Not typically supported']
  ];
  
  doc.setFontSize(9);
  comparisons.forEach(([feature, rapidclaims, rest]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(feature, margin, yPosition);
    
    doc.setTextColor(255, 69, 58);
    const rapidLines = doc.splitTextToSize(rapidclaims, 60);
    doc.text(rapidLines, pageWidth / 2 - 20, yPosition);
    
    doc.setTextColor(0, 0, 0);
    const restLines = doc.splitTextToSize(rest, 60);
    doc.text(restLines, pageWidth - margin - 50, yPosition);
    
    yPosition += Math.max(rapidLines.length, restLines.length) * 4 + 3;
  });
  
  yPosition += 20;
  
  // Ready to Unlock Your ROI
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to Unlock Your ROI?', pageWidth / 2, yPosition, { align: 'center' });
  
  // Final RapidClaims logo
  yPosition = pageHeight - 40;
  doc.setTextColor(255, 69, 58);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Rapid', pageWidth / 2 - 20, yPosition, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.text('Claims', pageWidth / 2 + 10, yPosition, { align: 'center' });
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
