import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { Button } from '../components/ui/Button';
import { Shield, Lock, Mail, KeyRound, ChevronDown, ArrowLeft, Eye, EyeOff } from 'lucide-react';

/**
 * Pantalla de Login del SAI.
 * Flujo: Credenciales → 2FA (si aplica) → Dashboard
 * Incluye selector rápido de usuario para demo.
 */
export const Login = () => {
  const { login, verify2FA, cancel2FA, quickLogin, authStep, loading, error, setError, pendingUser } = useAuth();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // Quick login
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [demoUsers, setDemoUsers] = useState([]);

  // Animation
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Cargar usuarios para el selector rápido
    userService.getAll().then((users) => {
      setDemoUsers(users.filter((u) => u.status === 'Activo'));
    });

    return () => clearTimeout(timer);
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch {
      // Error ya manejado en AuthContext
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await verify2FA(twoFactorCode);
    } catch {
      // Error ya manejado en AuthContext
    }
  };

  const handleQuickLogin = (userId) => {
    quickLogin(userId);
  };

  const handle2FAInput = (e) => {
    // Solo permitir dígitos y máximo 6
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setTwoFactorCode(value);
  };

  // Estilos del formulario
  const inputWrapperStyle = {
    position: 'relative',
    marginBottom: '1.25rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.85rem 0.85rem 0.85rem 2.75rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'white',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.25s, background-color 0.25s',
    boxSizing: 'border-box'
  };

  const inputIconStyle = {
    position: 'absolute',
    left: '0.85rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.45)',
    pointerEvents: 'none'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1B2A4A 40%, #2D4A7A 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(74, 144, 217, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(74, 144, 217, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(74, 144, 217, 0.03) 0%, transparent 70%)
        `,
        pointerEvents: 'none'
      }} />

      {/* Grid Pattern Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        pointerEvents: 'none'
      }} />

      {/* Main Card */}
      <div style={{
        width: '440px',
        maxWidth: '90vw',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '72px',
            height: '72px',
            backgroundColor: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            overflow: 'hidden'
          }}>
            <img
              src="/image.webp"
              alt="CMP Logo"
              style={{
                minWidth: '400%',
                minHeight: '400%',
                objectFit: 'contain',
                objectPosition: 'center',
                transform: 'translate(5%, 5%)'
              }}
            />
          </div>
          <h1 style={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 700,
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.5px'
          }}>
            SAI — CMP
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.85rem',
            margin: 0
          }}>
            Sistema de Auditoría Informática
          </p>
        </div>

        {/* Glass Card */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* Step indicator */}
          {authStep === '2fa' && (
            <button
              onClick={cancel2FA}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 0,
                fontFamily: 'inherit',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            >
              <ArrowLeft size={16} />
              Volver a credenciales
            </button>
          )}

          {/* STEP 1: Credentials */}
          {authStep !== '2fa' && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <Lock size={24} color="rgba(255,255,255,0.5)" style={{ marginBottom: '0.5rem' }} />
                <h2 style={{ color: 'white', fontSize: '1.15rem', margin: '0 0 0.25rem 0' }}>
                  Iniciar Sesión
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: 0 }}>
                  Ingrese sus credenciales institucionales
                </p>
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Correo Electrónico</label>
                <div style={inputWrapperStyle}>
                  <Mail size={18} style={inputIconStyle} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@cmp.gob.ve"
                    required
                    autoFocus
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(74,144,217,0.6)';
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Contraseña</label>
                <div style={inputWrapperStyle}>
                  <Lock size={18} style={inputIconStyle} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ ...inputStyle, paddingRight: '2.75rem' }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(74,144,217,0.6)';
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.85rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: '2px',
                      display: 'flex'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  backgroundColor: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  color: '#FCA5A5',
                  fontSize: '0.85rem',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#4A90D9',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: loading ? 'wait' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'background-color 0.2s, transform 0.1s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#3A7BC8'; }}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4A90D9'}
                onMouseDown={(e) => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Verificando...
                  </span>
                ) : (
                  'Acceder al Sistema'
                )}
              </button>
            </form>
          )}

          {/* STEP 2: 2FA */}
          {authStep === '2fa' && (
            <form onSubmit={handle2FASubmit}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '52px', height: '52px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4A90D9, #3A7BC8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 4px 20px rgba(74,144,217,0.3)'
                }}>
                  <Shield size={24} color="white" />
                </div>
                <h2 style={{ color: 'white', fontSize: '1.15rem', margin: '0 0 0.25rem 0' }}>
                  Verificación de Dos Factores
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
                  Ingrese el código de 6 dígitos enviado a su dispositivo
                </p>
                {pendingUser && (
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(74,144,217,0.15)',
                    color: '#93C5FD',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}>
                    {pendingUser.email}
                  </span>
                )}
              </div>

              {/* 2FA Code Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={inputWrapperStyle}>
                  <KeyRound size={18} style={inputIconStyle} />
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={handle2FAInput}
                    placeholder="000000"
                    maxLength={6}
                    autoFocus
                    style={{
                      ...inputStyle,
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      letterSpacing: '0.75rem',
                      paddingLeft: '1rem',
                      fontWeight: 600
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(74,144,217,0.6)';
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.12)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
                    }}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  backgroundColor: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  color: '#FCA5A5',
                  fontSize: '0.85rem',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || twoFactorCode.length !== 6}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: twoFactorCode.length === 6 ? '#10B981' : '#4A90D9',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  cursor: (loading || twoFactorCode.length !== 6) ? 'not-allowed' : 'pointer',
                  opacity: (loading || twoFactorCode.length !== 6) ? 0.6 : 1,
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Verificando...
                  </span>
                ) : (
                  <>
                    <Shield size={18} />
                    Verificar e Ingresar
                  </>
                )}
              </button>

              <p style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.75rem',
                margin: '1rem 0 0 0',
                fontStyle: 'italic'
              }}>
                Demo: ingrese cualquier código de 6 dígitos (ej. 123456)
              </p>
            </form>
          )}
        </div>

        {/* Quick Login (Demo) */}
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={() => setShowQuickLogin(!showQuickLogin)}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: '10px',
              border: '1px dashed rgba(255,255,255,0.15)',
              backgroundColor: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.8rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
            }}
          >
            <ChevronDown size={14} style={{ transform: showQuickLogin ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
            Acceso rápido (Demo)
          </button>

          {showQuickLogin && (
            <div style={{
              marginTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              animation: 'fadeIn 0.3s ease'
            }}>
              {demoUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleQuickLogin(user.id)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(74,144,217,0.15)';
                    e.currentTarget.style.borderColor = 'rgba(74,144,217,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: 'rgba(74,144,217,0.2)',
                    color: '#93C5FD',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.7rem', flexShrink: 0
                  }}>
                    {user.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.role}
                    </div>
                  </div>
                  {user.twoFactorEnabled && (
                    <Shield size={14} color="rgba(74,144,217,0.5)" title="2FA activo" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.7rem',
          lineHeight: '1.5'
        }}>
          <p style={{ margin: '0 0 0.25rem 0' }}>
            Contraloría del Municipio Pedraza — Estado Barinas
          </p>
          <p style={{ margin: 0 }}>
            Sistema protegido. Acceso no autorizado será sancionado según la ley.
          </p>
        </div>
      </div>

      {/* Spinner keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
