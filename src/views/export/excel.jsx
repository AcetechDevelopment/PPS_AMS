import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export const exportToExcel = (data, fileName = "Export") => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data found for export");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);

    const range = XLSX.utils.decode_range(worksheet["!ref"]);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);

        if (!worksheet[cell_ref]) continue;

       worksheet[cell_ref].s = {
            border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
            },
            fill: R === 0 ? { fgColor: { rgb: "FFFF00" } } : undefined,
            font: R === 0 ? { bold: true, color: { rgb: "000000" } } : undefined,
            };

        if (R === 0) {
          worksheet[cell_ref].s.fill = {
            fgColor: { rgb: "FFFF00" },
          };
          worksheet[cell_ref].s.font = {
            bold: true,
            color: { rgb: "000000" },
          };
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Export error:", error);
    alert("Failed to export Excel");
  }
};
