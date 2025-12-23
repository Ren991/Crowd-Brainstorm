import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportSessionToPDF = (data: any) => {
  const { session, workflows } = data;

  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text("Resumen de Sesión", 14, 20);

  doc.setFontSize(12);
  doc.text(`Título: ${session.title}`, 14, 30);
  doc.text(`Código: ${session.code}`, 14, 38);

  let y = 50;

  workflows.forEach((wf: any, index: number) => {
    doc.setFontSize(14);
    doc.text(`Workflow ${index + 1}: ${wf.title}`, 14, y);
    y += 6;

    const ideasTable = wf.ideas.map((idea: any) => [
      idea.text,
      idea.author,
      idea.votesCount ?? 0
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Idea", "Autor", "Votos"]],
      body: ideasTable,
      styles: { fontSize: 10 }
    });

    y = (doc as any).lastAutoTable.finalY + 6;

    // 🏆 Top 3
    const top3 = wf.ideas.slice(0, 3);

    if (top3.length) {
      doc.setFontSize(12);
      doc.text("Top 3 Ideas", 14, y);
      y += 4;

      top3.forEach((idea: any, i: number) => {
        doc.text(
          `${i + 1}. ${idea.text} (${idea.votesCount} votos)`,
          16,
          y
        );
        y += 5;
      });
    }

    y += 10;

    // nueva página si es necesario
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save(`Sesion-${session.code}.pdf`);
};
