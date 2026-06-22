import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2, Edit2, Save, ArrowUp, ArrowDown } from 'lucide-react';

export const Step2AuditTeam = ({ teamData, generalData, cronograma, updateTeam, updateGeneral, updateCronograma, errors = [] }) => {
  const [newMember, setNewMember] = useState({ cedula: '', nombre: '', cargo: 'Auditor Fiscal' });
  const [editingId, setEditingId] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    userService.getAll().then(setAvailableUsers).catch(console.error);
  }, []);

  const handleCronogramaDateChange = (field, value) => {
    if (!value) {
      updateCronograma({ ...cronograma, [field]: value });
      return;
    }

    if (field === 'inicio' && cronograma.fin) {
      if (value === cronograma.fin) {
        alert('Las fechas de inicio y fin no pueden ser iguales.');
        return;
      }
      if (value > cronograma.fin) {
        alert('La fecha de inicio no puede ser posterior a la fecha de terminación.');
        return;
      }
    }

    if (field === 'fin' && cronograma.inicio) {
      if (value === cronograma.inicio) {
        alert('Las fechas de inicio y fin no pueden ser iguales.');
        return;
      }
      if (value < cronograma.inicio) {
        alert('La fecha de terminación no puede ser anterior a la fecha de inicio.');
        return;
      }
    }

    updateCronograma({ ...cronograma, [field]: value });
  };

  const handleAddOrUpdate = () => {
    if (!newMember.cedula || !newMember.nombre) return;

    const isDuplicate = teamData.some(m => m.cedula === newMember.cedula && m.id !== editingId);
    if (isDuplicate) {
      alert('Esta cédula ya está asignada a otro miembro del equipo auditor.');
      return;
    }

    if (editingId) {
      updateTeam(teamData.map(m => m.id === editingId ? { ...newMember, id: editingId } : m));
      setEditingId(null);
    } else {
      const newId = teamData.length > 0 ? Math.max(...teamData.map(m => m.id)) + 1 : 1;
      updateTeam([...teamData, { ...newMember, id: newId }]);
    }
    setNewMember({ cedula: '', nombre: '', cargo: 'Auditor Fiscal' });
  };

  const handleEditMember = (member) => {
    setNewMember({ cedula: member.cedula, nombre: member.nombre, cargo: member.cargo });
    setEditingId(member.id);
  };

  const handleRemoveMember = (id) => {
    updateTeam(teamData.filter(m => m.id !== id));
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newData = [...teamData];
    const temp = newData[index - 1];
    newData[index - 1] = newData[index];
    newData[index] = temp;
    updateTeam(newData);
  };

  const handleMoveDown = (index) => {
    if (index === teamData.length - 1) return;
    const newData = [...teamData];
    const temp = newData[index + 1];
    newData[index + 1] = newData[index];
    newData[index] = temp;
    updateTeam(newData);
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: 'var(--radius-button)',
    border: '1px solid var(--border-light)',
    backgroundColor: 'var(--surface-light)',
    color: 'var(--text-primary)',
    fontFamily: 'inherit'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* CRONOGRAMA */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Cronograma de Ejecución</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: errors.includes('cronogramaInicio') ? 'red' : 'inherit', transition: 'color 0.3s' }}>Fecha de Inicio</label>
            <input
              type="date"
              value={cronograma.inicio}
              onChange={(e) => handleCronogramaDateChange('inicio', e.target.value)}
              max={cronograma.fin}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: errors.includes('cronogramaFin') ? 'red' : 'inherit', transition: 'color 0.3s' }}>Fecha de Terminación</label>
            <input
              type="date"
              value={cronograma.fin}
              onChange={(e) => handleCronogramaDateChange('fin', e.target.value)}
              min={cronograma.inicio}
              required
              style={inputStyle}
            />
          </div>
        </div>
      </Card>

      {/* EQUIPO AUDITOR */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0', color: errors.includes('team') ? 'red' : 'inherit', transition: 'color 0.3s' }}>Asignación de Comisión Auditora</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '1rem', alignItems: 'end', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Cédula</label>
            <input
              type="text"
              value={newMember.cedula}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                let nombre = newMember.nombre;
                let cargo = newMember.cargo;

                if (val.length >= 6) {
                  const matchedUser = availableUsers.find(u => u.cedula === val);
                  if (matchedUser) {
                    nombre = matchedUser.name;
                    cargo = matchedUser.role;
                  }
                }

                setNewMember({ ...newMember, cedula: val, nombre, cargo });
              }}
              style={inputStyle}
              placeholder="12345678"
              maxLength={10}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Nombre Completo</label>
            <input
              type="text"
              value={newMember.nombre}
              onChange={(e) => setNewMember({ ...newMember, nombre: e.target.value })}
              style={inputStyle}
              placeholder="Ej. José Pérez"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Cargo</label>
            <select
              value={newMember.cargo}
              onChange={(e) => setNewMember({ ...newMember, cargo: e.target.value })}
              style={inputStyle}
            >
              <option value="Contralor Municipal">Contralor Municipal</option>
              <option value="Director General">Director General</option>
              <option value="Director de Control">Director de Control</option>
              <option value="Coordinador de Auditoría">Coordinador de Auditoría</option>
              <option value="Auditor Fiscal">Auditor Fiscal</option>
              <option value="Abogado Fiscal">Abogado Fiscal</option>
              <option value="Director de Determinación de Responsabilidades">Director de Determinación de Responsabilidades</option>
              {/* Fallback en caso de que el rol del usuario no esté en la lista */}
              {![
                'Contralor Municipal', 'Director General', 'Director de Control',
                'Coordinador de Auditoría', 'Auditor Fiscal', 'Abogado Fiscal',
                'Director de Determinación de Responsabilidades'
              ].includes(newMember.cargo) && (
                <option value={newMember.cargo}>{newMember.cargo}</option>
              )}
            </select>
          </div>
          <Button
            variant="primary"
            onClick={handleAddOrUpdate}
            style={{ padding: '0.75rem', backgroundColor: editingId ? 'var(--status-progress)' : 'var(--brand-accent)' }}
            title={editingId ? "Guardar Cambios" : "Agregar"}
          >
            {editingId ? <Save size={20} /> : <Plus size={20} />}
          </Button>
        </div>

        {teamData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', backgroundColor: 'var(--surface-light)', borderRadius: 'var(--radius-card)' }}>
            Aún no hay funcionarios asignados.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-light)', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Cédula</th>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Nombre</th>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)' }}>Cargo</th>
                <th style={{ padding: '0.5rem', color: 'var(--text-secondary)', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {teamData.map((member, index) => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.5rem' }}>{member.cedula}</td>
                  <td style={{ padding: '0.5rem', fontWeight: '500' }}>{member.nombre}</td>
                  <td style={{ padding: '0.5rem' }}>{member.cargo}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                      <button onClick={() => handleMoveUp(index)} disabled={index === 0} style={{ background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}>
                        <ArrowUp size={16} />
                      </button>
                      <button onClick={() => handleMoveDown(index)} disabled={index === teamData.length - 1} style={{ background: 'none', border: 'none', cursor: index === teamData.length - 1 ? 'default' : 'pointer', opacity: index === teamData.length - 1 ? 0.3 : 1 }}>
                        <ArrowDown size={16} />
                      </button>
                      <button onClick={() => handleEditMember(member)} style={{ background: 'none', border: 'none', color: 'var(--brand-accent)', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleRemoveMember(member.id)} style={{ background: 'none', border: 'none', color: 'var(--status-critical)', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};
