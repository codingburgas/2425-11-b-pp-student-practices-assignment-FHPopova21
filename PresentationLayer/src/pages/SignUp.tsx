
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'merchant',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Грешка",
        description: "Паролите не съвпадат",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Mock user creation
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: formData.email,
      name: formData.name,
      role: formData.role,
    };

    login(newUser);
    toast({
      title: "Успешна регистрация",
      description: `Добре дошли в SmartFit, ${newUser.name}!`,
    });

    // Redirect based on role
    switch (newUser.role) {
      case 'user':
        navigate('/dashboard');
        break;
      case 'merchant':
        navigate('/merchant');
        break;
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md glass-card animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl gradient-text">Регистрация в SmartFit</CardTitle>
          <p className="text-gray-600 mt-2">Създайте вашия акаунт</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Име и фамилия</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-beige-300 focus:border-beige-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Имейл адрес</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="border-beige-300 focus:border-beige-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Тип акаунт</Label>
              <Select value={formData.role} onValueChange={(value: 'user' | 'merchant') => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="border-beige-300 focus:border-beige-500">
                  <SelectValue placeholder="Изберете тип акаунт" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Потребител</SelectItem>
                  <SelectItem value="merchant">Търговец</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Парола</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="border-beige-300 focus:border-beige-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Потвърдете паролата</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="border-beige-300 focus:border-beige-500"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-beige-600 hover:bg-beige-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Създаване...' : 'Създай акаунт'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Вече имате акаунт?{' '}
              <Link to="/signin" className="text-beige-600 hover:text-beige-700 font-medium">
                Влезте тук
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
