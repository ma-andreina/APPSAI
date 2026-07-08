import React, { useState, useEffect } from 'react';
import { findingService } from '../services/findingService';
import { FindingCard } from '../components/audit/FindingCard';
import { FindingForm } from '../components/audit/FindingForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Findings = () => {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const { addNotification } = useAppContext();

  useEffect(() => {
    loadFindings();
  }, []);

  const loadFindings = () => {
    findingService.getAll().then(data => {
      setFindings(data);
      setLoading(false);
    });
  };

  const handleSaveFinding = async (formData) => {
    setIsModalOpen(false);
    const criterionValue = formData.criterion?.startsWith('Control') || formData.criterion?.startsWith('control')
      ? formData.criterion 
      : `Control ISO 27001: ${formData.criterion || ''}`;

    const payload = {
      ...formData,
      criterion: criterionValue,
      auditId: formData.auditId || 'AUD-SEC-2026'
    };

    if (selectedFinding && selectedFinding.id) {
      await findingService.update(selectedFinding.id, payload);
      addNotification('Hallazgo actualizado exitosamente', 'success');
    } else {
      await findingService.create(payload);
      addNotification('Hallazgo registrado exitosamente', 'success');
    }
    loadFindings();
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando hallazgos...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0' }}>Registro de Hallazgos</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Documentación estructurada de desviaciones (CCCE) para la determinación de responsabilidades.
          </p>
        </div>
        <Button variant="primary" onClick={() => { setSelectedFinding(null); setIsModalOpen(true); }} style={{ gap: '8px' }}>
          <Plus size={18} />
          Nuevo Hallazgo
        </Button>
      </div>

      {/* Grid de Hallazgos */}
      {findings.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
          No hay hallazgos registrados aún.
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {findings.map(finding => (
            <FindingCard 
              key={finding.id} 
              finding={finding} 
              onClick={(item) => {
                setSelectedFinding(item);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal de Creación / Edición */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedFinding ? `Editar Hallazgo (${selectedFinding.id})` : "Registrar Hallazgo (Metodología CCCE)"}
      >
        <FindingForm 
          initialData={selectedFinding || {}}
          onSubmit={handleSaveFinding} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>

    </div>
  );
};
