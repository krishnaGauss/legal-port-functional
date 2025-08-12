
import React, { useState, useMemo, useEffect } from 'react';
import { Star, Phone, MessageCircle, User, CheckCircle, Filter, X, ChevronDown, Search, MapPin } from 'lucide-react';
import { fetchLawyers, Lawyer } from '../services/lawyerService';



interface Filters {
  maxAudioRate: number;
  maxVideoRate: number;
  maxChatRate: number;
  minRating: number;
  minExperience: number;
  onlineOnly: boolean;
  specializations: string[];
  sortBy: 'rating' | 'experience' | 'audioRate' | 'videoRate' | 'chatRate' | 'name';
  sortOrder: 'asc' | 'desc';
}

const LawyerCatalogue: React.FC = () => {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLawyers = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedLawyers = await fetchLawyers();
        setLawyers(fetchedLawyers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load lawyers');
        console.error('Error loading lawyers:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLawyers();
  }, []);

  const [filters, setFilters] = useState<Filters>({
    maxAudioRate: 40,
    maxVideoRate: 30,
    maxChatRate: 35,
    minRating: 0,
    minExperience: 0,
    onlineOnly: false,
    specializations: [],
    sortBy: 'rating',
    sortOrder: 'desc'
  });

  const availableSpecializations = [
    'Matrimonial',
    'Commercial',
    'Consumer',
    'Child Laws',
    'Civil',
    'Corporate',
    'Labour Law',
    'Property Rights',
    'Cheque Bounce',
    'Documentation',
    'Criminal',
    'Challans'
  ];

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedLawyers = useMemo(() => {
    let filtered = lawyers.filter(lawyer => {
      const matchesSearch = lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lawyer.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSpecialization = filters.specializations.length === 0 ||
                                   filters.specializations.some(filterSpec => 
                                     lawyer.specializations.some(lawyerSpec => 
                                       lawyerSpec.toLowerCase().includes(filterSpec.toLowerCase())
                                     )
                                   );
      
      return (
        matchesSearch &&
        matchesSpecialization &&
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
  }, [lawyers, filters, searchTerm]);

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
      specializations: [],
      sortBy: 'rating',
      sortOrder: 'desc'
    });
    setSearchTerm('');
  };

  const toggleSpecialization = (specialization: string) => {
    setFilters(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const LawyerCard: React.FC<{ lawyer: Lawyer }> = ({ lawyer }) => {
    const [selectedCallType, setSelectedCallType] = useState<'audio' | 'video' | 'chat'>('video');

    return (
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100 group">
        <div className="bg-gradient-to-br from-dark-blue via-slate-800 to-dark-blue p-6 text-white relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gold/5 rounded-full translate-y-10 -translate-x-10"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 backdrop-blur-sm ${
                lawyer.isOnline ? 'bg-green-500/20 border border-green-400/30' : 'bg-gray-500/20 border border-gray-400/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  lawyer.isOnline ? 'bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'bg-gray-400'
                }`}></div>
                {lawyer.isOnline ? 'Available Now' : 'Offline'}
              </div>
              {lawyer.verified && (
                <div className="bg-gold/90 backdrop-blur-sm text-dark-blue px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-gold/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified Pro
                </div>
              )}
            </div>

            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gold to-yellow-600 rounded-2xl flex items-center justify-center text-dark-blue font-bold text-xl mb-4 shadow-xl shadow-gold/25 group-hover:scale-110 transition-transform duration-300">
                {lawyer.image}
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">{lawyer.name}</h3>
              <div className="flex flex-wrap justify-center gap-1 mb-2 relative group">
                {lawyer.specializations.slice(0, 2).map((spec, index) => (
                  <span key={index} className="text-xs bg-white/10 backdrop-blur-sm px-2 py-1 rounded-lg border border-white/20">
                    {spec}
                  </span>
                ))}
                {lawyer.specializations.length > 2 && (
                  <span className="text-xs text-gray-300 cursor-help">+{lawyer.specializations.length - 2} more</span>
                )}
                
                {/* Hover tooltip for all specializations */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-dark-blue/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 whitespace-nowrap border border-gold/20 shadow-xl">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {lawyer.specializations.map((spec, index) => (
                      <span key={index} className="bg-gold/20 px-2 py-1 rounded border border-gold/30">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-dark-blue/95"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border border-yellow-200/50">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(lawyer.rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-yellow-800">
              {lawyer.rating}
            </span>
            <span className="text-xs text-yellow-700">
              ({lawyer.reviews.toLocaleString()} reviews)
            </span>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-4 py-2 rounded-xl inline-flex items-center gap-2 text-sm font-bold border border-purple-200/50">
              <MapPin className="w-4 h-4" />
              {lawyer.experience} Years Experience
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['audio', 'video', 'chat'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedCallType(type)}
                className={`p-3 rounded-xl text-center transition-all duration-300 border-2 ${
                  selectedCallType === type
                    ? 'bg-gradient-to-r from-gold to-yellow-500 text-dark-blue border-gold shadow-lg shadow-gold/25 scale-105'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200 hover:border-gray-300 hover:scale-102'
                }`}
              >
                <div className="font-bold text-sm">₹{lawyer.pricing[type]}</div>
                <div className="text-xs uppercase font-medium opacity-80">{type}</div>
                <div className="text-xs opacity-60">per min</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-dark-blue py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-gold/25 hover:shadow-xl hover:shadow-gold/30 hover:scale-105">
              <Phone className="w-4 h-4" />
              Call Now
            </button>
            <button className="border-2 border-gray-200 hover:border-gold text-gray-700 hover:text-gold py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gold/5 hover:scale-105">
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <User className="w-3.5 h-3.5" />
              <span className="font-medium">{lawyer.connections} Connections</span>
            </div>
            {lawyer.verified && (
              <div className="flex items-center gap-1.5 text-green-600 font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const FilterSidebar: React.FC = () => (
    <div className={`${showFilters ? 'block' : 'hidden'} lg:block bg-white rounded-3xl shadow-xl p-8 space-y-8 border border-gray-100`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-dark-blue flex items-center gap-3">
          <div className="p-2 bg-gold/10 rounded-xl">
            <Filter className="w-5 h-5 text-gold" />
          </div>
          Filters
        </h2>
        <button
          onClick={() => setShowFilters(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Sort By</label>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl appearance-none bg-white focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 font-medium"
            >
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="audioRate">Audio Rate</option>
              <option value="videoRate">Video Rate</option>
              <option value="chatRate">Chat Rate</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">Sort Order</label>
          <div className="flex gap-3">
            <button
              onClick={() => updateFilter('sortOrder', 'asc')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                filters.sortOrder === 'asc'
                  ? 'bg-gradient-to-r from-gold to-yellow-500 text-dark-blue shadow-lg shadow-gold/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low to High
            </button>
            <button
              onClick={() => updateFilter('sortOrder', 'desc')}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                filters.sortOrder === 'desc'
                  ? 'bg-gradient-to-r from-gold to-yellow-500 text-dark-blue shadow-lg shadow-gold/25'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              High to Low
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-4">Specializations</label>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {availableSpecializations.map((specialization) => (
              <label
                key={specialization}
                className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="checkbox"
                  checked={filters.specializations.includes(specialization)}
                  onChange={() => toggleSpecialization(specialization)}
                  className="w-5 h-5 text-gold bg-gray-100 border-2 border-gray-300 rounded focus:ring-gold focus:ring-2 transition-all duration-300"
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gold transition-colors">
                  {specialization}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Max Audio Rate: <span className="text-gold">₹{filters.maxAudioRate}/min</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="10"
                max="40"
                value={filters.maxAudioRate}
                onChange={(e) => updateFilter('maxAudioRate', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-grab active:cursor-grabbing slider"
                style={{
                  background: `linear-gradient(to right, #EB9601 0%, #EB9601 ${((filters.maxAudioRate - 10) / (40 - 10)) * 100}%, #E5E7EB ${((filters.maxAudioRate - 10) / (40 - 10)) * 100}%, #E5E7EB 100%)`
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Max Video Rate: <span className="text-gold">₹{filters.maxVideoRate}/min</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="5"
                max="30"
                value={filters.maxVideoRate}
                onChange={(e) => updateFilter('maxVideoRate', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-grab active:cursor-grabbing slider"
                style={{
                  background: `linear-gradient(to right, #EB9601 0%, #EB9601 ${((filters.maxVideoRate - 5) / (30 - 5)) * 100}%, #E5E7EB ${((filters.maxVideoRate - 5) / (30 - 5)) * 100}%, #E5E7EB 100%)`
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Max Chat Rate: <span className="text-gold">₹{filters.maxChatRate}/min</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="8"
                max="35"
                value={filters.maxChatRate}
                onChange={(e) => updateFilter('maxChatRate', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-grab active:cursor-grabbing slider"
                style={{
                  background: `linear-gradient(to right, #EB9601 0%, #EB9601 ${((filters.maxChatRate - 8) / (35 - 8)) * 100}%, #E5E7EB ${((filters.maxChatRate - 8) / (35 - 8)) * 100}%, #E5E7EB 100%)`
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Minimum Rating: <span className="text-gold">{filters.minRating} stars</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => updateFilter('minRating', parseFloat(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-grab active:cursor-grabbing slider"
                style={{
                  background: `linear-gradient(to right, #EB9601 0%, #EB9601 ${(filters.minRating / 5) * 100}%, #E5E7EB ${(filters.minRating / 5) * 100}%, #E5E7EB 100%)`
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Minimum Experience: <span className="text-gold">{filters.minExperience} years</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="25"
                value={filters.minExperience}
                onChange={(e) => updateFilter('minExperience', parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-grab active:cursor-grabbing slider"
                style={{
                  background: `linear-gradient(to right, #EB9601 0%, #EB9601 ${(filters.minExperience / 25) * 100}%, #E5E7EB ${(filters.minExperience / 25) * 100}%, #E5E7EB 100%)`
                }}
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center space-x-4 cursor-pointer group">
            <input
              type="checkbox"
              checked={filters.onlineOnly}
              onChange={(e) => updateFilter('onlineOnly', e.target.checked)}
              className="w-5 h-5 text-gold bg-gray-100 border-2 border-gray-300 rounded focus:ring-gold transition-all duration-300"
            />
            <span className="text-sm font-bold text-gray-700 group-hover:text-gold transition-colors">Show Online Only</span>
          </label>
        </div>

        <button
          onClick={resetFilters}
          className="w-full py-4 px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold rounded-xl transition-all duration-300 hover:scale-105"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue via-slate-900 to-dark-blue">
      <div className="max-w-8xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Find Your Perfect <span className="text-gold">Legal Expert</span>
          </h1>
          <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with verified lawyers instantly via chat, call, or video consultation
          </p>
          
          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl text-white placeholder-gray-300 focus:ring-2 focus:ring-gold focus:border-gold transition-all duration-300 text-lg"
              />
            </div>
          </div>
          
          
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1"></div>
            <button
              onClick={() => setShowFilters(true)}
              className="xl:hidden w-full mb-6 bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-dark-blue py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-gold/25 hover:shadow-xl hover:scale-105"
            >
              <Filter className="w-5 h-5" />
              Show Filters & Sort
            </button>
            <FilterSidebar />
          </div>

          {/* Lawyers Grid */}
          <div className="xl:col-span-4"></div>
            {loading ? (
              <div className="text-center py-20">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/20">
                  <div className="text-gray-400 mb-6">
                    <div className="w-20 h-20 mx-auto opacity-50 animate-spin rounded-full border-4 border-gold border-t-transparent"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Loading lawyers...</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Please wait while we fetch the latest lawyer profiles
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/20">
                  <div className="text-red-400 mb-6">
                    <X className="w-20 h-20 mx-auto opacity-50" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Error loading lawyers</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-dark-blue py-3 px-8 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-gold/25 hover:shadow-xl hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                {filteredAndSortedLawyers.map(lawyer => (
                  <LawyerCard key={lawyer.id} lawyer={lawyer} />
                ))}
              </div>
            )}

            {/* No Results State */}
            {filteredAndSortedLawyers.length === 0 && (
              <div className="text-center py-20">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto border border-white/20">
                  <div className="text-gray-400 mb-6">
                    <Filter className="w-20 h-20 mx-auto opacity-50" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">No lawyers found</h3>
                  <p className="text-gray-300 mb-8 leading-relaxed">
                    Try adjusting your search terms or filters to discover more legal experts
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-gold to-yellow-600 hover:from-yellow-600 hover:to-gold text-dark-blue py-3 px-8 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-gold/25 hover:shadow-xl hover:scale-105"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #EB9601, #F59E0B);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(235, 150, 1, 0.4);
          border: 3px solid white;
          transition: all 0.3s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(235, 150, 1, 0.6);
        }

        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #EB9601, #F59E0B);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(235, 150, 1, 0.4);
          transition: all 0.3s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(235, 150, 1, 0.6);
        }

        .slider::-webkit-slider-track {
          background: transparent;
          height: 12px;
          border-radius: 6px;
        }

        .slider::-moz-range-track {
          background: transparent;
          height: 12px;
          border-radius: 6px;
          border: none;
        }

        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 12px;
          border-radius: 6px;
          outline: none;
          opacity: 0.9;
          transition: opacity 0.3s;
        }

        .slider:hover {
          opacity: 1;
        }

        .slider:active .slider::-webkit-slider-thumb {
          transform: scale(1.3);
          box-shadow: 0 8px 24px rgba(235, 150, 1, 0.8);
        }
        `
      }} />
    </div>
  );
};

export default LawyerCatalogue;
