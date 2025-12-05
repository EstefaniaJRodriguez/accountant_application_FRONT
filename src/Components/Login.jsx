import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Credenciales incorrectas');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);

      if (data.role === 'admin') navigate('/admin');
      else navigate('/contador');

    } catch (err) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F7FA',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '30px',
      }}
    >
      <div
        style={{
          width: '420px',
          background: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ fontWeight: '700', marginBottom: '10px' }}>Iniciar Sesión</h2>
        <p style={{ color: '#6B7280', marginBottom: '25px' }}>
          Ingresa tus credenciales para acceder a tu cuenta
        </p>

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: '600' }}>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #D1D5DB',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label style={{ fontWeight: '600' }}>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: '10px',
                padding: '12px',
                border: '1px solid #D1D5DB',
              }}
            />
          </Form.Group>

          <Button
            type="submit"
            style={{
              background: '#0A2A5B',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              width: '100%',
              fontWeight: '600',
              fontSize: '16px',
            }}
            onMouseOver={(e) => (e.target.style.background = '#0C356A')}
            onMouseOut={(e) => (e.target.style.background = '#0A2A5B')}
          >
            Iniciar sesión
          </Button>
        </Form>

        <div className="text-center mt-4">
          <span style={{ color: '#6B7280' }}>© 2024 ContaPlus — Todos los derechos reservados.</span>
        </div>
      </div>
    </div>
  );
}
