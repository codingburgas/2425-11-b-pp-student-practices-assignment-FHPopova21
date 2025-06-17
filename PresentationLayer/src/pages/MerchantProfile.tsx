
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockClothingItems } from '@/data/mockClothing';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useState } from 'react';

const MerchantProfile = () => {
  const { user } = useAuthStore();

  // Filter listings for this merchant
  const [listings, setListings] = useState(
    mockClothingItems.filter(item => item.merchantId === String(user?.id))
  );

  // Mock recommendation requests per listing
  const recommendationRequests = listings.map(item => ({
    id: item.id,
    name: item.name,
    requests: Math.floor(Math.random() * 20) + 1, // mock data
    gender: Math.random() > 0.5 ? 'male' : 'female',
  }));

  const handleDelete = (id: string) => {
    setListings(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 bg-gradient-to-r from-beige-100 to-beige-50 rounded-2xl shadow-lg p-8 mb-4">
        <Avatar className="w-24 h-24 border-4 border-beige-300 shadow-md">
          <AvatarFallback className="text-3xl bg-beige-200 text-beige-700">
            {user?.name ? user.name[0].toUpperCase() : 'M'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold text-beige-800 mb-1 flex items-center gap-3">
            {user?.name || 'Merchant'}
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full ml-2 uppercase tracking-wide">{user?.role}</span>
          </h1>
          <div className="text-gray-600 text-lg">{user?.email}</div>
          <Button asChild className="mt-4 px-6 py-2 text-base font-semibold bg-beige-600 hover:bg-beige-700 shadow-lg">
            <Link to="/profile/edit">Edit Profile</Link>
          </Button>
        </div>
      </div>

      {/* Listings Section */}
      <Card className="glass-card mb-8 bg-white/90 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-beige-700 flex items-center gap-2">
            <User className="w-6 h-6 text-beige-600" /> My Listings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {listings.length > 0 ? (
            <ul className="grid md:grid-cols-2 gap-6">
              {listings.map(listing => (
                <li key={listing.id} className="rounded-xl border border-beige-200 bg-beige-50 p-4 shadow hover:shadow-lg transition-all duration-200 relative">
                  <div className="font-semibold text-lg text-beige-800 mb-1">{listing.name}</div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                    <span className="bg-beige-200 px-2 py-1 rounded">Size: {listing.size}</span>
                    <span className="bg-beige-200 px-2 py-1 rounded">Material: {listing.material}</span>
                  </div>
                  <div className="text-beige-700 font-bold mb-2">${listing.price}</div>
                  <button
                    onClick={() => handleDelete(listing.id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded shadow focus:outline-none"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No listings found.</div>
          )}
        </CardContent>
      </Card>

      {/* Recommendation Requests Section */}
      <Card className="glass-card bg-white/90 shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-700">Recommendation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendationRequests.length > 0 ? (
            <ul className="grid md:grid-cols-2 gap-6">
              {recommendationRequests.map(req => (
                <li key={req.id} className="rounded-xl border border-green-200 bg-green-50 p-4 shadow hover:shadow-lg transition-all duration-200">
                  <div className="font-semibold text-lg text-green-800 mb-1">{req.name}</div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-2">
                    <span className="bg-green-200 px-2 py-1 rounded">{req.requests} users</span>
                    <span className="bg-green-200 px-2 py-1 rounded">Gender: {req.gender}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No recommendation requests found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantProfile; 