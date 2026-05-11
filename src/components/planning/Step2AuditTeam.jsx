import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2, Edit2, Save, ArrowUp, ArrowDown } from 'lucide-react';

export const Step2AuditTeam = ({ teamData, generalData, cronograma, updateTeam, updateGeneral, updateCronograma }) => {
  const [newMember, setNewMember] = useState({ cedula: '', nombre: '', cargo: 'Auditor' });
  const [editingId, setEditingId] = useState(null);

  const handleAddOrUpdate = () => {
    if (!newMember.cedula || !newMember.nombre) return;
    
    if (editingId) {
      updateTeam(teamData.map(m => m.id === editingId ? { ...newMember, id: editingId } : m));
      setEditingId(null);
    } else {
      const newId = teamData.length > 0 ? Math.max(...teamData.map(m => m.id)) + 1 : 1;
      updateTeam([...teamData, { ...newMember, id: newId }]);
    }
    setNewMember({ cedula: '', nombre: '', cargo: 'Auditor' });
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Fecha de Inicio</label>
              <input 
                type="date" 
                value={cronograma.inicio} 
                onChange={(e) => updateCronograma({ ...cronograma, inicio: e.target.value })} 
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Fecha de Fin</label>
              <input 
                type="date" 
                value={cronograma.fin} 
                onChange={(e) => updateCronograma({ ...cronograma, fin: e.target.value })} 
                style={inputStyle}
              />
            </div>
          </div>
        </Card>

      {/* EQUIPO AUDITOR */}
      <Card style={{ padding: '2rem' }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Asignación de Comisión Auditora</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr auto', gap: '1rem', alignItems: 'end', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>Cédula</label>
              <input 
                type="text" 
                value={newMember.cedula} 
                onChange={(e) => setNewMember({ ...newMember, cedula: e.target.value })} 
                style={inputStyle}
                placeholder="V-12345678"
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
                <option value="Auditor">Auditor</option>
                <option value="Abogado">Abogado</option>
                <option value="Coordinador de Auditoría">Coordinador de Auditoría</option>
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
