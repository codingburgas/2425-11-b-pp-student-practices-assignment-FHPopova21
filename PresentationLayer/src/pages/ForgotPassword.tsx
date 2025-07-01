import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Ако имейлът е регистриран, ще получите линк за смяна на паролата.');
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
        <h2 className="text-2xl font-bold mb-4 gradient-text">Забравена парола</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Имейл адрес</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="example@email.com"
              className="border-beige-300 focus:border-beige-500"
            />
          </div>
          <Button type="submit" className="w-full bg-beige-600 hover:bg-beige-700 text-white" disabled={loading}>
            {loading ? 'Изпращане...' : 'Изпрати линк за възстановяване'}
          </Button>
        </form>
        {message && <div className="mt-4 text-green-600">{message}</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}
        <Button variant="link" className="mt-4" onClick={() => navigate('/signin')}>Назад към вход</Button>
      </div>
    </div>
  );
};

export default ForgotPassword; 