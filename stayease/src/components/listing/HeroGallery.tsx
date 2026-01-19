import React from 'react';

const HeroGallery: React.FC = () => {
  return (
    <div className="relative w-full rounded-xl overflow-hidden mb-10 h-[300px] md:h-[400px] lg:h-[500px]">
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 h-full">
        {/* Main large image */}
        <div className="col-span-1 md:col-span-2 row-span-2 relative group cursor-pointer">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC_b08UFqCh5V6rIM7POS0k7DFsfAU0d-618iYsHuGqPsF0C0kCT-a6myGQS9AK2Xidk9P-rF64uuL3iMQ0XN1nvunpJPu8Eskknp1eDmCqG16KVpdxbjno1kfozhMMnvQ8raRhdlmDXz2m7Fiedw7Yt53FMXSwrjxq43Te4kjY_xeD1lmniNh8xq4Rv9JMRDRfQ-vWrgPTATXOK80B0XgFBOOObME3ra-tETwo9kPH7ZGdNrpNJV357lFHiZU91rxMr3spP2p32tU')",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
        </div>
        
        {/* Sub images */}
        <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD9k9Uv41EJ2Y3t425chbxDrEy3CZ9lc67DVNCbMw3Wbbx5GeUUbakEt9liGbLicuqY52VZb-9VXTAmH9l_l_xBT5SH7mgAUla_30mFMqavzl3EVsSj3sO4AWgIu7a71o3BnqU5Z0ipZV0-uysTz8uoh7kZNwwJXiI5ZHHc1ANz1nOUEJflfbWnZB4hZYcgXj0t0Vxkf8ZP5e1wgVd56AKPM8vGyQbk69muAQPp6fXtholgxxoVAohw6k33RZtYXWh2qEJ-9WpF33A')",
            }}
          ></div>
        </div>
        <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD3Ew_dx3867HRLmRXoZAqMa6OtKyPrH99aqbPzstyqZK5gMwV_MhCpBcp1tjeMxthcEVxsMbgVgPAey4cbprSLRuHG8ayPLr7RTRR8hr1mgTyBpcwMkyM3xfvqS1WiekdM7-tYnT-OMdTR3_58d3XoTdy-j123b0_YbvqU4KXrB6FNRnl8TrpRXuCY-TtxFIxH_F0DYReNGHnHMVvDsBOUoBkYfnPLEtA3qb8L6vQ4eiUL-AQWz19ETqMqrxCLjB3YHWZHngOIKG8')",
            }}
          ></div>
        </div>
        <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArTzU4r0RU6OHSZrLlHsgi-rJMNBela7GfGax_xZ0JoabXRkwuFxVu4GjXIBgVMfiJ7pRTwsMUROjKFKs01MEGrDGacrB5o_iCRMioIgr0uOZEFvTJaOk8w8wmUPyV7ji-o7PWW2zrfiqqqy74DRzX0_azaKUIkXHATWgf9w9RvGQJUTndpkafRVpkMqdB7VyIHbSJBRDKM7kV8Ixb6SwTjpyGAJqPIIohUI79-3iAIlfJ5sf1iOLK5lJjab158X2c_CBi4fZMWtM')",
            }}
          ></div>
        </div>
        <div className="hidden md:block col-span-1 row-span-1 relative group cursor-pointer">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA46h2dq4fgeLMV-ThNJP1sUptkdyZmg88kNuDk7tdSbkXmWk3I546Dt297B849Pg3HPRdckXo2xO4TjQZRoj_RGZWkopHufYaeXzwyhDY_LPzSKniB6VHV4s7Y4nw20066pk4CRWVrgrAvLXSWiPtuTWRDuxy4H-RfIT_BfQso9Ug7OM149aJg4KqluRev53spjHzQ5ITUvhP-Qb_JW7BJq2WeE-G1mSzYH03M3tog3SCzZzumMIk_ORI_ERZ7G8SJ2M-OzEPbvPI')",
            }}
          ></div>
          <button className="absolute bottom-4 right-4 bg-white text-black px-4 py-1.5 rounded-lg text-sm font-semibold shadow-md flex items-center gap-2 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
            Show all photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroGallery;

