import { jsPDF } from "jspdf";
import type { SerializedEvent } from "@/lib/models/Event";

const MARGIN = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 7;

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  lines.forEach((line) => {
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

export function exportEventToPdf(event: SerializedEvent): void {
  const doc = new jsPDF();
  let y = MARGIN;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Event Details", MARGIN, y);
  y += 14;

  doc.setFontSize(16);
  doc.text(event.eventName, MARGIN, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(`Date: ${event.eventDateFormatted}`, MARGIN, y);
  y += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Speaker", MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(event.speakerName, MARGIN, y);
  y += LINE_HEIGHT;
  doc.setTextColor(80, 80, 80);
  doc.text(event.speakerDesignation, MARGIN, y);
  y += 12;

  doc.setTextColor(0, 0, 0);

  if (event.description) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("About the Event", MARGIN, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y = addWrappedText(doc, event.description, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);
    y += 6;
  }

  if (event.speakerIntro) {
    if (y > 250) {
      doc.addPage();
      y = MARGIN;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Speaker Introduction", MARGIN, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    y = addWrappedText(doc, event.speakerIntro, MARGIN, y, CONTENT_WIDTH, LINE_HEIGHT);
  }

  const safeName = event.eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  doc.save(`${safeName}_event.pdf`);
}
