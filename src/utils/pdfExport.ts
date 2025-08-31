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
 // ✅ Make sure gradient comes first
for (let i = 0; i < 30; i++) {
  const alpha = i / 30;
  const r = Math.round(0x82 + (0x06 - 0x82) * alpha);
  const g = Math.round(0x0C + (0x5D - 0x0C) * alpha);
  const b = Math.round(0xC7 + (0x3F - 0xC7) * alpha);
  doc.setFillColor(r, g, b);
  doc.rect(0, (pageHeight / 30) * i, pageWidth, pageHeight / 30, 'F');
}

// ✅ Titles
// Assuming pageHeight = doc.internal.pageSize.getHeight()

// --- Title block ~70% down
let titleY = pageHeight * 0.69;
doc.setFontSize(32);
doc.setFont('helvetica', 'bold');
doc.setTextColor(255, 255, 255);
doc.text('Your Personalized',24, titleY);
doc.text('ROI Blueprint', 24, titleY +18);

// --- Client info ~82% down
let clientY = pageHeight * 0.82;
doc.setFontSize(18);
doc.setFont('helvetica', 'bold');
doc.text('Prepared for:', 24, clientY);
doc.setFont('helvetica', 'normal');
doc.text('[Client Company Name]', 24, clientY + 8);

// --- RapidClaims footer ~91% down
let footerY = pageHeight * 0.91;
const logoSize = 14;

let logoOffset = 24;
doc.setFontSize(20);
doc.setFont('helvetica', 'bold');
doc.setTextColor(255, 69, 58); 
doc.text('Rapid', logoOffset, footerY);
let rapidWidth = doc.getTextWidth('Rapid ');
doc.setTextColor(255, 255, 255);
doc.text('Claims', logoOffset + 20, footerY);





  // ================== PAGE 2: EXECUTIVE SUMMARY ==================
   doc.addPage();

doc.setFillColor(255, 255, 255);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

let yPosition = 20;

doc.setTextColor(0, 0, 0);
doc.setFontSize(22);
doc.setFont('helvetica', 'bold');
doc.text('Your Financial Future at a Glance', pageWidth / 2, yPosition, { align: 'center' });

yPosition += 20;

doc.setTextColor(139, 92, 246);
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('Executive Summary', margin, yPosition);

yPosition += 8;
doc.setTextColor(0, 0, 0);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('This ROI analysis models the financial impact of adopting RapidClaims\' AI-powered', margin, yPosition);
yPosition += 5;
doc.text('medical coding solutions, using your organization\'s operational data.', margin, yPosition);

yPosition += 15;

doc.setTextColor(0, 0, 0);
doc.setFontSize(32);
doc.setFont('helvetica', 'bold');
doc.text(formatCurrency(data.calculations.totalImpact), margin, yPosition);

yPosition += 8;
doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.text('Estimated Annual Financial Impact', margin, yPosition);

yPosition += 15;

/* === ONE PURPLE TAB WITH DIVIDERS (instead of 3 small boxes) === */
const tabY = yPosition;
const tabHeight = 30;
const tabX = margin;
const tabW = pageWidth - 2 * margin;

// Draw background tab
doc.setFillColor(230, 214, 252); // #E6D6FC
doc.roundedRect(tabX, tabY, tabW, tabHeight, 4, 4, 'F');

// Divide into 3 equal sections
const sectionWidth = tabW / 3;

// Draw vertical dividers
doc.setDrawColor(200, 200, 200); // light gray
doc.setLineWidth(0.2);
doc.line(tabX + sectionWidth, tabY, tabX + sectionWidth, tabY + tabHeight);
doc.line(tabX + 2 * sectionWidth, tabY, tabX + 2 * sectionWidth, tabY + tabHeight);

// 1. Cost Savings
doc.setTextColor(0, 0, 0);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text(formatCurrency(data.calculations.totalCostSavings), tabX + sectionWidth / 2, tabY + 12, { align: 'center' });
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('in Cost Savings', tabX + sectionWidth / 2, tabY + 22, { align: 'center' });

// 2. Revenue Uplift
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text(formatCurrency(data.calculations.totalRevenueIncrease), tabX + sectionWidth + sectionWidth / 2, tabY + 12, { align: 'center' });
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('in Revenue Uplift', tabX + sectionWidth + sectionWidth / 2, tabY + 22, { align: 'center' });

// 3. Risk Reduction
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text(formatCurrency(data.calculations.totalRiskReduction), tabX + 2 * sectionWidth + sectionWidth / 2, tabY + 12, { align: 'center' });
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('in Risk Reduction', tabX + 2 * sectionWidth + sectionWidth / 2, tabY + 22, { align: 'center' });

yPosition += tabHeight + 15;
/* === END ONE PURPLE TAB === */

doc.setTextColor(0, 0, 0);
doc.setFontSize(10);
doc.setFont('helvetica', 'normal');
doc.text('The analysis shows a compelling return on investment, with strong cost reductions', margin, yPosition);
yPosition += 5;
doc.text('supported by compliance improvements and modest revenue uplift.', margin, yPosition);

yPosition += 15;

doc.setTextColor(0, 0, 0);
doc.setFontSize(18);
doc.setFont('helvetica', 'bold');
doc.text('The Story Behind the Numbers', pageWidth / 2, yPosition, { align: 'center' });

yPosition += 15;

// Calculate percentages first
const total = data.calculations.totalImpact;
const costSavingsPercent = Math.round((data.calculations.totalCostSavings / total) * 100);
const revenuePercent = Math.round((data.calculations.totalRevenueIncrease / total) * 100);
const riskPercent = Math.round((data.calculations.totalRiskReduction / total) * 100);

// Financial Impact Breakdown on the left
const breakdownStartY = yPosition;
doc.setTextColor(139, 92, 246);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Financial Impact Breakdown', margin, yPosition);

yPosition += 10;

doc.setTextColor(0, 0, 0);
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text(`${costSavingsPercent}% Cost Savings`, margin, yPosition);
yPosition += 6;
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('Driven by AI automation that boosts coder', margin, yPosition);
yPosition += 4;
doc.text('productivity and eliminates manual tasks.', margin, yPosition);

yPosition += 10;
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text(`${revenuePercent}% Revenue Increase`, margin, yPosition);
yPosition += 6;
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('Driven by improved coding accuracy that', margin, yPosition);
yPosition += 4;
doc.text('captures missed reimbursements.', margin, yPosition);

yPosition += 10;
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text(`${riskPercent}% Risk Reduction`, margin, yPosition);
yPosition += 6;
doc.setFontSize(9);
doc.setFont('helvetica', 'normal');
doc.text('Driven by enhanced compliance,', margin, yPosition);
yPosition += 4;
doc.text('reducing audit and penalty exposure.', margin, yPosition);

// Create pie chart on the right side
const canvas = document.createElement('canvas');
canvas.width = 150;
canvas.height = 150;

const chartData = [
  { label: '', value: data.calculations.totalCostSavings },
  { label: '', value: data.calculations.totalRevenueIncrease },
  { label: '', value: data.calculations.totalRiskReduction }
];

const chartColors = ['#8b5cf6', '#10b981', '#e9d5ff'];
createChart(canvas, 150, 150, chartData, chartColors);

// Position pie chart
const chartX = pageWidth - margin - 60;
const chartY = breakdownStartY - 5;

try {
  const chartDataUrl = canvas.toDataURL('image/png');
  doc.addImage(chartDataUrl, 'PNG', chartX, chartY, 50, 50);
} catch (error) {
  console.warn('Chart generation failed:', error);
}

// Legend below chart
const legendX = chartX + 25;
let legendY = chartY + 50;

const legendItems = [
  { color: '#8b5cf6', label: 'Cost Savings:', value: formatCurrency(data.calculations.totalCostSavings) },
  { color: '#10b981', label: 'Revenue Increase:', value: formatCurrency(data.calculations.totalRevenueIncrease) },
  { color: '#e9d5ff', label: 'Risk Reduction:', value: formatCurrency(data.calculations.totalRiskReduction) }
];

legendItems.forEach((item) => {
  doc.setFillColor(...hexToRgb(item.color));
  doc.circle(legendX - 15, legendY - 2, 2.5, 'F');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(item.label, legendX - 8, legendY);
  doc.setFont('helvetica', 'bold');
  doc.text(item.value, legendX + 25, legendY);

  legendY += 7;
});

// Quote at bottom
const quoteY = pageHeight - 40;
const quoteText = '"Imagine recovering every collectible dollar, automatically."';

doc.setFontSize(12);
doc.setFont('helvetica', 'italic');
const textWidth = doc.getTextWidth(quoteText);
const tabPadding = 10;
const tabWidth = textWidth + (tabPadding * 2);
const tabHeightQ = 8;
const tabXQ = (pageWidth / 2) - (tabWidth / 2);

doc.setFillColor(230, 214, 252); // Light purple background
doc.roundedRect(tabXQ, quoteY - 6, tabWidth, tabHeightQ, 2, 2, 'F');

doc.setTextColor(139, 92, 246);
doc.setFontSize(12);
doc.setFont('helvetica', 'italic');
doc.text(quoteText, pageWidth / 2, quoteY, { align: 'center' });

// Company name
doc.setTextColor(255, 69, 58);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Rapid', pageWidth - margin - 35, pageHeight - 15);
doc.setTextColor(0, 0, 0);
doc.text('Claims', pageWidth - margin - 35, pageHeight - 15 +32);


  // ================== PAGE 3: DETAILED ANALYSIS ==================
   
  doc.addPage();
yPosition = 30;

// Section: Detailed Financial Analysis
doc.setTextColor(139, 92, 246);
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text('Detailed Financial Analysis', margin, yPosition);

yPosition += 10;

// Sleek Rounded Tab Container
const tabRadius = 4;
const tabHeightPage3 = 40;
doc.setFillColor(230, 214, 252); // Light fill
doc.setDrawColor(220, 220, 220); // Soft border
doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, tabHeightPage3, tabRadius, tabRadius, 'FD');

yPosition += 6;

// Table Data
const tableData = [
  ['Category', 'Annual Value', 'Description'],
  ['Cost Savings', formatCurrency(data.calculations.totalCostSavings), 'Efficiency gains from autonomous coding and reduced manual work.'],
  ['Revenue Enhanced', formatCurrency(data.calculations.totalRevenueIncrease), 'Improved claim accuracy, fewer denials, increased approved reimbursements.'],
  ['Risk Mitigation', formatCurrency(data.calculations.totalRiskReduction), 'Compliance protection, reduced penalties, lower audit exposure.'],
  ['Total Benefit', formatCurrency(data.calculations.totalImpact), 'Combined annual financial impact']
];

const colWidths = [42, 38, 80];
const startX = margin + 8;

tableData.forEach((row, index) => {
  let xPos = startX;

  if (index === 0 || index === tableData.length - 1) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
  }

  doc.setTextColor(0, 0, 0);

  row.forEach((cell, colIndex) => {
    if (colIndex === 2) {
      const lines = doc.splitTextToSize(cell, colWidths[colIndex] - 4);
      doc.text(lines, xPos, yPosition);
    } else {
      doc.text(cell, xPos, yPosition);
    }
    xPos += colWidths[colIndex];
  });

  yPosition += index === 0 ? 5 : 7;
});

yPosition += 18;

  doc.setTextColor(139, 92, 246); 
  doc.setFontSize(14); 
  doc.setFont('helvetica', 'bold'); 
  doc.text('Organization Parameters', margin, yPosition);
  yPosition += 8; 
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12); 
  doc.setFont('helvetica', 'normal'); 
  doc.text('The ROI model uses your organizational inputs:', margin, yPosition);
  yPosition += 12;
// Section: Organization Parameters
const paramLabels = [
  '• Annual Revenue Claimed:',
  '• Number of Claims Per Year:',
  '• Average Cost per Claim:',
  '• Baseline Denial Rate & Backlog:'
];

const paramValues = [
  formatCurrency(data.metrics.revenueClaimed),
  formatNumber(data.metrics.claimsPerAnnum),
  'Derived from revenue and claim data.',
  'Applied as per inputs.'
];

paramLabels.forEach((label, index) => {
  // Bold label
  doc.setFont('helvetica', 'bold');
  doc.text(label, margin, yPosition);

  // Normal value (indented slightly to align nicely)
  doc.setFont('helvetica', 'normal');
  doc.text(paramValues[index], margin + 70, yPosition); // Adjust margin offset as needed

  yPosition += 12;
});

// Section: Conclusion
doc.setTextColor(139, 92, 246);
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.text('Conclusion', margin, yPosition);

yPosition += 10;
doc.setTextColor(0, 0, 0);
doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.text('The model demonstrates a positive ROI, delivering:', margin, yPosition);

yPosition += 10;

const conclusions = [
  `• ${formatCurrency(data.calculations.totalImpact)} annual benefit, driven primarily by cost savings.`,
  '• Reduced operational strain, freeing coders and physicians from manual tasks.',
  '• Compliance confidence, reducing the risk of costly penalties and audits.'
];

conclusions.forEach(conclusion => {
  doc.text(conclusion, margin, yPosition);
  yPosition += 7;
});

yPosition += 15;
doc.setTextColor(139, 92, 246);
doc.setFontSize(12);
doc.setFont('helvetica', 'bold');
doc.text('Recommendation:', margin, yPosition);

yPosition += 8;
doc.setTextColor(0, 0, 0);
doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
const recommendationText = 'Adoption of RapidClaims\' AI solutions provides a sustainable and scalable path to reduce costs, increase revenue capture, and improve compliance simultaneously.';
const lines = doc.splitTextToSize(recommendationText, pageWidth - 2 * margin);
doc.text(lines, margin, yPosition);

  
  
  

  // ================== PAGE 4: ADDITIONAL CONTENT ==================
  doc.addPage();
  
  yPosition = 40;
  
  // Page 4 header
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Implementation Roadmap & Success Metrics', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Note about additional content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('This page contains detailed implementation guidance and success metrics.', margin, yPosition);
  yPosition += 8;
  doc.text('Please refer to the separate Page4.pdf document for comprehensive details.', margin, yPosition);
  
  yPosition += 30;
  
  // Quick summary content
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Implementation Phases:', margin, yPosition);
  
  yPosition += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const phases = [
    '1. Assessment & Planning (Month 1)',
    '2. System Integration & Training (Month 2-3)',
    '3. Pilot Launch & Testing (Month 4)',
    '4. Full Deployment & Optimization (Month 5-6)'
  ];
  
  phases.forEach(phase => {
    doc.text(phase, margin, yPosition);
    yPosition += 12;
  });
  
  // ================== PAGE 5: ADDITIONAL CONTENT ==================
  doc.addPage();
  
  yPosition = 40;
  
  // Page 5 header
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Technical Specifications & Integration Guide', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 20;
  
  // Note about additional content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('This page contains technical specifications and integration details.', margin, yPosition);
  yPosition += 8;
  doc.text('Please refer to the separate Page5.pdf document for comprehensive details.', margin, yPosition);
  
  yPosition += 30;
  
  // Quick summary content
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('System Requirements:', margin, yPosition);
  
  yPosition += 15;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const requirements = [
    '• Cloud-based deployment with 99.9% uptime guarantee',
    '• HIPAA-compliant data security and encryption',
    '• API integration with existing EHR systems',
    '• Real-time processing capabilities'
  ];
  
  requirements.forEach(req => {
    doc.text(req, margin, yPosition);
    yPosition += 12;
  });

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
