import React from 'react';

const ReviewsSection: React.FC = () => {
  const metrics = [
    { label: "Cleanliness", score: "4.9", width: "98%" },
    { label: "Accuracy", score: "5.0", width: "100%" },
    { label: "Communication", score: "4.9", width: "98%" },
    { label: "Location", score: "4.8", width: "95%" },
  ];

  const reviews = [
    {
      name: "Sarah",
      date: "October 2023",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAktC3CCcHlRRnU0bpIB35fv_JeR0hznR4hQYFbtK4HTm669hzes3USb4Ppi8SPp9cvNI8CRxGG47Mif7_5rP4I61kHxwCFH3mO_xJnMFO4bzsUi9_4gjLmCN6w36Uo1kqyH2jrFgCBvfHO3jCeC776pUvkyjCX-B2HrL0buiSPiHlZB6X-oL0aT-HU1JGKdQED25Q6c-vYWAHitBBs4uJjKC-NmgWN7vInWI5HF0zAFRmk1kF1Ip-tqHkDt-C1OX5qhj9qW_uJaxg",
      text: "Absolutely loved our stay! The view is even better than the pictures. The pool was pristine and the host was very responsive."
    },
    {
      name: "Michael",
      date: "September 2023",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqcJQRfep96-m_ToLBJK2lEXS7xIp6g00T3nQL0e7bYxzONkXHPaQtffvb8MIH8uPdKbniR8EjjfKdl9GxNO1akWpXlVhGAGvLsfClI7mzFJVGC5X00vzyGlJUL4_FA8vWsji3-cwvYQTUP8-896l-hqqO0GSEghdVx6bQybXXXiMDu2eVof2WbNro1DKms3vxuAfnL82mIs21kmm6HogzEA0g4ZFAmW6K9oGUOzVpF5fWsdQu0jwAw9WN20n1Vf3PR7DcJTZtRbk",
      text: "Great location for exploring Da Nang. The villa is spacious and modern. Would definitely recommend for large groups."
    }
  ];

  return (
    <div className="py-12 border-t border-gray-200 dark:border-gray-700 mt-8">
      <div className="flex items-center gap-2 mb-8">
        <span className="material-symbols-outlined text-2xl filled text-[#0d141b] dark:text-white">star</span>
        <h2 className="text-2xl font-bold text-[#0d141b] dark:text-white">4.92 · 120 reviews</h2>
      </div>

      {/* Review Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex justify-between items-center">
            <span className="text-gray-700 dark:text-gray-300">{metric.label}</span>
            <div className="flex items-center gap-2 w-1/2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div className="bg-black dark:bg-white h-1 rounded-full" style={{ width: metric.width }}></div>
              </div>
              <span className="text-sm font-semibold">{metric.score}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((review, idx) => (
          <div key={idx} className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div
                className="bg-cover bg-center rounded-full size-12 bg-gray-200"
                style={{ backgroundImage: `url('${review.image}')` }}
              ></div>
              <div>
                <h4 className="font-bold text-[#0d141b] dark:text-white">{review.name}</h4>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {review.text}
            </p>
          </div>
        ))}
      </div>

      <button className="mt-8 px-6 py-3 border border-gray-800 dark:border-gray-200 rounded-lg font-semibold text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        Show all 120 reviews
      </button>
    </div>
  );
};

export default ReviewsSection;

