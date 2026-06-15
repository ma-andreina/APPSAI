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
  email: 'Contraloría_Pedraza@hotmail.com',
  phone: '+58 273-9210251',
  logoLeft: '/logo_cmp.svg',
  logoRight: '/sncf-logo.png',
};

/**
 * Encabezado institucional reutilizable.
 * Renderiza los dos logos (CMP izquierda, SNCF derecha), el bloque central
 * con la jerarquía textual, y la línea azul marino de separación.
 */
const DocumentHeader = () => (
  <div className="doc-header">
    {/* Logo izquierdo + RIF */}
    <div className="doc-header__logo--left-wrapper">
      <img
        src={INSTITUTIONAL_DATA.logoLeft}
        alt="Logo CMP"
        className="doc-header__logo"
      />
      <span className="doc-header__rif">{INSTITUTIONAL_DATA.rif}</span>
    </div>

    {/* Bloque central de texto institucional */}
    <div className="doc-header__center">
      {INSTITUTIONAL_DATA.country}
      <br />
      {INSTITUTIONAL_DATA.municipality}
      <br />
      {INSTITUTIONAL_DATA.organism}
      <br />
      <span className="doc-header__slogan">{INSTITUTIONAL_DATA.slogan}</span>
      <br />
      {INSTITUTIONAL_DATA.office}
    </div>

    {/* Logo derecho (SNCF) */}
    <img
      src={INSTITUTIONAL_DATA.logoRight}
      alt="Logo SNCF"
      className="doc-header__logo"
    />
  </div>
);

/**
 * Pie de página institucional reutilizable.
 * Renderiza la línea azul marino y los datos de contacto.
 */
const DocumentFooter = () => (
  <div className="doc-footer">
    <div>{INSTITUTIONAL_DATA.address}</div>
    <div>
      Email:{' '}
      <a
        href={`mailto:${INSTITUTIONAL_DATA.email}`}
        style={{ color: '#0F2D59', textDecoration: 'underline' }}
      >
        {INSTITUTIONAL_DATA.email}
      </a>{' '}
      | Telefax: {INSTITUTIONAL_DATA.phone}
    </div>
  </div>
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
