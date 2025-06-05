import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClothingCard from '@/components/ClothingCard';
import { mockClothingItems } from '@/data/mockClothing';
import { ClothingItem } from '@/types';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClothingListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>(mockClothingItems);
  const navigate = useNavigate();

  const filterItems = () => {
    let filtered = mockClothingItems;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.merchantName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    if (selectedSize !== 'all') {
      filtered = filtered.filter(item => item.size === selectedSize);
    }

    setFilteredItems(filtered);
  };

  useEffect(() => {
    filterItems();
  }, [searchTerm, selectedType, selectedSize]);

  const handleRecommendation = (item: ClothingItem) => {
    // Navigate to recommendation page with item data
    navigate('/recommendation', { state: { selectedItem: item } });
  };

  const clothingTypes = [
    { value: 'all', label: 'Всички типове' },
    { value: 'shirt', label: 'Ризи' },
    { value: 'pants', label: 'Панталони' },
    { value: 'dress', label: 'Рокли' },
    { value: 'jacket', label: 'Якета' },
    { value: 'skirt', label: 'Поли' },
    { value: 'sweater', label: 'Пуловери' },
  ];

  const sizes = ['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
          <Search className="w-8 h-8 mr-3 text-beige-600" />
          Дрехи от търговци
        </h1>
        <p className="text-gray-600">
          Прегледайте наличните дрехи и получете AI препоръка за размер
        </p>
      </div>

      {/* Filters */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Филтри
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Търсене</label>
              <Input
                placeholder="Търсене по име или търговец..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-beige-300 focus:border-beige-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Тип дреха</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="border-beige-300 focus:border-beige-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clothingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Размер</label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="border-beige-300 focus:border-beige-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map(size => (
                    <SelectItem key={size} value={size}>
                      {size === 'all' ? 'Всички размери' : size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Намерени {filteredItems.length} резултата
        </p>
      </div>

      {/* Clothing Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <ClothingCard
            key={item.id}
            item={item}
            onRecommend={() => handleRecommendation(item)}
            showRecommendButton={true}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-beige-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Няма намерени резултати
          </h3>
          <p className="text-gray-600">
            Опитайте с различни филтри или търсене
          </p>
        </div>
      )}
    </div>
  );
};

export default ClothingListing;
