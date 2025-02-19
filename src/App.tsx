import React, { useState } from 'react';
import { 
  User,
  ChevronRight,
  X,
  ChevronLeft,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type FilterCategory = 'recommended' | 'notRecommended';
type RecommendedFilter = 'onboardingInProgress' | 'onboarded' | 'notInterested' | 'rejected';
type NotRecommendedFilter = 'eligible' | 'discussionRequired' | 'notEligible';

type Retailer = {
  name: string;
  recommendedStatus?: RecommendedFilter;
  notRecommendedStatus?: NotRecommendedFilter;
};

function App() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<(RecommendedFilter | NotRecommendedFilter)[]>([]);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(true);

  const retailers: Retailer[] = [
    { name: 'Abhilash Telecom', recommendedStatus: 'onboardingInProgress' },
    { name: 'Ajanta Electronic', recommendedStatus: 'onboarded' },
    { name: 'Krishna Enterprises', notRecommendedStatus: 'eligible' },
    { name: 'Sharma Electronics', recommendedStatus: 'notInterested' },
    { name: 'Metro Mobiles', notRecommendedStatus: 'discussionRequired' },
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      onboardingInProgress: 'text-yellow-600 bg-yellow-50',
      onboarded: 'text-green-600 bg-green-50',
      notInterested: 'text-red-600 bg-red-50',
      rejected: 'text-gray-600 bg-gray-50',
      eligible: 'text-blue-600 bg-blue-50',
      discussionRequired: 'text-purple-600 bg-purple-50',
      notEligible: 'text-red-600 bg-red-50'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  const getStatusText = (status: string) => {
    const text = {
      onboardingInProgress: 'Onboarding in Progress',
      onboarded: 'Onboarded',
      notInterested: 'Not Interested',
      rejected: 'Rejected by Progcap',
      eligible: 'Eligible',
      discussionRequired: 'Discussion Required',
      notEligible: 'Not Eligible'
    };
    return text[status as keyof typeof text] || status;
  };

  const recommendedFilters: RecommendedFilter[] = [
    'onboardingInProgress',
    'onboarded',
    'notInterested',
    'rejected'
  ];

  const notRecommendedFilters: NotRecommendedFilter[] = [
    'eligible',
    'discussionRequired',
    'notEligible'
  ];

  const toggleFilter = (filter: RecommendedFilter | NotRecommendedFilter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filteredRetailers = retailers.filter(retailer => {
    if (activeCategory === 'recommended') {
      return retailer.recommendedStatus && 
        (selectedFilters.length === 0 || selectedFilters.includes(retailer.recommendedStatus));
    } else {
      return retailer.notRecommendedStatus && 
        (selectedFilters.length === 0 || selectedFilters.includes(retailer.notRecommendedStatus));
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[#4F46E5] font-bold text-xl">PROG</span>
            <span className="text-[#10B981] font-bold text-xl">FIN</span>
          </div>
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-600" />
            <div className="bg-[#E5E7EB] px-2 py-1 rounded">
              <span className="text-sm font-medium">RP</span>
            </div>
          </div>
        </div>
        <div className="bg-[#F97316] px-4 py-2 flex items-center text-white">
          <button className="mr-3">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">NEW MAHAKALI ENTERPRISES</span>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Retailer Onboarding Overview</h1>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Category Chips */}
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              setActiveCategory('recommended');
              setShowFilters(true);
              setSelectedFilters([]);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${activeCategory === 'recommended' 
                ? 'bg-[#4F46E5] text-white' 
                : 'bg-gray-100 text-gray-600'}`}
          >
            Recommended by You
          </button>
          <button 
            onClick={() => {
              setActiveCategory('notRecommended');
              setShowFilters(true);
              setSelectedFilters([]);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${activeCategory === 'notRecommended' 
                ? 'bg-[#4F46E5] text-white' 
                : 'bg-gray-100 text-gray-600'}`}
          >
            Not Recommended Yet
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Filters</h3>
                <button 
                  onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {isFiltersExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isFiltersExpanded ? 'max-h-40 mt-3' : 'max-h-0'
              }`}
            >
              <div className="flex flex-wrap gap-2">
                {(activeCategory === 'recommended' ? recommendedFilters : notRecommendedFilters).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => toggleFilter(filter)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                      ${selectedFilters.includes(filter)
                        ? 'bg-[#4F46E5] text-white'
                        : 'bg-gray-100 text-gray-600'}`}
                  >
                    {getStatusText(filter)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Retailer Cards */}
        <div className="space-y-3">
          {filteredRetailers.map((retailer, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{retailer.name}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                    getStatusColor(
                      activeCategory === 'recommended' 
                        ? retailer.recommendedStatus || ''
                        : retailer.notRecommendedStatus || ''
                    )}`}
                  >
                    {getStatusText(
                      activeCategory === 'recommended'
                        ? retailer.recommendedStatus || ''
                        : retailer.notRecommendedStatus || ''
                    )}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;