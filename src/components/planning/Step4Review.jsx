import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileText, Activity, Download } from 'lucide-react';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';
import { Step3DocumentPreview } from './Step3DocumentPreview';

export const Step4Review = ({ generalData, teamData, riesgos, updateGeneralData, onSignAndGenerate }) => {
  const [activeTab, setActiveTab] = useState('oficio');
  const [observaciones, setObservaciones] = useState('');
  const oficioRef = useRef(null);
  const matrizRef = useRef(null);

  // Estado para usuarios firmantes
  const [coordinadorNombre, setCoordinadorNombre] = useState('[Cargando...]');
  const [directorNombre, setDirectorNombre] = useState('[Cargando...]');

  useEffect(() => {
    import('../../services/userService').then(({ userService }) => {
      userService.getAll().then(users => {
        const activeUsers = users.filter(u => u.status === 'Activo');
        
        const coord = activeUsers.find(u => u.role === 'Coordinador' || u.role?.includes('Coordinador'));
        const dir = activeUsers.find(u => u.role === 'Director de Control');
        
        setCoordinadorNombre(coord ? coord.name : '[No asignado]');
        setDirectorNombre(dir ? dir.name : '[No asignado]');
      });
    });
  }, []);

  // Cálculos por categoría
  const calcularPorCategoria = (categoria) => {
    return riesgos
      .filter(r => r.categoria === categoria)
      .reduce((acc, r) => acc + (r.prob * r.impacto), 0);
  };

  const totalInherente = calcularPorCategoria('Riesgo Inherente');
  const totalControl = calcularPorCategoria('Riesgo de Control');
  const totalDeteccion = calcularPorCategoria('Riesgo de Detección');
  const totalGeneral = totalInherente + totalControl + totalDeteccion;

  let nivelRiesgo = '';
  if (totalGeneral <= 42) nivelRiesgo = 'Aceptable';
  else if (totalGeneral <= 84) nivelRiesgo = 'Tolerable';
  else nivelRiesgo = 'Inaceptable';

  // Función para generar PDF usando html2pdf.js en 1 sola página
  const handleGenerarPDF = (ref, tituloDocumento) => {
    const elemento = ref.current;
    if (!elemento) return;

    // Calcular dimensiones exactas para que quede en 1 sola página
    const clientWidth = elemento.scrollWidth;
    const clientHeight = elemento.scrollHeight;
    
    // Convertir pixeles a milímetros (aproximadamente 25.4 mm por pulgada / 96 dpi)
    const pxToMm = 25.4 / 96;
    const widthMm = clientWidth * pxToMm;
    const heightMm = clientHeight * pxToMm;

    // Agregar un pequeño margen adicional
    const format = [widthMm + 20, heightMm + 20];

    const opt = {
      margin:       10,
      filename:     `${tituloDocumento}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: format, orientation: widthMm > heightMm ? 'landscape' : 'portrait' }
    };

    html2pdf().set(opt).from(elemento).save();
  };

  const handleGenerarDOCX = (ref, tituloDocumento) => {
    const contenido = ref.current;
    if (!contenido) return;

    // Clonar el nodo para poder manipularlo sin afectar la interfaz visual
    const clone = contenido.cloneNode(true);
    
    // Eliminar todas las imágenes para que no salgan rotas en el archivo de Word
    const images = clone.querySelectorAll('img');
    images.forEach(img => img.remove());

    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${tituloDocumento}</title>
        <style>
          body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          .bordered-table th, .bordered-table td { border: 1px solid #000; padding: 5px; text-align: left; }
          .signature-table td { border: none !important; text-align: center; }
          .doc-header { text-align: center; margin-bottom: 20px; }
          .doc-header__logo--left-wrapper { display: none; }
          .doc-header__logo { display: none; }
          .doc-header__center { font-weight: bold; font-size: 11pt; text-align: center; }
          .doc-footer { margin-top: 40px; border-top: 1px solid #000; padding-top: 10px; font-size: 9pt; text-align: center; }
        </style>
      </head>
      <body>
        ${clone.innerHTML}
      </body>
      </html>
    `;

    const blob = new Blob(['\\ufeff', htmlString], {
      type: 'application/msword'
    });
    saveAs(blob, `${tituloDocumento}.doc`);
  };

  const tabStyle = (tabName) => ({
    padding: '1rem 2rem',
    background: 'none',
    border: 'none',
    borderBottom: activeTab === tabName ? '3px solid var(--brand-accent)' : '3px solid transparent',
    color: activeTab === tabName ? 'var(--brand-primary)' : 'var(--text-secondary)',
    fontWeight: activeTab === tabName ? 'bold' : 'normal',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1rem'
  });

  const cellStyle = { border: '1px solid #000', padding: '0.5rem' };
  const cellCenterStyle = { ...cellStyle, textAlign: 'center' };
  const totalRowStyle = { backgroundColor: '#e8e8e8', fontWeight: 'bold' };

  const renderRiesgosPorCategoria = (categoria) => {
    const items = riesgos.filter(r => r.categoria === categoria);
    const subtotal = items.reduce((acc, r) => acc + (r.prob * r.impacto), 0);

    return (
      <>
        {items.map((r, idx) => (
          <tr key={r.id || idx}>
            <td style={cellStyle}>{r.factor}</td>
            <td style={cellCenterStyle}>{r.prob}</td>
            <td style={cellCenterStyle}>{r.impacto}</td>
            <td style={cellCenterStyle}>{r.prob * r.impacto}</td>
          </tr>
        ))}
        <tr style={totalRowStyle}>
          <td style={{ ...cellStyle, fontWeight: 'bold' }} colSpan="3">
            Total {categoria}
          </td>
          <td style={{ ...cellCenterStyle, fontWeight: 'bold' }}>{subtotal}</td>
        </tr>
      </>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      <h2 style={{ margin: '0 0 0.5rem 0' }}>Revisión y Emisión de Documentos</h2>

      {/* Pestañas */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-light)' }}>
        <button onClick={() => setActiveTab('oficio')} style={tabStyle('oficio')}>
          <FileText size={18} />
          Oficio de Presentación
        </button>
        <button onClick={() => setActiveTab('matriz')} style={tabStyle('matriz')}>
          <Activity size={18} />
          Matriz de Evaluación de Riesgos
        </button>
      </div>

      {/* Contenido */}
      <div style={{ backgroundColor: '#eef2f6', padding: '2rem', borderRadius: 'var(--radius-card)' }}>
        
        {activeTab === 'oficio' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '1rem' }}>
              <Button 
                variant="outline" 
                onClick={() => handleGenerarDOCX(oficioRef, 'Oficio_de_Presentacion')}
                style={{ gap: '0.5rem' }}
              >
                <FileText size={18} />
                Descargar en Word
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleGenerarPDF(oficioRef, 'Oficio de Presentación')}
                style={{ gap: '0.5rem' }}
              >
                <Download size={18} />
                Descargar en PDF
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }} ref={oficioRef}>
              <Step3DocumentPreview 
                generalData={generalData}
                teamData={teamData}
                updateGeneralData={updateGeneralData}
                isPreviewOnly={true}
              />
            </div>
          </div>
        )}

        {activeTab === 'matriz' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '1rem' }}>
              <Button 
                variant="outline" 
                onClick={() => handleGenerarDOCX(matrizRef, 'Matriz_de_Riesgos')}
                style={{ gap: '0.5rem' }}
              >
                <FileText size={18} />
                Descargar en Word
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleGenerarPDF(matrizRef, 'Matriz de Evaluación de Riesgos')}
                style={{ gap: '0.5rem' }}
              >
                <Download size={18} />
                Descargar en PDF
              </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }} ref={matrizRef}>
              <div style={{
                width: '100%',
                maxWidth: '850px',
                backgroundColor: 'white',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '4rem',
                color: '#000',
                fontFamily: '"Times New Roman", Times, serif',
                lineHeight: '1.6',
                fontSize: '11pt'
              }}>
                {/* Encabezado */}
                <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '2rem' }}>
                  REPÚBLICA BOLIVARIANA DE VENEZUELA<br />
                  CONTRALORÍA DEL MUNICIPIO PEDRAZA DEL ESTADO BARINAS<br />
                  DIRECCIÓN DE CONTROL DE LA ADMINISTRACIÓN CENTRAL Y DESCENTRALIZADA<br /><br />
                  MATRIZ DE EVALUACIÓN DE RIESGOS DE AUDITORÍA
                </div>
                
                {/* Datos de la Auditoría */}
                <div style={{ marginBottom: '2rem' }}>
                  <strong>Institución Auditada:</strong> {generalData.institucion || '[No especificada]'}<br />
                  <strong>Tipo de Auditoría:</strong> {generalData.tipo || 'Seguridad de la Información'}<br />
                  <strong>Alcance:</strong> {generalData.alcanceDesde || '[No definido]'} al {generalData.alcanceHasta || '[No definido]'}<br />
                  <strong>Objetivo:</strong> {generalData.objetivo || '[No definido]'}
                </div>

                {/* Tabla de Riesgos con subtotales */}
                <table className="bordered-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                      <th style={{ ...cellStyle, textAlign: 'left' }}>Factor de Riesgo</th>
                      <th style={cellCenterStyle}>Probabilidad</th>
                      <th style={cellCenterStyle}>Impacto</th>
                      <th style={cellCenterStyle}>Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Riesgos Inherentes + Subtotal */}
                    <tr>
                      <td colSpan="4" style={{ ...cellStyle, backgroundColor: '#d0e0f0', fontWeight: 'bold', textAlign: 'center' }}>
                        Riesgos Inherentes
                      </td>
                    </tr>
                    {renderRiesgosPorCategoria('Riesgo Inherente')}

                    {/* Riesgos de Control + Subtotal */}
                    <tr>
                      <td colSpan="4" style={{ ...cellStyle, backgroundColor: '#d0e0f0', fontWeight: 'bold', textAlign: 'center' }}>
                        Riesgos de Control
                      </td>
                    </tr>
                    {renderRiesgosPorCategoria('Riesgo de Control')}

                    {/* Riesgos de Detección + Subtotal */}
                    <tr>
                      <td colSpan="4" style={{ ...cellStyle, backgroundColor: '#d0e0f0', fontWeight: 'bold', textAlign: 'center' }}>
                        Riesgos de Detección
                      </td>
                    </tr>
                    {renderRiesgosPorCategoria('Riesgo de Detección')}

                    {/* Total General */}
                    <tr style={{ backgroundColor: '#c0c0c0' }}>
                      <td style={{ ...cellStyle, fontWeight: 'bold' }} colSpan="3">
                        Total General (Resultado de Matriz de Evaluación de Riesgo de Auditoría)
                      </td>
                      <td style={{ ...cellCenterStyle, fontWeight: 'bold', fontSize: '1.1em' }}>
                        {totalGeneral}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...cellStyle, fontWeight: 'bold' }} colSpan="3">
                        Calificación de Riesgo
                      </td>
                      <td style={{ ...cellCenterStyle, fontWeight: 'bold' }}>
                        {nivelRiesgo}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Observaciones */}
                <div style={{ marginBottom: '3rem' }}>
                  <strong>Observaciones:</strong>
                  <div style={{ 
                    border: '1px solid #000', 
                    minHeight: '80px', 
                    padding: '0.75rem', 
                    marginTop: '0.5rem' 
                  }}>
                    <textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      placeholder="Señale cualquier información adicional que considere relevante sobre los riesgos de auditoría..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        border: 'none',
                        outline: 'none',
                        fontFamily: '"Times New Roman", Times, serif',
                        fontSize: '11pt',
                        resize: 'vertical',
                        lineHeight: '1.6'
                      }}
                    />
                  </div>
                </div>

                {/* Firmas */}
                <table className="signature-table" style={{ width: '100%', marginTop: '4rem', marginBottom: '2rem', border: 'none' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '50%', border: 'none', textAlign: 'center', verticalAlign: 'top' }}>
                        ________________________________<br />
                        <strong>Elaborado por:</strong><br />
                        {coordinadorNombre}<br />
                        Coordinador de Auditoría
                      </td>
                      <td style={{ width: '50%', border: 'none', textAlign: 'center', verticalAlign: 'top' }}>
                        ________________________________<br />
                        <strong>Aprobado por:</strong><br />
                        {directorNombre}<br />
                        Director de Control
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Footer Institucional para Matriz */}
                <div className="doc-footer" style={{ marginTop: '40px', borderTop: '1px solid #000', paddingTop: '10px', fontSize: '9pt', textAlign: 'center' }}>
                  Contraloría del Municipio Pedraza - Estado Barinas Av. 7, entre calles 13 y 14, Edif. Sede de la Biblioteca Pública, Oficina Principal Sector Cultura I, Parroquia Ciudad Bolivia.<br />
                  Email: contraloria_pedraza@hotmail.com | Telefax: +58 273-9210251
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
