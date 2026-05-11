import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Lock, FileSignature, QrCode } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const SignatureModal = ({ isOpen, onClose, onSign }) => {
  const [pin, setPin] = useState('');
  const [signType, setSignType] = useState('digital'); // 'digital' | 'fisica'
  const { addNotification } = useAppContext();

  const handleSign = (e) => {
    e.preventDefault();
    if (pin === '1234') { // PIN simulado
      onSign(signType);
      setPin('');
    } else {
      addNotification('PIN de firma incorrecto. Intente nuevamente.', 'error');
    }
  };

  const isDigital = signType === 'digital';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Autorización de Firma (Gatekeeper)">
      <form onSubmit={handleSign} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div style={{ backgroundColor: 'var(--surface-hover)', padding: '1rem', borderRadius: 'var(--radius-card)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'var(--brand-accent)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
            <Lock size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 0.25rem 0' }}>Seguridad Requerida</h4>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Esta acción aplicará la firma autorizada al documento definitivo. Ingrese su PIN de 4 dígitos para confirmar. (PIN Demo: 1234)
            </p>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            PIN de Firma Electrónica
          </label>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="****"
            maxLength={4}
            required
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: 'var(--radius-button)',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--surface-light)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-family)',
              fontSize: '1.5rem',
              textAlign: 'center',
              letterSpacing: '0.5rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Modalidad de Firma
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            {/* Opción Digital */}
            <div 
              onClick={() => setSignType('digital')}
              style={{
                border: isDigital ? '2px solid var(--brand-accent)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-card)',
                padding: '1rem',
                cursor: 'pointer',
                backgroundColor: isDigital ? 'var(--surface-hover)' : 'var(--surface-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <QrCode size={32} color={isDigital ? 'var(--brand-accent)' : 'var(--text-secondary)'} />
              <div style={{ fontWeight: 500, textAlign: 'center' }}>Firma Digital</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Estampa nombre y código QR de validación en el PDF.
              </div>
            </div>

            {/* Opción Física */}
            <div 
              onClick={() => setSignType('fisica')}
              style={{
                border: !isDigital ? '2px solid var(--brand-accent)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-card)',
                padding: '1rem',
                cursor: 'pointer',
                backgroundColor: !isDigital ? 'var(--surface-hover)' : 'var(--surface-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
            >
              <FileSignature size={32} color={!isDigital ? 'var(--brand-accent)' : 'var(--text-secondary)'} />
              <div style={{ fontWeight: 500, textAlign: 'center' }}>Firma Física</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Deja el espacio en blanco para firma manuscrita.
              </div>
            </div>

          </div>
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            Autorizar Firma
          </Button>
        </div>

      </form>
    </Modal>
  );
};
