import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ username, password });
      toast({
        title: "Успешен вход",
        description: "Добре дошли в SmartFit!",
      });
      // Role-based redirect
      const user = useAuthStore.getState().user;
      if (user?.role === 'seller') {
        navigate('/seller', { replace: true });
      } else if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      toast({
        title: "Грешка при вход",
        description: "Невалидно потребителско име или парола",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md glass-card animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gradient-text">Вход в SmartFit</CardTitle>
          <p className="text-gray-600 mt-2">Добре дошли обратно!</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Потребителско име</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-beige-300 focus:border-beige-500"
                placeholder="Въведете потребителско име"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Парола</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-beige-300 focus:border-beige-500"
                placeholder="Въведете парола"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-beige-600 hover:bg-beige-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Влизане...' : 'Вход'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Нямате акаунт?{' '}
              <Link to="/signup" className="text-beige-600 hover:text-beige-700 font-medium">
                Регистрирайте се
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
