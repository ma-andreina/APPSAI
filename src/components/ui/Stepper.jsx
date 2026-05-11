import React from 'react';
import { Check } from 'lucide-react';

export const Stepper = ({ currentStep, steps }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: '2rem' }}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep === stepNumber;
        const isCompleted = currentStep > stepNumber;

        return (
          <React.Fragment key={stepNumber}>
            {/* Step Circle */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: isActive ? 'var(--brand-accent)' : isCompleted ? 'var(--status-closed)' : 'var(--surface-hover)',
                color: isActive || isCompleted ? 'white' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                zIndex: 2,
                transition: 'all 0.3s ease'
              }}>
                {isCompleted ? <Check size={20} /> : stepNumber}
              </div>
              <span style={{
                position: 'absolute',
                top: '48px',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
              }}>
                {step.label}
              </span>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div style={{
                flex: 1,
                maxWidth: '150px',
                height: '4px',
                backgroundColor: isCompleted ? 'var(--status-closed)' : 'var(--surface-hover)',
                margin: '0 1rem',
                marginTop: '-24px', // Align with circles
                zIndex: 1,
                transition: 'all 0.3s ease'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
