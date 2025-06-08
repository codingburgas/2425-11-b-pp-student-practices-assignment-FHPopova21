import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { BodyMeasurements } from '@/types';
import { Save, User } from 'lucide-react';
import { measurementsService } from '@/services/measurementsService';

const Measurements = () => {
  const { user, updateUser } = useAuthStore();
  const { toast } = useToast();
  
  const [measurements, setMeasurements] = useState<BodyMeasurements>({
    height: 0,
    weight: 0,
    gender: 'male',
    waist: 0,
    chest: 0,
    bodyType: 'medium',
    age: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const data = await measurementsService.getMeasurements();
        if (data) {
          setMeasurements(data);
        }
      } catch (error) {
        console.error('Failed to fetch measurements:', error);
      }
    };

    fetchMeasurements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await measurementsService.saveMeasurements(measurements);
      
      // Update the user in the auth store with the new measurements
      if (response.user) {
        updateUser(response.user);
      }
      
      toast({
        title: "Мерките са запазени",
        description: "Вашите телесни мерки са успешно актуализирани!",
      });
    } catch (error) {
      console.error('Failed to save measurements:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при запазването на мерките. Моля, опитайте отново.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof BodyMeasurements, value: string | number) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: field === 'age' ? (value === '' ? undefined : Number(value)) : 
               typeof value === 'string' ? value : Number(value)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <User className="w-8 h-8 mr-3 text-beige-600" />
          Мои телесни мерки
        </h1>
        <p className="text-gray-600">
          Въведете точните си мерки за най-добра AI препоръка за размер
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Measurements */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Основни мерки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Височина (см)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={measurements.height || ''}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    placeholder="175"
                    min="140"
                    max="220"
                    required
                    className="border-beige-300 focus:border-beige-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Тегло (кг)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={measurements.weight || ''}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    placeholder="70"
                    min="40"
                    max="150"
                    required
                    className="border-beige-300 focus:border-beige-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Пол</Label>
                <Select value={measurements.gender} onValueChange={(value: 'male' | 'female') => handleInputChange('gender', value)}>
                  <SelectTrigger className="border-beige-300 focus:border-beige-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Мъж</SelectItem>
                    <SelectItem value="female">Жена</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Възраст (по желание)</Label>
                <Input
                  id="age"
                  type="number"
                  value={measurements.age || ''}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="25"
                  min="16"
                  max="80"
                  className="border-beige-300 focus:border-beige-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Body Measurements */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Обиколки и телосложение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="chest">Гръдна обиколка (см)</Label>
                  <Input
                    id="chest"
                    type="number"
                    value={measurements.chest || ''}
                    onChange={(e) => handleInputChange('chest', e.target.value)}
                    placeholder="95"
                    min="70"
                    max="150"
                    required
                    className="border-beige-300 focus:border-beige-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waist">Талия (см)</Label>
                  <Input
                    id="waist"
                    type="number"
                    value={measurements.waist || ''}
                    onChange={(e) => handleInputChange('waist', e.target.value)}
                    placeholder="85"
                    min="60"
                    max="120"
                    required
                    className="border-beige-300 focus:border-beige-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bodyType">Тип телосложение</Label>
                <Select value={measurements.bodyType} onValueChange={(value: 'slim' | 'medium' | 'large') => handleInputChange('bodyType', value)}>
                  <SelectTrigger className="border-beige-300 focus:border-beige-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slim">Слабо</SelectItem>
                    <SelectItem value="medium">Средно</SelectItem>
                    <SelectItem value="large">Едро</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-beige-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Съвети за точни мерки:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Измервайте се в по-тесни дрехи</li>
                  <li>• Гръдната обиколка се мери в най-широката част</li>
                  <li>• Талията се мери в най-тесната част</li>
                  <li>• Стойте изправени при измерването</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            type="submit" 
            size="lg"
            disabled={isLoading}
            className="bg-beige-600 hover:bg-beige-700 text-white px-8"
          >
            <Save className="w-5 h-5 mr-2" />
            {isLoading ? 'Запазване...' : 'Запази мерките'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Measurements;
