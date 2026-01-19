# StayEase - Nền tảng đặt phòng thống nhất

Đây là project tổng hợp từ các màn hình riêng lẻ (staynext, staybook, staydream, stayeasy-profile, host-portal) thành một ứng dụng React hoàn chỉnh với React Router.

## Cấu trúc Project

```
stayease/
├── src/
│   ├── components/
│   │   ├── layout/          # Layout components (Header, Footer, Layout wrapper)
│   │   ├── home/            # Home page components (Hero, CategoryBar, PropertyCard)
│   │   ├── auth/            # Auth page components (AuthForm, HeroSection)
│   │   ├── listing/         # Listing detail components (Gallery, Info, Booking, Reviews)
│   │   ├── profile/         # Profile page components (Form, Stats, Favorites, Bookings)
│   │   └── host/            # Host portal components (Sidebar, PropertyCard)
│   ├── pages/
│   │   ├── HomePage.tsx     # Trang chủ - danh sách property
│   │   ├── AuthPage.tsx     # Trang đăng nhập/đăng ký
│   │   ├── ListingPage.tsx  # Trang chi tiết property
│   │   ├── ProfilePage.tsx  # Trang hồ sơ người dùng
│   │   └── HostPortalPage.tsx # Trang quản lý cho host
│   ├── types/               # TypeScript definitions
│   ├── constants/           # Data constants
│   ├── App.tsx              # Main App với routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

## Routes

- `/` - Trang chủ với danh sách properties
- `/listing/:id` - Trang chi tiết listing
- `/auth` - Trang đăng nhập/đăng ký
- `/profile` - Trang hồ sơ người dùng
- `/host` - Trang quản lý cho host

## Cài đặt và Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## Công nghệ sử dụng

- **React 18** - UI Library
- **React Router 6** - Routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## Tính năng

### Trang chủ (HomePage)
- Hero section với search bar
- Category bar với filter
- Property grid với cards
- Dark mode support

### Trang đăng nhập (AuthPage)
- Login/Signup toggle
- Social login (Google, Facebook)
- Form validation
- Responsive design

### Chi tiết Listing (ListingPage)
- Photo gallery
- Booking widget
- Host profile
- Reviews section
- Map section
- Amenities list

### Hồ sơ người dùng (ProfilePage)
- Profile form
- Booking history
- Favorites
- Statistics

### Host Portal (HostPortalPage)
- Property management
- Dashboard sidebar
- Property cards với status
- Add new listing

## Ghi chú

- Project sử dụng Material Symbols Outlined icons (loaded từ Google Fonts)
- Be Vietnam Pro font family
- Responsive design cho mobile, tablet và desktop
- Support Dark mode

