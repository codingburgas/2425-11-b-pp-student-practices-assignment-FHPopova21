import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockClothingItems } from '@/data/mockClothing';
import { ClothingItem } from '@/types';
import { TrendingUp, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const API_URL = 'http://localhost:5001/api';

interface SizeRecommendation {
  recommendedSize: string;
  confidence: number;
  explanation: string;
  description?: string;
  alternativeSize?: string;
  alternativeExplanation?: string;
}

const garmentTypeMap: { [key: string]: string } = {
  'shirt': 't-shirt',
  'jacket': 't-shirt',
  'sweater': 't-shirt',
  'skirt': 'pants',
  'dress': 't-shirt'
};
const materialMap: { [key: string]: string } = {
  'semi-elastic': 'elastic',
  'stretchy': 'elastic',
  'rigid': 'non-elastic'
};

const Recommendation = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [recommendation, setRecommendation] = useState<SizeRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentAdded, setCommentAdded] = useState(false);

  useEffect(() => {
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
      if (!user?.bodyMeasurements) throw new Error('Missing body measurements');
      const measurements = user.bodyMeasurements;
      const response = await fetch(`${API_URL}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          clothingType: selectedItem?.type,
          recommendedSize: result.recommendedSize,
          itemIdentifier: String(selectedItem?.id),
          measurements: {
            height: measurements.height.toString(),
            weight: measurements.weight.toString(),
            chest: measurements.chest.toString(),
            waist: measurements.waist.toString(),
            gender: measurements.gender,
            body_type: measurements.bodyType === 'medium' ? 'average' : measurements.bodyType,
            material: materialMap[selectedItem?.material || ''] || selectedItem?.material,
            garment_type: garmentTypeMap[selectedItem?.type || ''] || selectedItem?.type,
            garment_width: selectedItem?.measurements.width
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save recommendation');
      }

      const data = await response.json();
      console.log('Recommendation saved:', data);
      
      toast({
        title: "Success",
        description: "Recommendation saved successfully",
      });
    } catch (error) {
      console.error('Error saving recommendation:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was a problem saving the recommendation",
        variant: "destructive",
      });
    }
  };

  const generateRecommendation = async () => {
    try {
      setIsLoading(true);
      
      const measurements = user?.bodyMeasurements;
      if (!measurements) {
        throw new Error('Missing body measurements');
      }
      const requestBody = {
        height: measurements.height,
        weight: measurements.weight,
        waist: measurements.waist,
        chest: measurements.chest,
        gender: measurements.gender,
        body_type: measurements.bodyType === 'medium' ? 'average' : measurements.bodyType,
        material: materialMap[selectedItem?.material || ''] || selectedItem?.material,
        garment_type: garmentTypeMap[selectedItem?.type || ''] || selectedItem?.type,
        garment_width: selectedItem?.measurements.width
      };

      const response = await fetch('http://localhost:5001/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Prediction response:', data);

      if (!data.size || typeof data.confidence !== 'number') {
        throw new Error('Invalid prediction response format');
      }

      const recommendation: SizeRecommendation = {
        recommendedSize: data.size,
        confidence: Math.round(data.confidence * 100),
        explanation: `We recommend size ${data.size} with ${Math.round(data.confidence * 100)}% confidence`,
        description: `Based on your measurements and the selected clothing type, our AI model predicts that size ${data.size} would be the best fit for you. The model is ${Math.round(data.confidence * 100)}% confident in this recommendation.`,
        alternativeSize: data.alternative_size,
        alternativeExplanation: data.alternative_explanation
      };

      setRecommendation(recommendation);
      
      await saveRecommendation(recommendation);
      
    } catch (error) {
      console.error('Error generating recommendation:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to generate recommendation',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemSelect = (itemId: string) => {
    const item = mockClothingItems.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
      setRecommendation(null);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setCommentLoading(true);
    try {
      const res = await fetch(`/api/clothing/${selectedItem.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: commentText }),
      });
      const data = await res.json();
      if (res.ok) {
        setCommentText('');
        setCommentAdded(true);
        toast({ title: 'Успех', description: data.message });
      } else {
        toast({ title: 'Грешка', description: data.error ? String(data.error) : 'Възникна грешка', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Грешка', description: 'Възникна грешка', variant: 'destructive' });
    } finally {
      setCommentLoading(false);
    }
  };

  if (!user?.bodyMeasurements) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="glass-card text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-xl">
              <AlertCircle className="w-6 h-6 mr-2 text-orange-500" />
              Body Measurements Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              To get an accurate AI size recommendation, please enter your body measurements first.
            </p>
            <Button 
              onClick={() => navigate('/measurements')}
              className="bg-beige-600 hover:bg-beige-700 text-white"
            >
              Enter Measurements
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
          AI Size Recommendation
        </h1>
        <p className="text-gray-600">
          Get an intelligent recommendation based on your measurements and the characteristics of the clothing
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Item Selection */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Select Clothing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select onValueChange={handleItemSelect} value={selectedItem?.id || ''}>
              <SelectTrigger className="border-beige-300 focus:border-beige-500">
                <SelectValue placeholder="Select clothing for recommendation..." />
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
                    <span className="text-gray-500">Type:</span>
                    <p className="font-medium">{selectedItem.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Material:</span>
                    <p className="font-medium">{selectedItem.material}</p>
                  </div>
                </div>

                <div className="bg-white rounded p-3">
                  <h4 className="font-medium mb-2">Clothing Measurements:</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Width:</span>
                      <p className="font-bold">{selectedItem.measurements.width}cm</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Length:</span>
                      <p className="font-bold">{selectedItem.measurements.length}cm</p>
                    </div>
                    {selectedItem.measurements.sleeves && (
                      <div>
                        <span className="text-gray-500">Sleeves:</span>
                        <p className="font-bold">{selectedItem.measurements.sleeves}cm</p>
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
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedItem ? (
              <div className="text-center py-8 text-gray-500">
                Select a clothing item to get a recommendation
              </div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-beige-200 border-t-beige-600 rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">AI is analyzing your measurements...</p>
              </div>
            ) : recommendation ? (
              <div className="space-y-6">
                {/* Main Recommendation */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                    <h3 className="text-xl font-bold text-green-800">
                      Recommended Size: {recommendation.recommendedSize}
                    </h3>
                  </div>
                </div>

                {/* Alternative Recommendation */}
                {recommendation.alternativeSize && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-2">
                      <ArrowRight className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-800">
                        Alternative Size: {recommendation.alternativeSize}
                      </h4>
                    </div>
                    <p className="text-blue-700 text-sm">
                      {recommendation.alternativeExplanation}
                    </p>
                  </div>
                )}

                {/* Your Measurements Summary */}
                <div className="bg-beige-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Your Measurements:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Height:</span>
                      <p className="font-medium">{user.bodyMeasurements.height}cm</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <p className="font-medium">{user.bodyMeasurements.weight}kg</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Chest Circumference:</span>
                      <p className="font-medium">{user.bodyMeasurements.chest}cm</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Waist:</span>
                      <p className="font-medium">{user.bodyMeasurements.waist}cm</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => generateRecommendation()} 
                  variant="outline"
                  className="w-full border-beige-300 text-beige-700 hover:bg-beige-50"
                >
                  New Calculation
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Button 
                  onClick={generateRecommendation}
                  className="bg-beige-600 hover:bg-beige-700 text-white"
                >
                  Generate AI Recommendation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {recommendation && selectedItem && !commentAdded && (
        <form onSubmit={handleAddComment} className="space-y-2 mt-6 max-w-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Оставете коментар за тази дреха:</label>
          <textarea
            className="w-full border rounded p-2"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder="Вашият коментар..."
            required
            rows={3}
          />
          <Button type="submit" disabled={commentLoading || !commentText.trim()}>
            {commentLoading ? 'Изпращане...' : 'Добави коментар'}
          </Button>
        </form>
      )}
      {commentAdded && (
        <div className="mt-4 text-green-600 font-medium">Благодарим за вашия коментар!</div>
      )}
    </div>
  );
};

export default Recommendation;
