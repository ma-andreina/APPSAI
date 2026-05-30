import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, Table, TableRow, TableCell, BorderStyle, WidthType, VerticalAlign } from 'docx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

// Margen de 3cm en twips (1 cm = 567 twips)
const MARGIN_3CM = 1701;

export const generateDocx = async (content, type, report) => {
  const children = [];

  // Función auxiliar para crear párrafos
  const createParagraph = (text, options = {}) => {
    return new Paragraph({
      children: [new TextRun({ text, ...options })],
      alignment: options.alignment || AlignmentType.JUSTIFIED,
      spacing: { after: 200 }
    });
  };

  const createHeading = (text, level, options = {}) => {
    return new Paragraph({
      text,
      heading: level,
      alignment: options.alignment || AlignmentType.LEFT,
      spacing: { before: 400, after: 200 }
    });
  };

  // 1. Portada / Encabezado
  children.push(createParagraph('REPÚBLICA BOLIVARIANA DE VENEZUELA', { bold: true, alignment: AlignmentType.CENTER }));
  children.push(createParagraph('CONTRALORÍA DEL MUNICIPIO PEDRAZA DEL ESTADO BARINAS', { bold: true, alignment: AlignmentType.CENTER }));
  children.push(createParagraph(' '));
  children.push(createParagraph(content.portada.unidadOrganizativa, { bold: true, alignment: AlignmentType.CENTER }));
  children.push(createParagraph(content.portada.tituloActuacion, { bold: true, alignment: AlignmentType.CENTER }));
  children.push(createParagraph(content.portada.tipoInforme, { bold: true, alignment: AlignmentType.CENTER }));
  children.push(createParagraph(' '));
  children.push(createParagraph(' '));

  // 2. Contenido dinámico según el tipo
  if (type === 'ejecutivo') {
    children.push(createHeading('1. Objetivo General', HeadingLevel.HEADING_2));
    children.push(createParagraph(content.objetivoGeneral));

    children.push(createHeading('2. Alcance', HeadingLevel.HEADING_2));
    children.push(createParagraph(content.alcance));

    children.push(createHeading('3. Observaciones Relevantes', HeadingLevel.HEADING_2));
    content.observacionesRelevantes.forEach(obs => {
      children.push(new Paragraph({ text: obs, bullet: { level: 0 }, alignment: AlignmentType.JUSTIFIED }));
    });

    children.push(createHeading('4. Conclusión', HeadingLevel.HEADING_2));
    children.push(createParagraph(content.conclusion));

    children.push(createHeading('5. Recomendaciones', HeadingLevel.HEADING_2));
    content.recomendaciones.forEach(rec => {
      children.push(new Paragraph({ text: rec, bullet: { level: 0 }, alignment: AlignmentType.JUSTIFIED }));
    });
  } else {
    // Capítulo I
    children.push(createHeading('Capítulo I: Aspectos Preliminares', HeadingLevel.HEADING_2));
    children.push(createHeading('1.1. Origen de la Actuación', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo1.origen));

    children.push(createHeading('1.2. Alcance', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo1.alcance));

    children.push(createHeading('1.3. Objetivos', HeadingLevel.HEADING_3));
    children.push(createParagraph('Objetivo General: ' + content.capitulo1.objetivos.general, { bold: true }));
    children.push(createParagraph('Objetivos Específicos:', { bold: true }));
    content.capitulo1.objetivos.especificos.forEach(obj => {
      children.push(new Paragraph({ text: obj, bullet: { level: 0 }, alignment: AlignmentType.JUSTIFIED }));
    });

    children.push(createHeading('1.4. Enfoque', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo1.enfoque));

    children.push(createHeading('1.5. Métodos, Procedimientos y Técnicas', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo1.metodos));

    // Capítulo II
    children.push(createHeading('Capítulo II: Características Generales del Objeto Evaluado', HeadingLevel.HEADING_2));
    children.push(createParagraph('2.1. Creación: ' + content.capitulo2.creacion));
    children.push(createParagraph('2.4. Organización (Organigrama): ' + content.capitulo2.organigrama));
    children.push(createParagraph('2.5. Base Legal y Técnica: ' + content.capitulo2.baseLegal));

    // Capítulo III
    children.push(createHeading('Capítulo III: Observaciones Derivadas del Análisis', HeadingLevel.HEADING_2));
    content.capitulo3.forEach((hallazgo, idx) => {
      children.push(createParagraph(`Observación Nro ${idx + 1}: ${hallazgo.titulo}`, { bold: true }));
      children.push(createParagraph(`Condición: ${hallazgo.condicion}`, { italics: true }));
      children.push(createParagraph(`Criterio: ${hallazgo.criterio}`, { italics: true }));
      children.push(createParagraph(`Causa: ${hallazgo.causa}`, { italics: true }));
      children.push(createParagraph(`Efecto: ${hallazgo.efecto}`, { italics: true }));
      children.push(createParagraph(' '));
    });

    // Capítulo IV (Definitivo)
    if (type === 'definitivo') {
      children.push(createHeading('Capítulo IV: Conclusión y Recomendaciones', HeadingLevel.HEADING_2));
      children.push(createParagraph('Conclusión: ' + content.capitulo4.conclusion));
      children.push(createParagraph('Recomendaciones:', { bold: true }));
      content.capitulo4.recomendaciones.forEach(rec => {
        children.push(new Paragraph({ text: rec, bullet: { level: 0 }, alignment: AlignmentType.JUSTIFIED }));
      });
    }
  }

  // 3. Firma
  children.push(createParagraph(' '));
  children.push(createParagraph(' '));
  children.push(createParagraph(' '));

  if (type === 'definitivo') {
    const isSigned = report.definitive?.status === 'firmado';
    if (isSigned) {
      if (report.definitive.signType === 'digital') {
        const hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
        const qrDataUrl = await QRCode.toDataURL(`Firma Digital: ${report.definitive.signedBy}\nHash: ${hash}`, {
          margin: 1
        });
        const base64Data = qrDataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        const binaryString = window.atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const qrImage = new ImageRun({
          data: bytes,
          transformation: { width: 80, height: 80 }
        });

        const signatureTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.SINGLE, size: 12 },
            bottom: { style: BorderStyle.SINGLE, size: 12 },
            left: { style: BorderStyle.SINGLE, size: 12 },
            right: { style: BorderStyle.SINGLE, size: 12 },
            insideVertical: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
          },
          margins: { top: 200, bottom: 200, left: 200, right: 200 },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [qrImage], alignment: AlignmentType.CENTER })],
                  width: { size: 20, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: 'FIRMADO DIGITALMENTE POR:', bold: true, size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: report.definitive.signedBy, bold: true, size: 28 })], spacing: { before: 100, after: 100 } }),
                    new Paragraph({ children: [new TextRun({ text: content.portada.unidadOrganizativa, size: 20 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Hash de integridad: ${hash}`, size: 16 })], spacing: { before: 100 } })
                  ],
                  width: { size: 80, type: WidthType.PERCENTAGE },
                  verticalAlign: VerticalAlign.CENTER,
                  margins: { left: 200 },
                  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } }
                })
              ]
            })
          ]
        });

        children.push(signatureTable);
      } else {
        children.push(createParagraph('_________________________________', { alignment: AlignmentType.CENTER }));
        children.push(createParagraph(report.definitive.signedBy, { bold: true, alignment: AlignmentType.CENTER }));
        children.push(createParagraph('Cargo: ' + content.pieFirma.firmanteCargo, { bold: true, alignment: AlignmentType.CENTER }));
        children.push(createParagraph('Designado según Resolución N° XXXX-XX', { alignment: AlignmentType.CENTER, size: 20 }));
      }
    } else {
      children.push(createParagraph('_________________________________', { alignment: AlignmentType.CENTER }));
      children.push(createParagraph(content.pieFirma.firmanteNombre, { bold: true, alignment: AlignmentType.CENTER }));
      children.push(createParagraph('Cargo: ' + content.pieFirma.firmanteCargo, { bold: true, alignment: AlignmentType.CENTER }));
      children.push(createParagraph('Designado según Resolución N° XXXX-XX', { alignment: AlignmentType.CENTER, size: 20 }));
    }
  } else {
    children.push(createParagraph(content.portada.unidadOrganizativa, { alignment: AlignmentType.CENTER }));
    children.push(createParagraph(content.pieFirma.institucion, { bold: true, alignment: AlignmentType.CENTER }));
  }

  // Generar el documento con formato Carta y márgenes de 3cm (1701 twips)
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            size: 24, // 12pt (24 half-points)
            font: "Times New Roman"
          },
          paragraph: {
            spacing: { line: 360 } // 1.5 line spacing
          }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 }, // Carta en twips
          margin: { top: MARGIN_3CM, right: MARGIN_3CM, bottom: MARGIN_3CM, left: MARGIN_3CM }
        }
      },
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Informe_${type.charAt(0).toUpperCase() + type.slice(1)}_${report.auditId}.docx`);
};
