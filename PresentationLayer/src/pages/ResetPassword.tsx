import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    if (password !== confirmPassword) {
      setError('Паролите не съвпадат.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Паролата трябва да е поне 6 символа.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, confirm_password: confirmPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Паролата е сменена успешно.');
      } else {
        setError(data.error || 'Възникна грешка.');
      }
    } catch (err) {
      setError('Възникна грешка при изпращане.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md glass-card p-8">
        <h2 className="text-2xl font-bold mb-4 gradient-text">Нова парола</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Нова парола</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="border-beige-300 focus:border-beige-500"
            />
          </div>
          <div>
            <Label htmlFor="confirm-password">Потвърди парола</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="border-beige-300 focus:border-beige-500"
            />
          </div>
          <Button type="submit" className="w-full bg-beige-600 hover:bg-beige-700 text-white" disabled={loading}>
            {loading ? 'Записване...' : 'Запази новата парола'}
          </Button>
        </form>
        {message && <div className="mt-4 text-green-600">{message}</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
        <Button variant="link" className="mt-4" onClick={() => navigate('/signin')}>Към вход</Button>
      </div>
    </div>
  );
};

export default ResetPassword; 