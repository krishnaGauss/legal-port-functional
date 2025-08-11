import React, { useState, useMemo } from 'react';
import { Star, Phone, MessageCircle, User, CheckCircle, Filter, X, ChevronDown } from 'lucide-react';

interface Lawyer {
  id: number;
  name: string;
  specializations: string[];
  rating: number;
  reviews: number;
  experience: number;
  isOnline: boolean;
  pricing: {
    audio: number;
    video: number;
    chat: number;
  };
  image: string;
  connections: number;
  verified: boolean;
}

interface Filters {
  maxAudioRate: number;
  maxVideoRate: number;
  maxChatRate: number;
  minRating: number;
  minExperience: number;
  onlineOnly: boolean;
  sortBy: 'rating' | 'experience' | 'audioRate' | 'videoRate' | 'chatRate' | 'name';
  sortOrder: 'asc' | 'desc';
}

const LawyerCatalogue: React.FC = () => {
  const [lawyers] = useState<Lawyer[]>([
    {
      id: 1,
      name: "Kausik Chatterjee",
      specializations: ["Commercial", "Civil", "Corporate"],
      rating: 4.9,
      reviews: 1121,
      experience: 15,
      isOnline: true,
      pricing: { audio: 20, video: 10, chat: 15 },
      image: "KC",
      connections: 0,
      verified: true
    },
    {
      id: 2,
      name: "Priya Sharma",
      specializations: ["Family", "Criminal", "Property"],
      rating: 4.7,
      reviews: 856,
      experience: 12,
      isOnline: true,
      pricing: { audio: 25, video: 15, chat: 18 },
      image: "PS",
      connections: 234,
      verified: true
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      specializations: ["Tax", "Corporate", "Intellectual Property"],
      rating: 4.8,
      reviews: 692,
      experience: 18,
      isOnline: false,
      pricing: { audio: 30, video: 20, chat: 22 },
      image: "RK",
      connections: 567,
      verified: true
    },
    {
      id: 4,
      name: "Anita Desai",
      specializations: ["Employment", "Labor", "Contract"],
      rating: 4.6,
      reviews: 423,
      experience: 8,
      isOnline: true,
      pricing: { audio: 18, video: 12, chat: 14 },
      image: "AD",
      connections: 89,
      verified: false
    },
    {
      id: 5,
      name: "Vikram Singh",
      specializations: ["Criminal", "Civil Rights", "Immigration"],
      rating: 4.9,
      reviews: 1523,
      experience: 22,
      isOnline: true,
      pricing: { audio: 35, video: 25, chat: 28 },
      image: "VS",
      connections: 892,
      verified: true
    },
    {
      id: 6,
      name: "Meera Gupta",
      specializations: ["Environmental", "Public Interest", "NGO"],
      rating: 4.5,
      reviews: 234,
      experience: 6,
      isOnline: false,
      pricing: { audio: 15, video: 8, chat: 12 },
      image: "MG",
      connections: 45,
      verified: true
    },
    {
      id: 7,
      name: "Arjun Patel",
      specializations: ["Real Estate", "Construction", "Banking"],
      rating: 4.8,
      reviews: 967,
      experience: 14,
      isOnline: true,
      pricing: { audio: 28, video: 18, chat: 20 },
      image: "AP",
      connections: 445,
      verified: true
    },
    {
      id: 8,
      name: "Sunita Rao",
      specializations: ["Healthcare", "Medical Malpractice", "Insurance"],
      rating: 4.7,
      reviews: 678,
      experience: 11,
      isOnline: true,
      pricing: { audio: 22, video: 14, chat: 16 },
      image: "SR",
      connections: 234,
      verified: true
    }
  ]);

  const [filters, setFilters] = useState<Filters>({
    maxAudioRate: 40,
    maxVideoRate: 30,
    maxChatRate: 35,
    minRating: 0,
    minExperience: 0,
    onlineOnly: false,
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedLawyers = useMemo(() => {
    let filtered = lawyers.filter(lawyer => {
      return (
        lawyer.pricing.audio <= filters.maxAudioRate &&
        lawyer.pricing.video <= filters.maxVideoRate &&
        lawyer.pricing.chat <= filters.maxChatRate &&
        lawyer.rating >= filters.minRating &&
        lawyer.experience >= filters.minExperience &&
        (!filters.onlineOnly || lawyer.isOnline)
      );
    });

    return filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (filters.sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'experience':
          aValue = a.experience;
          bValue = b.experience;
          break;
        case 'audioRate':
          aValue = a.pricing.audio;
          bValue = b.pricing.audio;
          break;
        case 'videoRate':
          aValue = a.pricing.video;
          bValue = b.pricing.video;
          break;
        case 'chatRate':
          aValue = a.pricing.chat;
          bValue = b.pricing.chat;
          break;
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        default:
          aValue = a.rating;
          bValue = b.rating;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [lawyers, filters]);

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      maxAudioRate: 40,
      maxVideoRate: 30,
      maxChatRate: 35,
      minRating: 0,
      minExperience: 0,
      onlineOnly: false,
      sortBy: 'rating',
      sortOrder: 'desc'
    });
  };

  const LawyerCard: React.FC<{ lawyer: Lawyer }> = ({ lawyer }) => {
    const [selectedCallType, setSelectedCallType] = useState<'audio' | 'video' | 'chat'>('video');

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white relative">
          <div className="flex justify-between items-start mb-4">
            <div className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              lawyer.isOnline ? 'bg-green-500' : 'bg-gray-500'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                lawyer.isOnline ? 'bg-green-300 animate-pulse' : 'bg-gray-300'
              }`}></div>
              {lawyer.isOnline ? 'Online' : 'Offline'}
            </div>
            {lawyer.verified && (
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3" />
                Verified
              </div>
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg">
              {lawyer.image}
            </div>
            <h3 className="font-bold text-lg mb-1">{lawyer.name}</h3>
            <p className="text-indigo-200 text-sm">{lawyer.specializations.join(' • ')}</p>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-center gap-2 bg-yellow-50 p-2 rounded-lg">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(lawyer.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-yellow-800">
              {lawyer.rating} ({lawyer.reviews.toLocaleString()})
            </span>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-lg inline-block text-sm font-semibold">
              {lawyer.experience} Years Experience
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['audio', 'video', 'chat'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCallType(type)}
                className={`p-2 rounded-lg text-center transition-all duration-200 ${
                  selectedCallType === type
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <div className="font-bold text-sm">₹{lawyer.pricing[type]}/min</div>
                <div className="text-xs uppercase font-medium">{type}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button className="border-2 border-gray-200 hover:border-indigo-500 text-gray-700 hover:text-indigo-500 py-2 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {lawyer.connections} Connections
            </div>
            {lawyer.verified && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                Verified
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const FilterSidebar: React.FC = () => (
    <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white rounded-2xl shadow-lg p-6 space-y-6`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </h2>
        <button
          onClick={() => setShowFilters(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="audioRate">Audio Rate</option>
              <option value="videoRate">Video Rate</option>
              <option value="chatRate">Chat Rate</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sort Order</label>
          <div className="flex gap-2">
            <button
              onClick={() => updateFilter('sortOrder', 'asc')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                filters.sortOrder === 'asc'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low to High
            </button>
            <button
              onClick={() => updateFilter('sortOrder', 'desc')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                filters.sortOrder === 'desc'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              High to Low
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Max Audio Rate: ₹{filters.maxAudioRate}/min
          </label>
          <input
            type="range"
            min="10"
            max="40"
            value={filters.maxAudioRate}
            onChange={(e) => updateFilter('maxAudioRate', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Max Video Rate: ₹{filters.maxVideoRate}/min
          </label>
          <input
            type="range"
            min="5"
            max="30"
            value={filters.maxVideoRate}
            onChange={(e) => updateFilter('maxVideoRate', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Max Chat Rate: ₹{filters.maxChatRate}/min
          </label>
          <input
            type="range"
            min="8"
            max="35"
            value={filters.maxChatRate}
            onChange={(e) => updateFilter('maxChatRate', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Rating: {filters.minRating}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={filters.minRating}
            onChange={(e) => updateFilter('minRating', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Experience: {filters.minExperience} years
          </label>
          <input
            type="range"
            min="0"
            max="25"
            value={filters.minExperience}
            onChange={(e) => updateFilter('minExperience', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onlineOnly}
              onChange={(e) => updateFilter('onlineOnly', e.target.checked)}
              className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm font-semibold text-gray-700">Online Only</span>
          </label>
        </div>

        <button
          onClick={resetFilters}
          className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Find Your Legal Expert</h1>
          <p className="text-gray-600 text-lg">Connect with verified lawyers for all your legal needs</p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Showing {filteredAndSortedLawyers.length} of {lawyers.length} lawyers
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-1">
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden w-full mb-4 bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Show Filters
            </button>
            <FilterSidebar />
          </div>

          <div className="lg:col-span-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedLawyers.map(lawyer => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))}
            </div>

            {filteredAndSortedLawyers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No lawyers found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
                <button
                  onClick={resetFilters}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
        }
      `}</style>
    </div>
  );
};

export default LawyerCatalogue;