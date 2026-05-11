import React from 'react';
import { Card } from '../components/ui/Card';

export const Settings = () => {
  return (
    <div>
      <h1 style={{ margin: '0 0 1rem 0' }}>Configuración del Sistema</h1>
      <Card>
        <p>Parámetros globales del sistema, base de datos y respaldos.</p>
        <p>Estado de Construcción: Pendiente</p>
      </Card>
    </div>
  );
};
