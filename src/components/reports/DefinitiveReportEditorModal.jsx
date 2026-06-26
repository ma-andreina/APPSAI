import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ChevronDown, ChevronUp, Bold, Italic, Underline, List, ListOrdered, Plus, Trash2, FileText, AlertCircle } from 'lucide-react';
import { findingService } from '../../services/findingService';

export const DefinitiveReportEditorModal = ({ isOpen, onClose, report, onSaveAndPreview }) => {
  const [findings, setFindings] = useState([]);
  const [loadingFindings, setLoadingFindings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Panel colapsable dentro de recomendaciones
  const [isFindingsCardOpen, setIsFindingsCardOpen] = useState(false);

  // Formulario Inteligente (Capítulo IV)
  const [conclusions, setConclusions] = useState('');
  const [recommendations, setRecommendations] = useState([]); // Array de strings

  useEffect(() => {
    if (isOpen && report) {
      setLoadingFindings(true);
      findingService.getAll().then(all => {
        let f = all.filter(item => item.auditId === report.auditId);
        if (f.length === 0 && all.length > 0) {
          f = all; // Fallback demostrativo
        }
        setFindings(f);
        setLoadingFindings(false);

        // Precargar redactado existente o generar estructura sugerida
        const existingChapter4 = report.definitive?.chapter4;
        if (existingChapter4?.conclusion) {
          setConclusions(existingChapter4.conclusion);
        } else {
          setConclusions(f.length > 0
            ? 'Como resultado de la auditoría practicada, se determinaron debilidades de control interno y oportunidades de mejora significativas en los procesos tecnológicos de la institución, las cuales inciden en la seguridad e integridad de los activos de información evaluados.'
            : 'Se concluye que el objeto evaluado mantiene un nivel razonable de cumplimiento respecto a las normas técnicas y legales aplicables.');
        }

        if (existingChapter4?.recomendaciones && existingChapter4.recomendaciones.length > 0) {
          setRecommendations(existingChapter4.recomendaciones);
        } else {
          setRecommendations(f.map((item, idx) => {
            const cond = item.condition || item.ccce?.condition || 'Desviación identificada';
            return `${idx + 1}. Girar instrucciones formales a las direcciones competentes para aplicar los correctivos necesarios que solventen la observación referida a: ${cond}`;
          }));
        }
      }).catch(() => {
        setLoadingFindings(false);
      });
    }
  }, [isOpen, report]);

  if (!isOpen || !report) return null;

  const handleRecommendationChange = (index, value) => {
    const updated = [...recommendations];
    updated[index] = value;
    setRecommendations(updated);
  };

  const handleAddGeneralRecommendation = () => {
    setRecommendations([...recommendations, `${recommendations.length + 1}. `]);
  };

  const handleRemoveRecommendation = (index) => {
    const updated = recommendations.filter((_, i) => i !== index);
    setRecommendations(updated);
  };

  const handleInsertFormat = (fieldOrIndex, tag) => {
    if (fieldOrIndex === 'conclusions') {
      setConclusions(prev => prev + tag);
    } else {
      const updated = [...recommendations];
      updated[fieldOrIndex] = (updated[fieldOrIndex] || '') + tag;
      setRecommendations(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const chapter4Data = {
      conclusion: conclusions,
      recomendaciones: recommendations.filter(r => r.trim() !== '' && r.trim() !== `${recommendations.indexOf(r) + 1}.`)
    };
    await onSaveAndPreview(report.id, report.auditId, chapter4Data);
    setIsSaving(false);
  };

  const sectionStyle = {
    marginBottom: '2rem',
    backgroundColor: 'var(--surface-light)',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid var(--border-light)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  };

  const labelStyle = {
    display: 'block',
    fontWeight: '600',
    fontSize: '0.95rem',
    color: 'var(--brand-primary)',
    marginBottom: '0.75rem'
  };

  const toolbarButtonStyle = {
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid var(--border-light)',
    backgroundColor: 'white',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.8rem',
    transition: 'all 0.15s'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Redacción del Informe Definitivo — Capítulo IV"
      maxWidth="1000px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '80vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
        
        {/* Encabezado Contextual */}
        <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--brand-accent)', textTransform: 'uppercase' }}>{report.auditId}</span>
            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '1.25rem', color: 'var(--brand-primary)' }}>{report.auditTitle}</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ente Evaluado: {report.entity}</p>
          </div>
          <Badge status="in-progress" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Redacción Activa</Badge>
        </div>

        {/* 1. SECCIÓN CENTRAL: CAPÍTULO IV (Formulario Inteligente) */}
        
        {/* Campo Conclusiones (Rich Text Editor Visual) */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Capítulo IV — 4.1. Conclusiones Generales</label>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Redacte el dictamen general sobre la integridad estructural y la efectividad de los controles institucionales evaluados.
          </p>
          
          {/* Rich Text Toolbar */}
          <div style={{ display: 'flex', gap: '6px', padding: '8px', backgroundColor: '#EBF3FB', borderRadius: '8px 8px 0 0', border: '1px solid var(--border-light)', borderBottom: 'none' }}>
            <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat('conclusions', '**Texto en Negrita**')} title="Negrita"><Bold size={14} /> Negrita</button>
            <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat('conclusions', '*Texto en Cursiva*')} title="Cursiva"><Italic size={14} /> Cursiva</button>
            <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat('conclusions', '__Texto Subrayado__')} title="Subrayado"><Underline size={14} /> Subrayado</button>
            <div style={{ width: '1px', backgroundColor: '#CBD5E1', margin: '0 4px' }} />
            <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat('conclusions', '\n- Punto de viñeta')} title="Lista con viñetas"><List size={14} /> Viñetas</button>
            <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat('conclusions', '\n1. Ítem numerado')} title="Lista numerada"><ListOrdered size={14} /> Numeración</button>
          </div>

          <textarea
            value={conclusions}
            onChange={(e) => setConclusions(e.target.value)}
            required
            rows={6}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0 0 8px 8px',
              border: '1px solid var(--border-light)',
              backgroundColor: 'white',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
            placeholder="Redacte las conclusiones generales de la auditoría..."
          />
        </div>

        {/* Campo Recomendaciones (Generador Dinámico amarrado a cada hallazgo) */}
        <div style={sectionStyle}>
          
          {/* Cabecera */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <label style={{ ...labelStyle, marginBottom: '0.25rem' }}>4.2. Recomendaciones Específicas amarradas a Hallazgos</label>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Lista cada hallazgo detectado e incluye un input de recomendación amarrado específicamente a dicho hallazgo.
              </p>
            </div>

            <div>
              <Button variant="outline" size="sm" type="button" onClick={handleAddGeneralRecommendation} style={{ gap: '6px' }}>
                <Plus size={16} /> Agregar Recomendación General
              </Button>
            </div>
          </div>

          {/* PANEL CARD COLAPSABLE DE HALLAZGOS ACTIVOS DEL CICLO */}
          <Card style={{ borderRadius: '10px', border: '1px solid #BAE6FD', marginBottom: '1.75rem', backgroundColor: '#F0F9FF', padding: 0, overflow: 'hidden', boxShadow: 'none' }}>
            <div 
              onClick={() => setIsFindingsCardOpen(!isFindingsCardOpen)}
              style={{ padding: '0.9rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', backgroundColor: '#E0F2FE' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} color="#0369A1" />
                <strong style={{ fontSize: '0.9rem', color: '#0369A1' }}>Consulta Rápida: Hallazgos Activos del Ciclo ({findings.length})</strong>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#0284C7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isFindingsCardOpen ? 'Ocultar Condiciones' : 'Ver Condiciones'}
                {isFindingsCardOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </div>

            {isFindingsCardOpen && (
              <div style={{ padding: '1rem 1.25rem', maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'white', borderTop: '1px solid #BAE6FD' }}>
                {loadingFindings ? (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cargando hallazgos activos del ciclo...</span>
                ) : findings.length === 0 ? (
                  <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>No hay hallazgos registrados para consultar.</span>
                ) : (
                  findings.map((f, i) => (
                    <div key={i} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#FAFCFF' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.84rem', color: 'var(--brand-primary)' }}>Observación 3.{i+1}: ({f.id || 'HALL'})</strong>
                        <Badge status={f.severity === 'Crítico' ? 'critical' : 'review'}>{f.severity || 'Medio'}</Badge>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: '1.4' }}><strong>Condición vulnerada:</strong> {f.condition || f.ccce?.condition}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>

          {/* LISTA DE RECOMENDACIONES CON EDITOR ENRIQUECIDO 1 A 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {recommendations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border-light)', borderRadius: '8px', color: 'var(--text-secondary)' }}>
                No hay recomendaciones redactadas. Haga clic en "Agregar Recomendación General" o cargue hallazgos.
              </div>
            ) : (
              recommendations.map((rec, idx) => {
                const linkedFinding = findings[idx];
                return (
                  <div key={idx} style={{ padding: '1.25rem', borderRadius: '10px', backgroundColor: 'white', border: '1px solid #CBD5E1', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    
                    {/* Rich Text Toolbar específico */}
                    <div style={{ display: 'flex', gap: '6px', padding: '8px', backgroundColor: '#EBF3FB', borderRadius: '8px 8px 0 0', border: '1px solid var(--border-light)', borderBottom: 'none', alignItems: 'center' }}>
                      <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat(idx, '**Texto en Negrita**')} title="Negrita"><Bold size={14} /> Negrita</button>
                      <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat(idx, '*Texto en Cursiva*')} title="Cursiva"><Italic size={14} /> Cursiva</button>
                      <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat(idx, '__Texto Subrayado__')} title="Subrayado"><Underline size={14} /> Subrayado</button>
                      <div style={{ width: '1px', backgroundColor: '#CBD5E1', margin: '0 4px', height: '18px' }} />
                      <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat(idx, '\n- Punto de viñeta')} title="Lista con viñetas"><List size={14} /> Viñetas</button>
                      <button type="button" style={toolbarButtonStyle} onClick={() => handleInsertFormat(idx, '\n1. Ítem numerado')} title="Lista numerada"><ListOrdered size={14} /> Numeración</button>
                      
                      {!linkedFinding && <span style={{ marginLeft: '8px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 'bold' }}>(General #{idx + 1})</span>}

                      <div style={{ flex: 1 }} />
                      
                      <Button variant="ghost" size="sm" type="button" onClick={() => handleRemoveRecommendation(idx)} style={{ color: '#EF4444', padding: '4px' }} title="Eliminar recomendación">
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <textarea
                      value={rec}
                      onChange={(e) => handleRecommendationChange(idx, e.target.value)}
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '0 0 8px 8px',
                        border: '1px solid var(--border-light)',
                        backgroundColor: 'white',
                        color: 'var(--text-primary)',
                        fontFamily: 'inherit',
                        fontSize: '0.9rem',
                        lineHeight: '1.6',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                      placeholder={`Redacte la recomendación correctiva ${linkedFinding ? `para la Observación 3.${idx + 1}` : 'general'}...`}
                    />

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer de Acciones */}
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', position: 'sticky', bottom: 0, backgroundColor: 'white', zIndex: 5 }}>
          <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" type="submit" disabled={isSaving} style={{ gap: '8px', padding: '10px 24px', fontWeight: 'bold' }}>
            <FileText size={18} />
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>

      </form>
    </Modal>
  );
};
