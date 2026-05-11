import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CheckCircle, AlertCircle, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';

export const PACStep3Signatures = ({ pac, isFormComplete, onSign, onPreview }) => {
  const { currentUser } = useAuth();
  
  // Estados para simular carga de firma física por el auditor (datos del ente)
  const [elaboratorName, setElaboratorName] = useState('');
  const [elaboratorRole, setElaboratorRole] = useState('');
  
  const [approverName, setApproverName] = useState('');
  const [approverRole, setApproverRole] = useState('');

  const renderSignatureBlock = (title, data, roleType, isEntity) => {
    const isSigned = data?.status === 'firmado';

    return (
      <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--brand-primary)' }}>{title}</h4>
          <Badge status={isSigned ? 'closed' : 'in-progress'}>
            {isSigned ? 'Firmado' : 'Pendiente'}
          </Badge>
        </div>

        {isSigned ? (
          <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '1rem', borderRadius: '4px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--status-success)' }}>
              <CheckCircle size={16} /> <span style={{ fontWeight: 'bold' }}>Validado</span>
            </div>
            <div style={{ fontWeight: 'bold' }}>{data.name}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{data.role}</div>
          </div>
        ) : (
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {isEntity ? (
              // Para el ente, el auditor registra los datos manualmente de quien elaboró el plan físico
              <>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Indique apellidos, nombres del funcionario del Órgano o Ente auditado que elaboró el plan:
                </div>
                <Input 
                  placeholder="Nombre y Apellido" 
                  value={roleType === 'elaborated' ? elaboratorName : approverName}
                  onChange={(e) => roleType === 'elaborated' ? setElaboratorName(e.target.value) : setApproverName(e.target.value)}
                />
                <Input 
                  placeholder="Cargo en el Ente" 
                  value={roleType === 'elaborated' ? elaboratorRole : approverRole}
                  onChange={(e) => roleType === 'elaborated' ? setElaboratorRole(e.target.value) : setApproverRole(e.target.value)}
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => onSign(roleType, { name: roleType === 'elaborated' ? elaboratorName : approverName, role: roleType === 'elaborated' ? elaboratorRole : approverRole })}
                  disabled={roleType === 'elaborated' ? (!elaboratorName || !elaboratorRole) : (!approverName || !approverRole)}
                >
                  Registrar Firma del Ente
                </Button>
              </>
            ) : (
              // Para la Contraloría (Aprobado por Coordinador / Conformado por Director General)
              <>
                {!isFormComplete && (
                  <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--status-critical)', fontSize: '0.85rem', backgroundColor: '#FEF2F2', padding: '0.5rem', borderRadius: '4px' }}>
                    <AlertCircle size={16} /> Debe completar todas las acciones correctivas.
                  </div>
                )}
                {roleType === 'approved' && pac.signatures.elaborated.status !== 'firmado' && (
                  <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--status-warning)', fontSize: '0.85rem', backgroundColor: '#FFFBEB', padding: '0.5rem', borderRadius: '4px' }}>
                    <AlertCircle size={16} /> Falta la firma de elaboración.
                  </div>
                )}
                {roleType === 'conformed' && (pac.signatures.elaborated.status !== 'firmado' || pac.signatures.approved.status !== 'firmado') && (
                  <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--status-warning)', fontSize: '0.85rem', backgroundColor: '#FFFBEB', padding: '0.5rem', borderRadius: '4px' }}>
                    <AlertCircle size={16} /> Faltan firmas previas.
                  </div>
                )}
                
                <Button 
                  variant="primary" 
                  onClick={() => onSign(roleType, { name: currentUser?.name || 'Firmante Auto', role: roleType === 'approved' ? 'Coordinador de Auditoría' : 'Contralor Municipal' })}
                  disabled={!isFormComplete || 
                            (roleType === 'approved' && pac.signatures.elaborated.status !== 'firmado') || 
                            (roleType === 'conformed' && (pac.signatures.elaborated.status !== 'firmado' || pac.signatures.approved.status !== 'firmado'))}
                >
                  {roleType === 'approved' ? 'Aprobar Plan (Coordinador)' : 'Conformar Plan (Contralor Municipal)'}
                </Button>
              </>
            )}
          </div>
        )}
      </Card>
    );
  };

  return (
    <div style={{ padding: '1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Validación y Conformidad</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            Registre las firmas físicas del Ente Auditado y aplique la aprobación/conformidad de la Contraloría.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Fecha de Presentación:</label>
            <input 
              type="date" 
              value={pac.presentationDate || new Date().toISOString().split('T')[0]} 
              onChange={(e) => {
                // Se actualizará en el pac via el modal padre en una implementación real
                // Por ahora simulamos el cambio en el objeto directamente para el visor
                pac.presentationDate = e.target.value; 
              }}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-light)' }}
            />
          </div>
          <Button variant="secondary" onClick={onPreview}>
            Ver Documento Final
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {/* Ente Auditado - Elaborado Por */}
        {renderSignatureBlock('Elaborado Por (Ente)', pac.signatures.elaborated, 'elaborated', true)}
        
        {/* Contraloría - Aprobado Por */}
        {renderSignatureBlock('Aprobado Por (Coordinador)', pac.signatures.approved, 'approved', false)}
        
        {/* Contraloría - Conformado Por */}
        {renderSignatureBlock('Conformado Por (Contralor)', pac.signatures.conformed, 'conformed', false)}
      </div>

    </div>
  );
};
