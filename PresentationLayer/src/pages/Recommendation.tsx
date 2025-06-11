import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockClothingItems } from '@/data/mockClothing';
import { calculateSizeRecommendation } from '@/utils/aiRecommendation';
import { ClothingItem, SizeRecommendation } from '@/types';
import { TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'http://localhost:5001/api';

const Recommendation = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if item was passed from clothing listing
    if (location.state?.selectedItem) {
      setSelectedItem(location.state.selectedItem);
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedItem && user?.bodyMeasurements) {
      generateRecommendation();
    }
  }, [selectedItem, user?.bodyMeasurements]);

  const saveRecommendation = async (result: SizeRecommendation) => {
    try {
      const response = await fetch(`${API_URL}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          clothingType: selectedItem?.type,
          recommendedSize: result.recommendedSize,
          itemIdentifier: selectedItem?.id,
          measurements: {
            height: user?.bodyMeasurements?.height.toString(),
            weight: user?.bodyMeasurements?.weight.toString(),
            chest: user?.bodyMeasurements?.chest.toString(),
            waist: user?.bodyMeasurements?.waist.toString(),
            bodyType: user?.bodyMeasurements?.bodyType
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save recommendation');
      }

      const data = await response.json();
      console.log('Recommendation saved:', data);
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast({
        title: "Грешка",
        description: "Възникна проблем при запазването на препоръката",
        variant: "destructive",
      });
    }
  };

  const generateRecommendation = async () => {
    if (!selectedItem || !user?.bodyMeasurements) return;

    setIsLoading(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = calculateSizeRecommendation(user.bodyMeasurements, selectedItem);
    setRecommendation(result);
    
    // Save the recommendation
    await saveRecommendation(result);
    
    setIsLoading(false);

    toast({
      title: "AI препоръка готова!",
      description: `Препоръчваме размер ${result.recommendedSize} с ${result.confidence}% увереност`,
    });
  };

  const handleItemSelect = (itemId: string) => {
    const item = mockClothingItems.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setRecommendation(null);
    }
  };

  if (!user?.bodyMeasurements) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="glass-card text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-xl">
              <AlertCircle className="w-6 h-6 mr-2 text-orange-500" />
              Необходими са телесни мерки
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              За да получите точна AI препоръка за размер, първо трябва да въведете вашите телесни мерки.
            </p>
            <Button 
              onClick={() => navigate('/measurements')}
              className="bg-beige-600 hover:bg-beige-700 text-white"
            >
              Въведете мерки
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <TrendingUp className="w-8 h-8 mr-3 text-beige-600" />
          AI Препоръка за размер
        </h1>
        <p className="text-gray-600">
          Получете интелигентна препоръка на база вашите мерки и характеристиките на дрехата
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Item Selection */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Изберете дреха</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleItemSelect} value={selectedItem?.id || ''}>
              <SelectTrigger className="border-beige-300 focus:border-beige-500">
                <SelectValue placeholder="Изберете дреха за препоръка..." />
              </SelectTrigger>
              <SelectContent>
                {mockClothingItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} - {item.size} ({item.merchantName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedItem && (
              <div className="bg-beige-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{selectedItem.name}</h3>
                  <Badge variant="secondary">{selectedItem.size}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Тип:</span>
                    <p className="font-medium">{selectedItem.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Материя:</span>
                    <p className="font-medium">{selectedItem.material}</p>
                  </div>
                </div>

                <div className="bg-white rounded p-3">
                  <h4 className="font-medium mb-2">Размери на дрехата:</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Ширина:</span>
                      <p className="font-bold">{selectedItem.measurements.width}см</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Дължина:</span>
                      <p className="font-bold">{selectedItem.measurements.length}см</p>
                    </div>
                    {selectedItem.measurements.sleeves && (
                      <div>
                        <span className="text-gray-500">Ръкави:</span>
                        <p className="font-bold">{selectedItem.measurements.sleeves}см</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              AI Препоръка
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedItem ? (
              <div className="text-center py-8 text-gray-500">
                Изберете дреха за да получите препоръка
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-beige-200 border-t-beige-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">AI анализира вашите мерки...</p>
              </div>
            ) : recommendation ? (
              <div className="space-y-6">
                {/* Main Recommendation */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-xl font-bold text-green-800">
                      Препоръчан размер: {recommendation.recommendedSize}
                    </h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span className="text-green-700 font-medium">Увереност: {recommendation.confidence}%</span>
                      <div className="ml-3 flex-1 bg-green-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${recommendation.confidence}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-green-800 leading-relaxed">
                    {recommendation.explanation}
                  </p>
                </div>

                {/* Alternative Recommendation */}
                {recommendation.alternativeSize && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <ArrowRight className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-800">
                        Алтернативен размер: {recommendation.alternativeSize}
                      </h4>
                    </div>
                    <p className="text-blue-700 text-sm">
                      {recommendation.alternativeExplanation}
                    </p>
                  </div>
                )}

                {/* Your Measurements Summary */}
                <div className="bg-beige-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Вашите мерки:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Височина:</span>
                      <p className="font-medium">{user.bodyMeasurements.height}см</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Тегло:</span>
                      <p className="font-medium">{user.bodyMeasurements.weight}кг</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Гръдна обиколка:</span>
                      <p className="font-medium">{user.bodyMeasurements.chest}см</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Талия:</span>
                      <p className="font-medium">{user.bodyMeasurements.waist}см</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => generateRecommendation()} 
                  variant="outline"
                  className="w-full border-beige-300 text-beige-700 hover:bg-beige-50"
                >
                  Ново изчисление
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button 
                  onClick={generateRecommendation}
                  className="bg-beige-600 hover:bg-beige-700 text-white"
                >
                  Генерирай AI препоръка
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Recommendation;
