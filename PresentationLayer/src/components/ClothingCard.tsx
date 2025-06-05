
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ClothingItem } from '@/types';
import { ShoppingBag } from 'lucide-react';

interface ClothingCardProps {
  item: ClothingItem;
  onRecommend?: () => void;
  showRecommendButton?: boolean;
}

const ClothingCard = ({ item, onRecommend, showRecommendButton = true }: ClothingCardProps) => {
  const getClothingTypeLabel = (type: string) => {
    const labels = {
      shirt: 'Риза',
      pants: 'Панталон',
      dress: 'Рокля',
      jacket: 'Яке',
      skirt: 'Пола',
      sweater: 'Пуловер'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getMaterialLabel = (material: string) => {
    const labels = {
      elastic: 'Еластичен',
      'non-elastic': 'Нееластичен',
      'semi-elastic': 'Полу-еластичен'
    };
    return labels[material as keyof typeof labels] || material;
  };

  return (
    <Card className="glass-card hover:shadow-xl transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {item.name}
          </CardTitle>
          <Badge variant="secondary" className="bg-beige-100 text-beige-800">
            {item.size}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Тип:</span>
            <p className="font-medium">{getClothingTypeLabel(item.type)}</p>
          </div>
          <div>
            <span className="text-gray-500">Материя:</span>
            <p className="font-medium">{getMaterialLabel(item.material)}</p>
          </div>
        </div>

        <div className="bg-beige-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Размери:</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Ширина:</span>
              <p className="font-medium">{item.measurements.width}см</p>
            </div>
            <div>
              <span className="text-gray-500">Дължина:</span>
              <p className="font-medium">{item.measurements.length}см</p>
            </div>
            {item.measurements.sleeves && (
              <div>
                <span className="text-gray-500">Ръкави:</span>
                <p className="font-medium">{item.measurements.sleeves}см</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-xs text-gray-500">Търговец:</p>
            <p className="text-sm font-medium">{item.merchantName}</p>
          </div>
          {item.price && (
            <p className="text-lg font-bold text-beige-700">{item.price}лв</p>
          )}
        </div>

        {showRecommendButton && (
          <Button 
            onClick={onRecommend}
            className="w-full bg-beige-600 hover:bg-beige-700 text-white"
            size="sm"
          >
            <ShoppingBag size={16} className="mr-2" />
            AI Препоръка за размер
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ClothingCard;
