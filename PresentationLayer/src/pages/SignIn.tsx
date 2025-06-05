
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore, mockUsers } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password') {
      login(user);
      toast({
        title: "Успешен вход",
        description: `Добре дошли, ${user.name}!`,
      });
      
      // Redirect based on role
      switch (user.role) {
        case 'user':
          navigate('/dashboard');
          break;
        case 'merchant':
          navigate('/merchant');
          break;
        case 'admin':
          navigate('/admin');
          break;
      }
    } else {
      toast({
        title: "Грешка при вход",
        description: "Невалиден имейл или парола",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
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
              <Label htmlFor="email">Имейл адрес</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-beige-300 focus:border-beige-500"
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

          <div className="mt-6 p-4 bg-beige-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo акаунти:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Потребител:</strong> user@smartfit.bg</p>
              <p><strong>Търговец:</strong> merchant@smartfit.bg</p>
              <p><strong>Админ:</strong> admin@smartfit.bg</p>
              <p className="mt-2"><strong>Парола:</strong> password</p>
            </div>
          </div>

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
