
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import { mockClothingItems } from '@/data/mockClothing';
import { useAuthStore } from '@/store/authStore';
import ClothingCard from '@/components/ClothingCard';

const MerchantListings = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter items by current merchant
  const merchantItems = mockClothingItems.filter(item => 
    item.merchantName === user?.name || item.merchantId === user?.id
  );

  const filteredItems = merchantItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const clothingTypes = [
    { value: 'all', label: 'Всички типове' },
    { value: 'shirt', label: 'Ризи' },
    { value: 'pants', label: 'Панталони' },
    { value: 'dress', label: 'Рокли' },
    { value: 'jacket', label: 'Якета' },
    { value: 'skirt', label: 'Поли' },
    { value: 'sweater', label: 'Пуловери' },
  ];

  const handleEdit = (itemId: string) => {
    console.log('Редактиране на обява:', itemId);
    // TODO: Implement edit functionality
  };

  const handleDelete = (itemId: string) => {
    console.log('Изтриване на обява:', itemId);
    // TODO: Implement delete functionality
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <Package className="w-8 h-8 mr-3 text-beige-600" />
              Мои обяви
            </h1>
            <p className="text-gray-600">
              Управлявайте вашите обяви за дрехи
            </p>
          </div>
          <Button className="bg-beige-600 hover:bg-beige-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Нова обява
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-beige-700">Общо обяви</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{merchantItems.length}</div>
            <p className="text-sm text-gray-600">активни обяви</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-beige-700">AI препоръки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">47</div>
            <p className="text-sm text-gray-600">този месец</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-beige-700">Рейтинг</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">4.8★</div>
            <p className="text-sm text-gray-600">средна оценка</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Филтри
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Търсене</label>
              <Input
                placeholder="Търсене по име на дреха..."
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
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600">
          Намерени {filteredItems.length} от {merchantItems.length} обяви
        </p>
      </div>

      {/* Clothing Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="relative">
            <ClothingCard
              item={item}
              onRecommend={() => {}}
              showRecommendButton={false}
            />
            {/* Action buttons overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(item.id)}
                className="bg-white/90 border-gray-300 hover:bg-white"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(item.id)}
                className="bg-white/90 border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-beige-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-beige-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {merchantItems.length === 0 ? 'Няма добавени обяви' : 'Няма намерени резултати'}
          </h3>
          <p className="text-gray-600 mb-4">
            {merchantItems.length === 0 
              ? 'Започнете като добавите ваша първа обява за дреха'
              : 'Опитайте с различни филтри или търсене'
            }
          </p>
          {merchantItems.length === 0 && (
            <Button className="bg-beige-600 hover:bg-beige-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Добавете първата обява
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MerchantListings;
