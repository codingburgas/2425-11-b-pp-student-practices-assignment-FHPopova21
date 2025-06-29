import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, History, Ruler, ChevronDown, ChevronUp } from 'lucide-react';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  relatedRecommendations?: RecommendationHistory[];
}

const Profile = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationHistory[]>([]);
  const { toast } = useToast();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await authService.getUserRecommendations();
        console.log('Fetched recommendations:', data);
        setRecommendationHistory(data);
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
  }, [isAuthenticated, navigate, toast]);

  if (!user) {
    return null;
  }

  const renderRecommendationDetails = (recommendation: RecommendationHistory) => (
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
  );

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
          <TabsTrigger value="password">Смяна на парола</TabsTrigger>
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
                <Collapsible
                  key={recommendation.id}
                  open={expandedItems.includes(recommendation.id)}
                  onOpenChange={() => toggleExpand(recommendation.id)}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{recommendation.clothingType}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            {new Date(recommendation.date).toLocaleDateString('bg-BG')}
                          </span>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-0">
                              {expandedItems.includes(recommendation.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {renderRecommendationDetails(recommendation)}
                      
                      <CollapsibleContent>
                        {recommendation.relatedRecommendations && recommendation.relatedRecommendations.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-700 mb-4">Предишни препоръки за този артикул</h4>
                            <div className="space-y-4">
                              {recommendation.relatedRecommendations.map((related, index) => (
                                <Card key={related.id} className="bg-gray-50">
                                  <CardHeader>
                                    <CardTitle className="text-sm flex justify-between">
                                      <span>Препоръка #{index + 1}</span>
                                      <span className="text-gray-500">
                                        {new Date(related.date).toLocaleDateString('bg-BG')}
                                      </span>
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    {renderRecommendationDetails(related)}
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
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

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Смяна на парола</CardTitle>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ChangePasswordForm = () => {
  const { toast } = useToast();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Успех', description: data.message });
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        toast({ title: 'Грешка', description: data.error || 'Възникна грешка', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Грешка', description: 'Възникна грешка', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="old-password">Стара парола</Label>
        <Input
          id="old-password"
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="new-password">Нова парола</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="confirm-new-password">Потвърди нова парола</Label>
        <Input
          id="confirm-new-password"
          type="password"
          value={confirmNewPassword}
          onChange={e => setConfirmNewPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Смяна...' : 'Смени паролата'}
      </Button>
    </form>
  );
};

export default Profile; 