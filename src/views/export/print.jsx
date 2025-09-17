export const exportToPrint = (data, fileName = "Export") => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No data found for export");
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data
      .map(
        (obj) =>
          `<tr>${headers.map((h) => `<td>${obj[h]}</td>`).join("")}</tr>`
      )
      .join("");

    const tableHTML = `
      <html>
      <head>
        <title>${fileName}</title>
        <style>
          @page {
            size: auto;
            margin: 10mm;
          }
          @media print {
            table {
              width: 100%;
              table-layout: fixed;
              word-wrap: break-word;
            }
            th, td {
              font-size: 12px;
              padding: 6px;
              border: 1px solid #333;
              text-align: left;
            }
            th {
              background: #f4f4f4;
            }
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
          }
          h2 {
            text-align: center;
            margin-bottom: 20px;
          }
          table { border-collapse: collapse; width: 100%; }
        </style>
      </head>
      <body>
        <h2>${fileName}</h2>
        <table>
          <thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <script>
          if (document.querySelector('table').offsetWidth > document.body.offsetHeight) {
            const style = document.createElement('style');
            style.innerHTML = '@page { size: landscape; }';
            document.head.appendChild(style);
          } else {
            const style = document.createElement('style');
            style.innerHTML = '@page { size: portrait; }';
            document.head.appendChild(style);
          }
          window.onafterprint = () => window.close();
          window.print();
        </script>
      </body>
      </html>
    `;
    const printWin = window.open("", "_blank");
    printWin.document.write(tableHTML);
    printWin.document.close();
  } catch (error) {
    console.error("Print Error:", error);
    alert("Failed to print report");
  }
};
