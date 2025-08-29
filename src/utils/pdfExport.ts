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

// ===== Layout helpers to ensure visibility =====
const PAGE_MARGIN = 20;
const LINE_HEIGHT = 7;

function ensureSpace(doc: jsPDF, y: number, neededHeight = 0): number {
  const pageHeight = doc.internal.pageSize.height;
  if (y + neededHeight > pageHeight - PAGE_MARGIN) {
    doc.addPage();
    return PAGE_MARGIN;
  }
  return y;
}

function addWrappedText(
  doc: jsPDF,
  text: string | string[],
  x: number,
  y: number,
  width: number,
  options?: { fontSize?: number; fontStyle?: 'normal' | 'bold' | 'italic'; align?: 'left' | 'center' | 'right' }
): number {
  const pageHeight = doc.internal.pageSize.height;
  const fontSize = options?.fontSize ?? 11;
  const fontStyle = options?.fontStyle ?? 'normal';
  const align = options?.align ?? 'left';

  doc.setFontSize(fontSize);
  doc.setFont('helvetica', fontStyle);

  const textStr = Array.isArray(text) ? text.join(' ') : text;
  const lines = doc.splitTextToSize(textStr, width);

  lines.forEach((line) => {
    if (y > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      y = PAGE_MARGIN;
    }
    if (align === 'left') {
      doc.text(line, x, y);
    } else if (align === 'center') {
      doc.text(line, x + width / 2, y, { align: 'center' });
    } else {
      doc.text(line, x + width, y, { align: 'right' });
    }
    y += LINE_HEIGHT;
  });
  return y;
}

function addTableRow(
  doc: jsPDF,
  row: string[],
  startX: number,
  startY: number,
  colWidths: number[],
  options?: { header?: boolean; bold?: boolean; fontSize?: number }
): number {
  const fontSize = options?.fontSize ?? 10;
  const bold = options?.header || options?.bold ? 'bold' : 'normal';

  // Compute wrapped lines per cell and row height
  const wrappedCells = row.map((cell, i) => doc.splitTextToSize(cell, colWidths[i] - 2));
  let rowHeight = Math.max(...wrappedCells.map((lines) => Math.max(LINE_HEIGHT, lines.length * LINE_HEIGHT)));

  // Page break if needed
  let y = ensureSpace(doc, startY, rowHeight);
  let x = startX;

  // Draw text cells
  for (let i = 0; i < row.length; i++) {
    doc.setFont('helvetica', bold);
    doc.setFontSize(fontSize);
    doc.text(wrappedCells[i], x, y);
    x += colWidths[i];
  }
  return y + rowHeight;
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

    // Draw label with better positioning and formatting
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelRadius = radius + 30;
    const labelX = centerX + Math.cos(labelAngle) * labelRadius;
    const labelY = centerY + Math.sin(labelAngle) * labelRadius;

    // Determine text alignment based on position
    let textAlign: CanvasTextAlign = 'center';
    if (labelX < centerX - radius * 0.5) textAlign = 'right';
    else if (labelX > centerX + radius * 0.5) textAlign = 'left';

    // Draw white background for better readability
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = textAlign;
    const textMetrics = ctx.measureText(item.label);
    const textWidth = textMetrics.width;
    const textHeight = 12;

    let bgX = labelX;
    if (textAlign === 'right') bgX -= textWidth;
    else if (textAlign === 'center') bgX -= textWidth / 2;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(bgX - 3, labelY - textHeight, textWidth + 6, textHeight + 4);

    // Draw text with dark color
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(item.label, labelX, labelY);

    currentAngle += sliceAngle;
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
  const fileName = `rapidroi-analysis-${new Date().toISOString().split('T')}.pdf`;
  doc.save(fileName);
};

const createPDFContent = async (doc: jsPDF, data: ExportData): Promise<void> => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = PAGE_MARGIN;

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
    doc.rect(0, (pageHeight * i) / 20, pageWidth, pageHeight / 20, 'F');
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
  // Allow long client names to wrap and remain centered
  const clientNameY = pageHeight / 2 + 55;
  addWrappedText(doc, '[Client Company Name]', margin, clientNameY, pageWidth - 2 * margin, { fontSize: 16, align: 'center' });

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

  let yPosition = margin;

  // Header
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Financial Future at a Glance', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 25;

  // Executive Summary section
  doc.setTextColor(139, 92, 246); // Purple
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  yPosition = addWrappedText(
    doc,
    "This ROI analysis models the financial impact of adopting RapidClaims' AI-powered medical coding solutions, using your organization's operational data.",
    margin,
    yPosition,
    pageWidth - 2 * margin,
    { fontSize: 11 }
  );
  yPosition += 10;

  // Large financial impact number
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.calculations.totalImpact), margin, yPosition);
  yPosition += 14;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Estimated Annual Financial Impact', margin, yPosition);
  yPosition += 20;

  // Three metric boxes
  const boxGap = 12;
  const boxWidth = (pageWidth - 2 * margin - 2 * boxGap) / 3;
  const boxHeight = 30;
  yPosition = ensureSpace(doc, yPosition, boxHeight);

  // Cost Savings box
  doc.setFillColor(240, 248, 255);
  doc.rect(margin, yPosition, boxWidth, boxHeight, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(margin, yPosition, boxWidth, boxHeight, 'S');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.calculations.totalCostSavings), margin + boxWidth / 2, yPosition + 16, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('in Cost Savings', margin + boxWidth / 2, yPosition + 26, { align: 'center' });

  // Revenue Uplift box
  const box2X = margin + boxWidth + boxGap;
  doc.setFillColor(240, 248, 255);
  doc.rect(box2X, yPosition, boxWidth, boxHeight, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(box2X, yPosition, boxWidth, boxHeight, 'S');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.calculations.totalRevenueIncrease), box2X + boxWidth / 2, yPosition + 16, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('in Revenue Uplift', box2X + boxWidth / 2, yPosition + 26, { align: 'center' });

  // Risk Reduction box
  const box3X = margin + 2 * (boxWidth + boxGap);
  doc.setFillColor(240, 248, 255);
  doc.rect(box3X, yPosition, boxWidth, boxHeight, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(box3X, yPosition, boxWidth, boxHeight, 'S');

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.calculations.totalRiskReduction), box3X + boxWidth / 2, yPosition + 16, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('in Risk Reduction', box3X + boxWidth / 2, yPosition + 26, { align: 'center' });

  yPosition += boxHeight + 15;

  // Analysis text
  doc.setTextColor(0, 0, 0);
  yPosition = addWrappedText(
    doc,
    'The analysis shows a compelling return on investment, with strong cost reductions supported by compliance improvements and modest revenue uplift.',
    margin,
    yPosition,
    pageWidth - 2 * margin,
    { fontSize: 11 }
  );
  yPosition += 15;

  // The Story Behind the Numbers
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('The Story Behind the Numbers', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Financial Impact Breakdown
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Financial Impact Breakdown', margin, yPosition);
  yPosition += 15;

  // Compute percents
  const totalBenefit = Math.max(1, data.calculations.totalImpact);
  const costSavingsPercent = Math.round((data.calculations.totalCostSavings / totalBenefit) * 100);
  const revenuePercent = Math.round((data.calculations.totalRevenueIncrease / totalBenefit) * 100);
  const riskPercent = Math.round((data.calculations.totalRiskReduction / totalBenefit) * 100);

  // Create pie chart
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;

  const chartData = [
    { label: `${costSavingsPercent}%`, value: data.calculations.totalCostSavings },
    { label: `${revenuePercent}%`, value: data.calculations.totalRevenueIncrease },
    { label: `${riskPercent}%`, value: data.calculations.totalRiskReduction }
  ];

  const chartColors = ['#8b5cf6', '#10b981', '#e5e7eb']; // Purple, Green, Light Gray
  createChart(canvas, 200, 200, chartData, chartColors);

  // Ensure space for chart + breakdown
  yPosition = ensureSpace(doc, yPosition, 70);
  try {
    const chartDataUrl = canvas.toDataURL('image/png');
    doc.addImage(chartDataUrl, 'PNG', pageWidth - margin - 80, yPosition - 10, 60, 60);
  } catch (error) {
    // Fail silently if canvas not available
  }

  // Left side breakdown text (wrapped)
  doc.setTextColor(0, 0, 0);
  yPosition = addWrappedText(doc, `${costSavingsPercent}% Cost Savings`, margin, yPosition, pageWidth / 2 - margin, { fontSize: 14, fontStyle: 'bold' });
  yPosition = addWrappedText(
    doc,
    'Driven by AI automation that boosts coder productivity and eliminates manual tasks.',
    margin,
    yPosition,
    pageWidth / 2 - margin,
    { fontSize: 10 }
  );
  yPosition += 8;

  yPosition = addWrappedText(doc, `${revenuePercent}% Revenue Increase`, margin, yPosition, pageWidth / 2 - margin, { fontSize: 14, fontStyle: 'bold' });
  yPosition = addWrappedText(
    doc,
    'Driven by improved coding accuracy that captures missed reimbursements.',
    margin,
    yPosition,
    pageWidth / 2 - margin,
    { fontSize: 10 }
  );
  yPosition += 8;

  yPosition = addWrappedText(doc, `${riskPercent}% Risk Reduction`, margin, yPosition, pageWidth / 2 - margin, { fontSize: 14, fontStyle: 'bold' });
  yPosition = addWrappedText(
    doc,
    'Driven by enhanced compliance, reducing audit and penalty exposure.',
    margin,
    yPosition,
    pageWidth / 2 - margin,
    { fontSize: 10 }
  );

  // Legend on the right
  const legendX = pageWidth - margin - 120;
  let legendY = yPosition + 12;

  const legendItems = [
    { color: '#8b5cf6', label: 'Cost Savings:', value: formatCurrency(data.calculations.totalCostSavings) },
    { color: '#10b981', label: 'Revenue Increase:', value: formatCurrency(data.calculations.totalRevenueIncrease) },
    { color: '#e5e7eb', label: 'Risk Reduction:', value: formatCurrency(data.calculations.totalRiskReduction) }
  ];

  legendItems.forEach(() => {
    legendY = ensureSpace(doc, legendY, 10);
  });

  legendItems.forEach((item) => {
    doc.setFillColor(...hexToRgb(item.color));
    doc.circle(legendX, legendY - 2, 3, 'F');

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, legendX + 8, legendY);
    doc.setFont('helvetica', 'bold');
    doc.text(item.value, legendX + 45, legendY);

    legendY += 10;
  });

  // Quote at bottom
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text('"Imagine recovering every collectible dollar, automatically."', pageWidth / 2, pageHeight - 50, { align: 'center' });

  // RapidClaims footer
  doc.setTextColor(255, 69, 58);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Rapid', pageWidth - margin - 35, pageHeight - 20);
  doc.setTextColor(0, 0, 0);
  doc.text('Claims', pageWidth - margin - 5, pageHeight - 20);

  // ================== PAGE 3: DETAILED ANALYSIS ==================
  doc.addPage();

  yPosition = margin;

  // Detailed Financial Analysis
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Detailed Financial Analysis', margin, yPosition);
  yPosition += 15;

  // Table with wrapped cells and dynamic row heights
  const tableData = [
    ['Category', 'Annual Value', 'Description'],
    ['Cost Savings', formatCurrency(data.calculations.totalCostSavings), 'Operational efficiency gains from autonomous coding and reduced manual work.'],
    ['Revenue Enhanced', formatCurrency(data.calculations.totalRevenueIncrease), 'Improved claim accuracy, fewer denials, increased approved reimbursements.'],
    ['Risk Mitigation', formatCurrency(data.calculations.totalRiskReduction), 'Compliance protection, reduced penalties, lower audit exposure.'],
    ['Total Benefit', formatCurrency(data.calculations.totalImpact), 'Combined annual financial impact.']
  ];

  const colWidths = [45, 40, pageWidth - 2 * margin - 85];
  for (let i = 0; i < tableData.length; i++) {
    const header = i === 0;
    yPosition = addTableRow(doc, tableData[i], margin, yPosition, colWidths, { header, fontSize: header ? 11 : 10 });
  }

  yPosition += 10;

  // Organization Parameters
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Organization Parameters', margin, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  yPosition = addWrappedText(doc, 'The ROI model uses your organizational inputs:', margin, yPosition, pageWidth - 2 * margin, { fontSize: 11 });
  const params = [
    `• Annual Revenue Claimed: ${formatCurrency(data.metrics.revenueClaimed)}`,
    `• Number of Claims Per Year: ~${formatNumber(data.metrics.claimsPerAnnum)}`,
    '• Average Cost per Claim: Derived from revenue and claim data.',
    '• Baseline Denial Rate & Backlog: Applied as per inputs.'
  ];
  params.forEach((param) => {
    yPosition = addWrappedText(doc, param, margin, yPosition, pageWidth - 2 * margin, { fontSize: 10 });
  });

  yPosition += 5;

  // Conclusion
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Conclusion', margin, yPosition);
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  yPosition = addWrappedText(doc, 'The model demonstrates a positive ROI, delivering:', margin, yPosition, pageWidth - 2 * margin, { fontSize: 11 });

  const conclusions = [
    `• ${formatCurrency(data.calculations.totalImpact)} annual benefit, driven primarily by cost savings.`,
    '• Reduced operational strain, freeing coders and physicians from manual tasks.',
    '• Compliance confidence, reducing the risk of costly penalties and audits.'
  ];
  conclusions.forEach((conclusion) => {
    yPosition = addWrappedText(doc, conclusion, margin, yPosition, pageWidth - 2 * margin, { fontSize: 10 });
  });

  yPosition = addWrappedText(doc, 'Recommendation:', margin, yPosition + 2, pageWidth - 2 * margin, { fontSize: 11, fontStyle: 'bold' });
  yPosition = addWrappedText(
    doc,
    "Adoption of RapidClaims' AI solutions provides a sustainable and scalable path to reduce costs, increase revenue capture, and improve compliance simultaneously.",
    margin + 10,
    yPosition,
    pageWidth - 2 * margin - 10,
    { fontSize: 11 }
  );

  // ================== PAGE 4: FOUR PILLARS ==================
  doc.addPage();

  yPosition = margin;

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

  yPosition += 20;

  // Four boxes in a 2x2 grid with dynamic heights
  const gridGap = 15;
  const boxWidth2 = (pageWidth - 2 * margin - gridGap) / 2;

  const pillars = [
    { title: 'Coder Productivity', desc: 'AI reduces time per chart by up to 100%.' },
    { title: 'Billing Automation', desc: '40% fewer denials and faster turnaround.' },
    { title: 'Physician Time Saved', desc: 'Fewer queries and documentation bottlenecks.' },
    { title: 'Tech Cost Optimization', desc: 'Replace legacy systems and reduce IT overhead.' }
  ];

  for (let i = 0; i < pillars.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    let boxX = margin + col * (boxWidth2 + gridGap);
    let boxY = yPosition + row * 60;

    // Wrap description to compute height
    const descLines = doc.splitTextToSize(pillars[i].desc, boxWidth2 - 20);
    const contentHeight = 18 + descLines.length * (LINE_HEIGHT - 1) + 12; // title + desc + padding
    const boxHeight2 = Math.max(40, contentHeight);

    // Avoid overflow
    if (boxY + boxHeight2 > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
      boxY = yPosition;
    }

    // Box
    doc.setFillColor(240, 248, 255);
    doc.rect(boxX, boxY, boxWidth2, boxHeight2, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(boxX, boxY, boxWidth2, boxHeight2, 'S');

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(pillars[i].title, boxX + 10, boxY + 14);

    // Desc
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(descLines, boxX + 10, boxY + 26);
  }

  // After 2x2 grid, advance Y
  yPosition += 2 * 60 + 10;

  // Quote
  yPosition = addWrappedText(
    doc,
    '"Free your team to focus on what matters most: patient care and complex cases."',
    margin,
    yPosition,
    pageWidth - 2 * margin,
    { fontSize: 14, fontStyle: 'italic', align: 'center' }
  );

  yPosition += 10;

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

  yPosition += 18;

  // Implementation header and text (wrapped)
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Implementation | Seamless Deployment in 8 Weeks', margin, yPosition);

  yPosition += 10;
  doc.setTextColor(0, 0, 0);
  yPosition = addWrappedText(
    doc,
    'Accelerate implementation with structured AI integration, real-time automation, and ongoing enhancements to maximize accuracy, compliance, and financial impact.',
    margin,
    yPosition,
    pageWidth - 2 * margin,
    { fontSize: 11 }
  );

  // ================== PAGE 5: GROWTH & COMPARISON ==================
  doc.addPage();

  yPosition = margin;

  // Header
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Consistently delivering > 6x ROI?', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 22;

  // What makes us different
  doc.setFontSize(20);
  doc.text('What makes us different?', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 14;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  yPosition = addWrappedText(
    doc,
    'Clear ROI, seamless integration, and best-in-class automation: a system that pays for itself in less than 3 months.',
    margin,
    yPosition,
    pageWidth - 2 * margin,
    { fontSize: 11, align: 'center' }
  );
  yPosition += 10;

  // Comparison table header
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('What makes RapidClaims Unique?', margin, yPosition);

  doc.setTextColor(255, 69, 58);
  doc.text('RapidClaims', pageWidth / 2 - 20, yPosition);

  doc.setTextColor(0, 0, 0);
  doc.text('The Rest', pageWidth - margin - 60, yPosition);

  yPosition += 12;

  // Comparison rows with wrapped columns and dynamic row height
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

  const c1X = margin;
  const c2X = pageWidth / 2 - 20;
  const c3X = pageWidth - margin - 100;
  const c1W = c2X - c1X - 8;
  const c2W = 90;
  const c3W = 100;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  for (const [feature, rapid, rest] of comparisons) {
    const fLines = doc.splitTextToSize(feature, c1W);
    const r1Lines = doc.splitTextToSize(rapid, c2W);
    const r2Lines = doc.splitTextToSize(rest, c3W);
    const rowHeight = Math.max(fLines.length, r1Lines.length, r2Lines.length) * (LINE_HEIGHT - 2) + 6;

    yPosition = ensureSpace(doc, yPosition, rowHeight);

    doc.setTextColor(0, 0, 0);
    doc.text(fLines, c1X, yPosition);

    doc.setTextColor(255, 69, 58);
    doc.text(r1Lines, c2X, yPosition);

    doc.setTextColor(0, 0, 0);
    doc.text(r2Lines, c3X, yPosition);

    yPosition += rowHeight;
  }

  yPosition += 10;

  // Ready to Unlock Your ROI
  doc.setTextColor(139, 92, 246);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  yPosition = ensureSpace(doc, yPosition, 20);
  doc.text('Ready to Unlock Your ROI?', pageWidth / 2, yPosition, { align: 'center' });

  // Final RapidClaims logo
  const footerY = doc.internal.pageSize.height - 40;
  doc.setTextColor(255, 69, 58);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Rapid', pageWidth / 2 - 20, footerY, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  doc.text('Claims', pageWidth / 2 + 10, footerY, { align: 'center' });
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[9], 16), parseInt(result[11], 16), parseInt(result[12], 16)]
    : [0, 0, 0];
};
