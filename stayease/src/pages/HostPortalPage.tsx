import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HostSidebar from '@/components/host/HostSidebar';
import HostHeader from '@/components/host/HostHeader';
import HostPropertyCard from '@/components/host/HostPropertyCard';
import { HostProperty, TabType } from '@/types';
import { HOST_USER } from '@/constants';

const properties: HostProperty[] = [
  {
    id: '1',
    title: 'Sunny Studio District 1',
    location: 'Ho Chi Minh City',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoZlwfjfoajsr4mFZVVhuAEosSXDnaSKRR0TVgN3h-GnlHkt3oyP1fUbalfff2zf2ehJnnxS7H1WVwEdinIUV5jLIDE653NALNvQpP_IVM75cpUeOpiL7ydqAoPRm3e2oIn4_yLstHhypfZNI3IiqT8sslBhOdyjdblCPxEt9hVvCysvkgyc5Y7dBTDTu_RWSnzRBe-UQXQ2XuW7KLWyB5wQtsgc0O-ce2vgOApVV9R2m5a9W30Vjkz8ikBkubJho3nrJvLtyjXoM',
    status: 'Active',
    price: 1500000,
    currency: 'VND',
    rating: 4.8,
    upcomingBookings: 4,
    views: 1200,
    isPriceSet: true
  },
  {
    id: '2',
    title: 'Luxury Villa Ocean View',
    location: 'Da Nang',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWJvPxEtkNBq5LcPNgSonlDL1e-zuYvYzeRW7WWCqCOYDxlbtNU1rU125fyaiKVdv0r2woLj8NWRbIZYQXPd5PZyM_Wp87FDBXJgL7mp3GNwWUvcElwR0ccazkuBXt1IXCIxGqS1K3z0_Uy-6aaCS7aO0fXT9b9IjaCMA598bXHqn51ZmX_zqBNsTrgI8goxD5KUdciMrJ7ccRGQao9IpbB4U2OXp4Yo4hjGhga7wffUSRtSOpTJTcEAalfzAfS1oR3LZyb_r9CBQ',
    status: 'Active',
    price: 5200000,
    currency: 'VND',
    rating: 5.0,
    upcomingBookings: 2,
    views: 3400,
    isPriceSet: true
  },
  {
    id: '3',
    title: 'Hanoi Old Quarter Loft',
    location: 'Hanoi',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtddnXsf7DjFev4yuUER-IpCnNGA7ok3d0Xsi9Vc5GUDIheWiYGAq8ntd9DIhrwFQUClVqFBNpShf-0cl9dS2hB5DHWBvAxdeUSXhGYgjkCkaz4XjkhDFvFAtru7vn6_1rHZ0q1y4NfCA8szSt6iW4y9Yb5yfJSnXLp_OmDlhh9NGBLqM0WJQX9bHjh8mj4YdKhBo_SNOBemM_S5pqZuV9kcyrkiolpuEJLROu8p0sn1pS6QHB0fxD9lc6u4-lIuwiz0viw674d_w',
    status: 'Draft',
    price: undefined,
    currency: 'VND',
    rating: undefined,
    upcomingBookings: 0,
    views: 0,
    isPriceSet: false
  },
  {
    id: '4',
    title: 'Spacious 3BR Family Home',
    location: 'District 7, HCMC',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4E5-jl2i6yCHQKJrG73c78RN-wzKjq1Mj0yIJCPgjUTY_EM28C85szgfYjMYr7o9LqZZouju4h7JdTFTYXUw3mGTR4r9C3QVC7n701SDIaztGLazvqXKWYdUDwGht65I2JM_moyEBn4a0Dykhcralmv-KM0LFqeN7maughp2c0oQr717tBq7HOAhXS2PtWbO1QQnpe_3sQohjfZFjj1yRv5O5WVwaZYdRVzyj84eMW545L9JUw-sb7mDToDynJmKFgp4x_b6tt94',
    status: 'Active',
    price: 2800000,
    currency: 'VND',
    rating: 4.5,
    upcomingBookings: 1,
    views: 850,
    isPriceSet: true
  }
];

const HostPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('All Listings');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Filter Logic
  const filteredProperties = properties.filter(prop => {
    if (activeTab === 'All Listings') return true;
    return prop.status === activeTab;
  });

  const getCount = (type: TabType) => {
    if (type === 'All Listings') return 12;
    if (type === 'Active') return 8;
    if (type === 'Draft') return 2;
    if (type === 'Archived') return 2;
    return 0;
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden page-transition">
      
      <HostSidebar 
        user={HOST_USER} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <HostHeader onMenuToggle={() => setMobileMenuOpen(true)} />

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
            
            {/* Breadcrumbs */}
            <nav className="flex text-sm font-medium text-slate-500 dark:text-slate-400">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-slate-900 dark:text-white">My Properties</span>
            </nav>

            {/* Page Heading & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Properties</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your listings and view booking performance.</p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Add New Listing</span>
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 mt-2">
              <div className="flex overflow-x-auto gap-8 pb-0">
                {(['All Listings', 'Active', 'Draft', 'Archived'] as TabType[]).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative pb-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap
                        ${isActive 
                          ? 'text-primary border-primary' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border-transparent hover:border-slate-300'
                        }`}
                    >
                      {tab}
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs
                        ${isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {getCount(tab)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
              {filteredProperties.map(property => (
                <HostPropertyCard key={property.id} property={property} />
              ))}
              
              {/* Add New Property Placeholder */}
              <button className="group flex flex-col items-center justify-center bg-slate-50 dark:bg-[#1a2632]/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:bg-slate-100 dark:hover:bg-[#1a2632] transition-all duration-300 min-h-[340px]">
                <div className="bg-primary/10 text-primary p-4 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">add_home</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add New Property</h3>
                <p className="text-sm text-slate-500 text-center px-8 mt-2">Create a new listing to start earning from your space.</p>
              </button>
            </div>
            
            {/* Footer */}
            <footer className="mt-6 py-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                <p>© 2024 StayEase Host Portal. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                  <a href="#" className="hover:text-primary transition-colors">Contact Support</a>
                </div>
              </div>
            </footer>

          </div>
        </div>
      </main>
    </div>
  );
};

export default HostPortalPage;

