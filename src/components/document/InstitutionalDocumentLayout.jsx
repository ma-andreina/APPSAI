import React from 'react';
import '../../styles/documentPrint.css';

/**
 * Datos institucionales oficiales de la Contraloría del Municipio Pedraza.
 * Centralizados aquí para mantener una fuente única de verdad (SoC).
 */
const INSTITUTIONAL_DATA = {
  rif: 'G-20002278-7',
  country: 'REPÚBLICA BOLIVARIANA DE VENEZUELA',
  municipality: 'MUNICIPIO PEDRAZA - ESTADO BARINAS',
  organism: 'CONTRALORÍA DEL MUNICIPIO',
  slogan: '¡CONTRALORES SOMO TODOS!',
  office: 'DESPACHO DEL CONTRALOR',
  address:
    'Contraloría del Municipio Pedraza - Estado Barinas Av. 7, entre calles 13 y 14, Edif. Sede de la Biblioteca Pública, Oficina Principal Sector Cultura I, Parroquia Ciudad Bolivia.',
  email: 'contraloria_pedraza@hotmail.com',
  phone: '+58 273-9210251',
  logoLeft: '/logo_cmp.svg',
  logoRight: '/sncf-logo.png',
};

/**
 * Encabezado institucional reutilizable.
 * Renderiza los dos logos (CMP izquierda, SNCF derecha), el bloque central
 * con la jerarquía textual, y la línea azul marino de separación.
 */
const DocumentHeader = () => {
  // Aseguramos que las URLs de las imágenes sean absolutas para que Word pueda intentar cargarlas
  const baseUrl = window.location.origin;
  const logoLeftUrl = INSTITUTIONAL_DATA.logoLeft.startsWith('/') ? `${baseUrl}${INSTITUTIONAL_DATA.logoLeft}` : INSTITUTIONAL_DATA.logoLeft;
  const logoRightUrl = INSTITUTIONAL_DATA.logoRight.startsWith('/') ? `${baseUrl}${INSTITUTIONAL_DATA.logoRight}` : INSTITUTIONAL_DATA.logoRight;

  return (
    <table style={{ width: '100%', border: 'none', marginBottom: '20px', borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          {/* Logo izquierdo + RIF */}
          <td style={{ width: '20%', textAlign: 'center', verticalAlign: 'middle', border: 'none' }}>
            <img
              src={logoLeftUrl}
              alt="Logo CMP"
              style={{ width: '80px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
            <div style={{ fontSize: '10px', marginTop: '5px', fontWeight: 'bold' }}>{INSTITUTIONAL_DATA.rif}</div>
          </td>

          {/* Bloque central de texto institucional */}
          <td style={{ width: '60%', textAlign: 'center', verticalAlign: 'middle', border: 'none', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.2', color: '#000' }}>
            {INSTITUTIONAL_DATA.country}
            <br />
            {INSTITUTIONAL_DATA.municipality}
            <br />
            {INSTITUTIONAL_DATA.organism}
            <br />
            <span style={{ fontStyle: 'italic' }}>{INSTITUTIONAL_DATA.slogan}</span>
            <br />
            {INSTITUTIONAL_DATA.office}
          </td>

          {/* Logo derecho (SNCF) */}
          <td style={{ width: '20%', textAlign: 'center', verticalAlign: 'middle', border: 'none' }}>
            <img
              src={logoRightUrl}
              alt="Logo SNCF"
              style={{ width: '80px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

/**
 * Pie de página institucional reutilizable.
 * Renderiza la línea azul marino y los datos de contacto.
 */
const DocumentFooter = () => (
  <table style={{ width: '100%', border: 'none', borderTop: '2px solid #0F2D59', marginTop: '30px', paddingTop: '10px', fontSize: '11px', textAlign: 'center' }}>
    <tbody>
      <tr>
        <td style={{ border: 'none', color: '#000' }}>
          {INSTITUTIONAL_DATA.address}
          <br />
          Email:{' '}
          <a
            href={`mailto:${INSTITUTIONAL_DATA.email}`}
            style={{ color: '#0F2D59', textDecoration: 'underline' }}
          >
            {INSTITUTIONAL_DATA.email}
          </a>{' '}
          | Telefax: {INSTITUTIONAL_DATA.phone}
        </td>
      </tr>
    </tbody>
  </table>
);

/**
 * Layout base de documento institucional.
 *
 * Envuelve cualquier contenido de documento (Oficio, Informe Preliminar,
 * Informe Definitivo, Resumen Ejecutivo) con el encabezado y pie de página
 * oficiales de la Contraloría del Municipio Pedraza.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido del cuerpo del documento.
 * @param {React.Ref}       props.contentRef - Ref para el contenedor completo (usado por html2pdf).
 * @param {boolean}         [props.isScreen=true] - Si es true, aplica estilos de simulación de hoja.
 */
export const InstitutionalDocumentLayout = React.forwardRef(
  ({ children, isScreen = true }, ref) => {
    const containerClass = `institutional-doc${isScreen ? ' institutional-doc--screen' : ''}`;

    return (
      <div className={containerClass} ref={ref}>
        <DocumentHeader />
        <div className="doc-body">{children}</div>
        <DocumentFooter />
      </div>
    );
  }
);

InstitutionalDocumentLayout.displayName = 'InstitutionalDocumentLayout';

/**
 * Exporta los datos institucionales para uso en docxExport.js y otros servicios
 * que necesiten los mismos datos sin depender del componente React.
 */
export { INSTITUTIONAL_DATA };
