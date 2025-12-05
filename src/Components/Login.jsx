import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';

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
        body: JSON.stringify({ email, password })
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
        background: 'linear-gradient(135deg, #6C63FF, #00C9FF)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <Card
        style={{
          width: '24rem',
          borderRadius: '18px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          padding: '10px'
        }}
      >
        <Card.Body>
          <h2
            className="text-center mb-4"
            style={{ fontWeight: '700', color: '#333' }}
          >
            Acceso al Sistema
          </h2>

          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Usuario</Form.Label>
              <Form.Control
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ borderRadius: '10px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600' }}>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: '10px' }}
              />
            </Form.Group>

            <Button
              type="submit"
              className="w-100"
              style={{
                background: '#6C63FF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px',
                fontWeight: '600',
                transition: '0.2s'
              }}
              onMouseOver={(e) => (e.target.style.background = '#5a54d6')}
              onMouseOut={(e) => (e.target.style.background = '#6C63FF')}
            >
              Ingresar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
