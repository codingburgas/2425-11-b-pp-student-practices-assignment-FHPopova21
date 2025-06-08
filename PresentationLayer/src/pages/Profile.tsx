import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, History, Ruler } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface RecommendationHistory {
  id: number;
  date: string;
  clothingType: string;
  recommendedSize: string;
  measurements: {
    height: string;
    weight: string;
    chest: string;
    waist: string;
    bodyType: string;
  };
}

const Profile = () => {
  const { user } = useAuthStore();
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationHistory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/user/recommendations', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setRecommendationHistory(data);
        }
      } catch (error) {
        console.error('Failed to fetch history:', error);
        toast({
          title: "Грешка",
          description: "Неуспешно зареждане на история на препоръките",
          variant: "destructive",
        });
      }
    };

    fetchHistory();
  }, [toast]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
        <User className="w-8 h-8 mr-3 text-beige-600" />
        Моят профил
      </h1>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="measurements">Телесни мерки</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Лична информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Потребителско име</label>
                  <p className="text-lg">{user.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Имейл</label>
                  <p className="text-lg">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="measurements">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ruler className="w-5 h-5 mr-2 text-beige-600" />
                Телесни мерки
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.bodyMeasurements ? (
                <div className="space-y-6">
                  {/* Basic Measurements */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Основни мерки</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Височина</label>
                        <p className="text-lg">{user.bodyMeasurements.height} см</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Тегло</label>
                        <p className="text-lg">{user.bodyMeasurements.weight} кг</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Пол</label>
                        <p className="text-lg capitalize">
                          {user.bodyMeasurements.gender === 'male' ? 'Мъж' : 'Жена'}
                        </p>
                      </div>
                      {user.bodyMeasurements.age && (
                        <div>
                          <label className="text-sm font-medium text-gray-500">Възраст</label>
                          <p className="text-lg">{user.bodyMeasurements.age} години</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Measurements */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-3">Обиколки и телосложение</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Гръдна обиколка</label>
                        <p className="text-lg">{user.bodyMeasurements.chest} см</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Талия</label>
                        <p className="text-lg">{user.bodyMeasurements.waist} см</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Телосложение</label>
                        <p className="text-lg capitalize">
                          {user.bodyMeasurements.bodyType === 'slim' ? 'Слабо' :
                           user.bodyMeasurements.bodyType === 'medium' ? 'Средно' : 'Едро'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link to="/measurements">
                      <Button variant="outline" className="w-full">
                        Редактирай мерките
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Все още не сте въвели вашите телесни мерки</p>
                  <Link to="/measurements">
                    <Button className="bg-beige-600 hover:bg-beige-700">
                      Въведи мерки
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {recommendationHistory.length > 0 ? (
              recommendationHistory.map((recommendation) => (
                <Card key={recommendation.id}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{recommendation.clothingType}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(recommendation.date).toLocaleDateString('bg-BG')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Препоръчан размер</label>
                        <p className="text-xl font-bold text-beige-600">{recommendation.recommendedSize}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Височина</label>
                        <p>{recommendation.measurements.height} см</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Тегло</label>
                        <p>{recommendation.measurements.weight} кг</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Гръдна обиколка</label>
                        <p>{recommendation.measurements.chest} см</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Талия</label>
                        <p>{recommendation.measurements.waist} см</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Телосложение</label>
                        <p className="capitalize">{recommendation.measurements.bodyType}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-6">
                  <p className="text-gray-600">Все още нямате история на препоръки</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile; 