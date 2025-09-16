import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = (data, fileName = "Export") => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data found for export");
      return;
    }

    const headers = Object.keys(data[0]);
    const body = data.map(obj => headers.map(h => obj[h]));

    const estimatedCellWidth = 70;
    const totalTableWidth = headers.length * estimatedCellWidth + 80; 

    const a4PortraitWidth = 595;
    const a4LandscapeWidth = 842;

    let pageOrientation = "portrait";
    let pageWidth = a4PortraitWidth;

    if (totalTableWidth > a4PortraitWidth) {
      pageOrientation = "landscape";
      pageWidth = Math.max(totalTableWidth, a4LandscapeWidth);
    }

    const doc = new jsPDF({
      orientation: pageOrientation,
      unit: "pt",
      format: [pageWidth, 842], 
    });

    doc.text("Vehicle Report", 40, 30);

    autoTable(doc, {
      head: [headers],
      body: body,
      startY: 50,
      theme: "grid",
      styles: { fontSize: 8, cellWidth: "auto" },
      headStyles: { fillColor: [128, 128, 128] },
      tableWidth: "wrap",
      pageBreak: "avoid",
    });

    doc.save(fileName + ".pdf");
  } catch (error) {
    console.error("PDF Export Error:", error);
    alert("Failed to export PDF");
  }
};
