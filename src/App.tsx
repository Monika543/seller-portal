import React, { useState } from 'react';
import { 
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  Users,
  LayoutDashboard,
  UserCircle
} from 'lucide-react';

type FilterCategory = 'recommended' | 'notRecommended';
type RecommendedFilter = 'onboardingInProgress' | 'onboarded' | 'notInterested' | 'rejected';
type NotRecommendedFilter = 'eligible' | 'discussionRequired' | 'notEligible';
type SubFilter = (RecommendedFilter | NotRecommendedFilter)[];

type Retailer = {
  name: string;
  date: string;
  proposedLimit?: number;
  sanctionedLimit?: number;
  tentativeDate?: string;
  onboardedDate?: string;
  rejectionReason?: string;
  recommendedDate?: string;
  recommendedStatus?: RecommendedFilter;
  notRecommendedStatus?: NotRecommendedFilter;
  isNew?: boolean;
};

function App() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('recommended');
  const [activeSubFilters, setActiveSubFilters] = useState<SubFilter>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '2024-03-01',
    end: '2024-03-31'
  });
  const [recommendations, setRecommendations] = useState<{ [key: string]: boolean }>({});
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleFilterToggle = (filter: RecommendedFilter | NotRecommendedFilter) => {
    setActiveSubFilters(prev => {
      if (prev.includes(filter)) {
        return prev.filter(f => f !== filter);
      }
      return [...prev, filter];
    });
  };

  const retailers: Retailer[] = [
    { 
      name: 'Abhilash Telecom', 
      date: '2024-03-15', 
      recommendedStatus: 'onboardingInProgress',
      isNew: true,
      proposedLimit: 2500000,
      tentativeDate: '2024-04-01'
    },
    { 
      name: 'Ajanta Electronic', 
      date: '2024-03-10', 
      recommendedStatus: 'onboarded',
      isNew: true,
      sanctionedLimit: 1500000,
      onboardedDate: '2024-03-10'
    },
    { 
      name: 'Krishna Enterprises', 
      date: '2024-03-20', 
      notRecommendedStatus: 'eligible',
      proposedLimit: 3000000
    },
    { 
      name: 'Sharma Electronics', 
      date: '2024-03-05', 
      recommendedStatus: 'notInterested',
      proposedLimit: 2000000
    },
    { 
      name: 'Metro Mobiles', 
      date: '2024-03-25', 
      notRecommendedStatus: 'discussionRequired'
    },
    {
      name: 'Super Electronics',
      date: '2024-03-15',
      recommendedStatus: 'rejected',
      rejectionReason: 'Insufficient business turnover',
      onboardedDate: '2024-03-15'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  };

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

  const filteredRetailers = retailers.filter(retailer => {
    const retailerDate = new Date(retailer.date);
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    const matchesSearch = retailer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const withinDateRange = retailerDate >= startDate && retailerDate <= endDate;
    
    if (!withinDateRange || !matchesSearch) {
      return false;
    }

    if (activeCategory === 'recommended') {
      return activeSubFilters.length === 0 
        ? retailer.recommendedStatus 
        : retailer.recommendedStatus && activeSubFilters.includes(retailer.recommendedStatus);
    } else {
      return activeSubFilters.length === 0
        ? retailer.notRecommendedStatus
        : retailer.notRecommendedStatus && activeSubFilters.includes(retailer.notRecommendedStatus);
    }
  });

  const handleRecommend = (retailerName: string) => {
    setRecommendations(prev => ({
      ...prev,
      [retailerName]: true
    }));
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <span className="text-[#4F46E5] font-bold text-xl">PROG</span>
              <span className="text-[#10B981] font-bold text-xl ml-1">FIN</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-600" />
            <div className="bg-[#E5E7EB] px-2 py-1 rounded">
              <span className="text-sm font-medium">RP</span>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-xl font-semibold text-gray-900">Retailer Onboarding Overview</h1>
      </div>

      {/* Main Content */}
      <main className="p-4 space-y-4">
        {/* Search Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <input
            type="text"
            placeholder="Search by Retailer Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
          />
        </div>

        {/* Date Filter */}
        <div className="relative bg-white rounded-lg shadow-sm p-4 mb-6">
          <button
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="w-full flex items-center space-x-4 focus:outline-none"
          >
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700 text-sm">
              {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
            </span>
          </button>
          {isDatePickerOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-10 border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setIsDatePickerOpen(false)}
                  className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Category Chips */}
        <div className="flex space-x-2 mb-4">
          <button 
            onClick={() => setActiveCategory('recommended')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${activeCategory === 'recommended' 
                ? 'bg-[#4F46E5] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Recommended by You
          </button>
          <button 
            onClick={() => setActiveCategory('notRecommended')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${activeCategory === 'notRecommended' 
                ? 'bg-[#4F46E5] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Not Recommended Yet
          </button>
        </div>

        {/* Collapsible Filters */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-700">Filters</span>
            {isFiltersExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <div className={`${isFiltersExpanded ? 'block' : 'hidden'} p-4 border-t`}>
            <div className="flex flex-wrap gap-2">
              {activeCategory === 'recommended' ? (
                <>
                  <button
                    onClick={() => handleFilterToggle('onboardingInProgress')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeSubFilters.includes('onboardingInProgress') ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Onboarding in Progress
                  </button>
                  <button
                    onClick={() => handleFilterToggle('onboarded')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeSubFilters.includes('onboarded') ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Onboarded
                  </button>
                  <button
                    onClick={() => handleFilterToggle('notInterested')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeSubFilters.includes('notInterested') ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Not Interested
                  </button>
                  <button
                    onClick={() => handleFilterToggle('rejected')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeSubFilters.includes('rejected') ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Rejected by Progcap
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleFilterToggle('eligible')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeSubFilters.includes('eligible') ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Eligible
                  </button>
                  <button
                    onClick={() => handleFilterToggle('discussionRequired')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeSubFilters.includes('discussionRequired') ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Discussion Required
                  </button>
                  <button
                    onClick={() => handleFilterToggle('notEligible')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeSubFilters.includes('notEligible') ? 'bg-[#4F46E5] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Not Eligible
                  </button>
                </>
              )}
            </div>
            {activeSubFilters.length > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setActiveSubFilters([])}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Retailer Cards */}
        <div className="space-y-3">
          {filteredRetailers.map((retailer, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900">{retailer.name}</h3>
                    {retailer.isNew && (
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded">New</span>
                    )}
                  </div>
                  <div className="space-y-1 mt-2">
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
                  <div className="mt-3 space-y-1">
                    {retailer.recommendedStatus === 'onboarded' && (
                      <>
                        <p className="text-sm text-gray-600">
                          Sanctioned Limit: {formatAmount(retailer.sanctionedLimit || 0)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Onboarded on: {formatDate(retailer.onboardedDate || '')}
                        </p>
                      </>
                    )}
                    {retailer.recommendedStatus === 'onboardingInProgress' && (
                      <>
                        <p className="text-sm text-gray-600">
                          Proposed Limit: {formatAmount(retailer.proposedLimit || 0)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Tentative Date: {formatDate(retailer.tentativeDate || '')}
                        </p>
                      </>
                    )}
                    {retailer.recommendedStatus === 'notInterested' && (
                      <p className="text-sm text-gray-600">
                        Eligible for: {formatAmount(retailer.proposedLimit || 0)}
                      </p>
                    )}
                    {retailer.recommendedStatus === 'rejected' && (
                      <>
                        <p className="text-sm text-gray-600">
                          Rejected on: {formatDate(retailer.onboardedDate || '')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Reason: {retailer.rejectionReason}
                        </p>
                      </>
                    )}
                    {(retailer.notRecommendedStatus === 'eligible' || 
                      retailer.notRecommendedStatus === 'discussionRequired' || 
                      retailer.notRecommendedStatus === 'notEligible') && (
                      <div className="mt-2">
                        {retailer.proposedLimit && retailer.notRecommendedStatus === 'eligible' && (
                          <p className="text-sm text-gray-600 mb-2">
                            Eligible Limit: {formatAmount(retailer.proposedLimit)}
                          </p>
                        )}
                        {retailer.notRecommendedStatus === 'discussionRequired' && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">
                              Might be eligible for other Progcap offerings
                            </p>
                          </div>
                        )}
                        {recommendations[retailer.name] ? (
                          <p className="text-sm text-gray-600">
                            Recommended on: {formatDate(new Date().toISOString())}
                          </p>
                        ) : (
                          <button
                            onClick={() => handleRecommend(retailer.name)}
                            className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA] transition-colors"
                          >
                            Recommend
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Snackbar */}
        {showSnackbar && (
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-4 rounded-lg shadow-xl z-50 min-w-[320px] text-center">
            Our sales representative will reach out to you for a discussion
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 px-4">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center">
            <button className="flex flex-col items-center space-y-1">
              <CreditCard className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">Credit</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <Users className="w-6 h-6 text-[#4F46E5]" />
              <span className="text-xs text-[#4F46E5]">Onboarding</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <LayoutDashboard className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">Program</span>
            </button>
            <button className="flex flex-col items-center space-y-1">
              <UserCircle className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-600">My Account</span>
            </button>
          </div>
        </div>

        {/* Add padding to prevent content from being hidden behind bottom nav */}
        <div className="h-20"></div>
      </main>
    </div>
  );
}

export default App;