import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClothingCard from '@/components/ClothingCard';
import { mockClothingItems } from '@/data/mockClothing';
import { ClothingItem } from '@/types';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const ClothingListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>(mockClothingItems);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [hasRecommendation, setHasRecommendation] = useState(false);

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

  const openDetails = async (item: ClothingItem) => {
    setSelectedItem(item);
    // Fetch comments
    try {
      const res = await fetch(`/api/clothing/${item.id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch {
      setComments([]);
    }
    // Check if user has recommendation for this clothing
    if (user) {
      try {
        const recRes = await fetch('/api/user/recommendations', { credentials: 'include' });
        const recs = await recRes.json();
        console.log('User recommendations:', recs);
        console.log('Current clothing id:', String(item.id));
        setHasRecommendation(recs.some((r: any) => String(r.item_identifier) === String(item.id)));
      } catch (err) {
        console.log('Error fetching recommendations:', err);
        setHasRecommendation(false);
      }
    } else {
      setHasRecommendation(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    setCommentLoading(true);
    console.log('Submitting comment:', commentText, 'for clothing:', selectedItem.id);
    try {
      const res = await fetch(`/api/clothing/${selectedItem.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: commentText }),
      });
      const data = await res.json();
      console.log('Comment POST response:', res.status, data);
      if (res.ok) {
        setCommentText('');
        toast({ title: 'Успех', description: data.message });
        // Reload comments from backend
        const commentsRes = await fetch(`/api/clothing/${selectedItem.id}/comments`);
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      } else {
        toast({ title: 'Грешка', description: data.error ? String(data.error) : 'Възникна грешка', variant: 'destructive' });
      }
    } catch (err) {
      console.log('Error in handleAddComment:', err);
      toast({ title: 'Грешка', description: 'Възникна грешка', variant: 'destructive' });
    } finally {
      setCommentLoading(false);
    }
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
          <div key={item.id} onClick={() => openDetails(item)} style={{ cursor: 'pointer' }}>
            <ClothingCard
              item={item}
              onRecommend={() => handleRecommendation(item)}
              showRecommendButton={true}
            />
          </div>
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

      {/* Details Modal */}
      <Dialog open={!!selectedItem} onOpenChange={open => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">{selectedItem.description}</p>
                <div className="flex gap-4 mt-2">
                  <span>Размер: <b>{selectedItem.size}</b></span>
                  <span>Тип: <b>{selectedItem.type}</b></span>
                  <span>Материя: <b>{selectedItem.material}</b></span>
                </div>
              </div>
              <hr className="my-4" />
              <h3 className="font-semibold mb-2">Коментари</h3>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {comments.length === 0 && <p className="text-gray-500">Няма коментари.</p>}
                {comments.map((c) => (
                  <div key={c.id} className="bg-beige-50 rounded p-2">
                    <div className="text-sm font-medium">{c.user_name || 'Потребител'}</div>
                    <div className="text-xs text-gray-600 mb-1">{new Date(c.created_at).toLocaleString('bg-BG')}</div>
                    <div>{c.content}</div>
                  </div>
                ))}
              </div>
              {user && hasRecommendation && (
                <form onSubmit={handleAddComment} className="space-y-2">
                  <Textarea
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Вашият коментар..."
                    required
                  />
                  <Button type="submit" disabled={commentLoading || !commentText.trim()}>
                    {commentLoading ? 'Изпращане...' : 'Добави коментар'}
                  </Button>
                </form>
              )}
              {user && !hasRecommendation && (
                <div className="text-xs text-gray-500 mt-2">Може да коментирате само ако имате препоръка за тази дреха.</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClothingListing;
