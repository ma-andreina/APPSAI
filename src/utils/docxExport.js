import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, Table, TableRow, TableCell, BorderStyle, WidthType, VerticalAlign, Header, Footer } from 'docx';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode';

// Margen de 3cm en twips (1 cm = 567 twips)
const MARGIN_3CM = 1701;

/**
 * Función auxiliar para descargar imágenes y obtener los bytes
 */
const fetchImageAsArrayBuffer = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error fetching ${url}`);
  const blob = await response.blob();
  return new Uint8Array(await blob.arrayBuffer());
};

export const generateDocx = async (content, type, report) => {
  // 0. Cargar los logos oficiales
  let logoLeftBytes = null;
  let logoRightBytes = null;
  try {
    logoLeftBytes = await fetchImageAsArrayBuffer('/cmp-logo.png');
    logoRightBytes = await fetchImageAsArrayBuffer('/sncf-logo.png');
  } catch (err) {
    console.error("Error cargando logos oficiales para la exportación Word:", err);
  }

  const children = [];

  // Función auxiliar para crear párrafos
  const createParagraph = (text, options = {}) => {
    return new Paragraph({
      children: [new TextRun({ text, font: "Arial", ...options })],
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

  // 1. Portada del Informe (en el cuerpo, excluyendo la cabecera repetitiva)
  children.push(createParagraph(content.portada.unidadOrganizativa, { bold: true, alignment: AlignmentType.CENTER, size: 28 })); // 14pt
  children.push(createParagraph(content.portada.tituloActuacion, { bold: true, alignment: AlignmentType.CENTER, size: 28 })); // 14pt
  children.push(createParagraph(content.portada.tipoInforme, { bold: true, alignment: AlignmentType.CENTER, size: 28 })); // 14pt
  children.push(createParagraph(' '));

  // 2. Contenido dinámico según el tipo
  if (type === 'ejecutivo') {
    children.push(createHeading('1. Objetivo General', HeadingLevel.HEADING_2));
    children.push(createParagraph(content.objetivoGeneral));

    children.push(createHeading('2. Alcance', HeadingLevel.HEADING_2));
    children.push(createParagraph(content.alcance));

    children.push(createHeading('3. Observaciones Relevantes', HeadingLevel.HEADING_2));
    content.observacionesRelevantes.forEach(obs => {
      children.push(new Paragraph({
        children: [new TextRun({ text: obs, font: "Arial" })],
        bullet: { level: 0 },
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120 }
      }));
    });

    children.push(createHeading('4. Conclusión', HeadingLevel.HEADING_2));
    children.push(createParagraph(content.conclusion));

    children.push(createHeading('5. Recomendaciones', HeadingLevel.HEADING_2));
    content.recomendaciones.forEach(rec => {
      children.push(new Paragraph({
        children: [new TextRun({ text: rec, font: "Arial" })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120 }
      }));
    });
  } else {
    // Capítulo I
    children.push(createHeading('Capítulo I: Aspectos Preliminares', HeadingLevel.HEADING_2));
    children.push(createHeading('1.1. Origen de la Actuación', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo1.origen));

    children.push(createHeading('1.2. Alcance', HeadingLevel.HEADING_3));
    children.push(createParagraph(typeof content.capitulo1.alcance === 'string' ? content.capitulo1.alcance.replace(/\b(\d{4})-(\d{2})-(\d{2})\b/g, '$3-$2-$1') : content.capitulo1.alcance));

    children.push(createHeading('1.3. Objetivos', HeadingLevel.HEADING_3));
    children.push(createParagraph('Objetivo General: ' + content.capitulo1.objetivos.general, { bold: true }));
    children.push(createParagraph('Objetivos Específicos:', { bold: true }));
    content.capitulo1.objetivos.especificos.forEach(obj => {
      children.push(new Paragraph({
        children: [new TextRun({ text: obj, font: "Arial" })],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120 }
      }));
    });

    children.push(createHeading('1.4. Enfoque', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo1.enfoque));

    children.push(createHeading('1.5. Métodos, Procedimientos y Técnicas', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo1.metodos));

    // Capítulo II
    children.push(createHeading('Capítulo II: Características Generales del Objeto Evaluado', HeadingLevel.HEADING_2));
    children.push(createHeading('2.1. Creación', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo2.creacion));

    children.push(createHeading('2.2. Base Legal y Técnica', HeadingLevel.HEADING_3));
    children.push(createParagraph(content.capitulo2.baseLegal));

    // Capítulo III
    children.push(createHeading('Capítulo III: Observaciones Derivadas del Análisis', HeadingLevel.HEADING_2));
    if (content.capitulo3.length === 0) {
      children.push(createParagraph('No se registraron observaciones derivadas del análisis.', { italics: true }));
    } else {
      content.capitulo3.forEach((hallazgo, idx) => {
        children.push(createParagraph(`3.${idx + 1}. Condición: ${hallazgo.condicion}`));
        children.push(createParagraph(`Criterio: ${hallazgo.criterio}`));
        children.push(createParagraph(`Causa: ${hallazgo.causa}`));
        children.push(createParagraph(`Efecto: ${hallazgo.efecto}`));
        children.push(createParagraph(' '));
      });
    }

    // Capítulo IV (Definitivo)
    if (type === 'definitivo') {
      children.push(createHeading('Capítulo IV: Conclusión y Recomendaciones', HeadingLevel.HEADING_2));
      children.push(createParagraph('Conclusión: ' + content.capitulo4.conclusion));
      children.push(createParagraph('Recomendaciones:', { bold: true }));
      content.capitulo4.recomendaciones.forEach(rec => {
        children.push(new Paragraph({
          children: [new TextRun({ text: rec, font: "Arial" })],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 120 }
        }));
      });
    }
  }

  // 3. Firma
  children.push(createParagraph(' '));
  children.push(createParagraph(' '));
  children.push(createParagraph(' '));

  if (type === 'definitivo') {
    const name = report.definitive?.signedBy || content.pieFirma.firmanteNombre;
    const cargo = content.pieFirma.firmanteCargo;
    const acta = content.pieFirma.acta || 'Acta de Sesión Extraordinaria Nro. 003-2019 de fecha 15-05-2019';
    const pub = content.pieFirma.publicacion || 'Gaceta Municipal Nro 1025 de fecha 15-05-2019';

    children.push(createParagraph('_________________________________', { alignment: AlignmentType.CENTER }));
    children.push(createParagraph(name, { bold: true, alignment: AlignmentType.CENTER }));
    children.push(createParagraph('Cargo: ' + cargo, { bold: true, alignment: AlignmentType.CENTER }));
    if (acta) children.push(createParagraph(acta, { alignment: AlignmentType.CENTER, size: 20 }));
    if (pub) children.push(createParagraph(pub, { alignment: AlignmentType.CENTER, size: 20 }));
  }

  // --- CONSTRUIR CABECERA REPETITIVA ---
  const headerElements = [];
  if (logoLeftBytes && logoRightBytes) {
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.NONE },
        left: { style: BorderStyle.NONE },
        right: { style: BorderStyle.NONE },
        bottom: { style: BorderStyle.SINGLE, size: 24, color: "0F2D59" }, // Línea azul de 3pt
        insideHorizontal: { style: BorderStyle.NONE },
        insideVertical: { style: BorderStyle.NONE }
      },
      rows: [
        new TableRow({
          children: [
            // Logo izquierdo + RIF
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: logoLeftBytes,
                      transformation: { width: 50, height: 50 }
                    }),
                    new TextRun({
                      text: 'G-20002278-7',
                      bold: true,
                      size: 14, // 7pt
                      font: "Arial",
                      break: 1
                    })
                  ]
                })
              ]
            }),
            // Texto central institucional
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { line: 240 },
                  children: [
                    new TextRun({ text: 'REPÚBLICA BOLIVARIANA DE VENEZUELA', bold: true, size: 18, font: "Arial" }),
                    new TextRun({ text: 'MUNICIPIO PEDRAZA - ESTADO BARINAS', bold: true, size: 18, font: "Arial", break: 1 }),
                    new TextRun({ text: 'CONTRALORÍA DEL MUNICIPIO', bold: true, size: 18, font: "Arial", break: 1 }),
                    new TextRun({ text: '¡CONTRALORES SOMO TODOS!', bold: true, size: 18, color: "CC0000", font: "Arial", break: 1 }),
                    new TextRun({ text: 'DESPACHO DEL CONTRALOR', bold: true, size: 18, font: "Arial", break: 1 })
                  ]
                })
              ]
            }),
            // Logo derecho
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              verticalAlign: VerticalAlign.CENTER,
              borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new ImageRun({
                      data: logoRightBytes,
                      transformation: { width: 50, height: 50 }
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    headerElements.push(headerTable);
  } else {
    // Fallback de texto si las imágenes fallan
    headerElements.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: 'REPÚBLICA BOLIVARIANA DE VENEZUELA', bold: true, size: 18, font: "Arial" }),
          new TextRun({ text: 'MUNICIPIO PEDRAZA - ESTADO BARINAS', bold: true, size: 18, font: "Arial", break: 1 }),
          new TextRun({ text: 'CONTRALORÍA DEL MUNICIPIO', bold: true, size: 18, font: "Arial", break: 1 }),
          new TextRun({ text: '¡CONTRALORES SOMO TODOS!', bold: true, size: 18, color: "CC0000", font: "Arial", break: 1 }),
          new TextRun({ text: 'DESPACHO DEL CONTRALOR', bold: true, size: 18, font: "Arial", break: 1 })
        ]
      })
    );
  }

  // --- CONSTRUIR PIE DE PÁGINA REPETITIVO ---
  const footerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 24, color: "0F2D59" }, // Línea azul de 3pt
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, line: 200 },
                children: [
                  new TextRun({
                    text: 'Contraloría del Municipio Pedraza - Estado Barinas Av. 7, entre calles 13 y 14, Edif. Sede de la Biblioteca Pública, Oficina Principal Sector Cultura I, Parroquia Ciudad Bolivia.',
                    size: 14, // 7pt
                    font: "Arial"
                  }),
                  new TextRun({
                    text: 'Email: contraloria_pedraza@hotmail.com | Telefax: +58 273-9210251',
                    size: 14, // 7pt
                    font: "Arial",
                    break: 1
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });

  // Generar el documento con formato Carta y márgenes de 3cm (1701 twips)
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            size: 24, // 12pt (24 half-points)
            font: "Arial"
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
        },
        headers: {
          default: new Header({
            children: headerElements
          })
        },
        footers: {
          default: new Footer({
            children: [footerTable]
          })
        }
      },
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Informe_${type.charAt(0).toUpperCase() + type.slice(1)}_${report.auditId}.docx`);
};
