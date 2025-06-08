import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, History } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await authService.getUserRecommendations();
        setRecommendationHistory(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        toast({
          title: 'Грешка',
          description: 'Неуспешно зареждане на препоръките',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [toast]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Моят профил</h1>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info" className="flex items-center gap-2">
            <User size={16} />
            Лична информация
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History size={16} />
            История на препоръки
          </TabsTrigger>
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
                <div>
                  <label className="text-sm font-medium text-gray-500">Роля</label>
                  <p className="text-lg capitalize">{user.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {isLoading ? (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beige-600 mx-auto"></div>
                  <p className="mt-4">Зареждане на препоръки...</p>
                </CardContent>
              </Card>
            ) : recommendationHistory.length > 0 ? (
              recommendationHistory.map((recommendation) => (
                <Card key={recommendation.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Препоръка за {recommendation.clothingType}
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {new Date(recommendation.date).toLocaleDateString('bg-BG')}
                    </p>
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
                <CardContent className="py-8 text-center text-gray-500">
                  <History className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p>Все още нямате направени препоръки</p>
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