import { Category, Listing, MapMarker, HostUser, ChatUser, Conversation } from '@/types';

// Host User (shared across all host pages)
export const HOST_USER: HostUser = {
  name: 'Minh Tran',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  role: 'Superhost'
};

export const CATEGORIES: Category[] = [
  { id: 'beachfront', icon: 'beach_access', label: 'Beachfront' },
  { id: 'cabins', icon: 'cabin', label: 'Cabins' },
  { id: 'trending', icon: 'local_fire_department', label: 'Trending' },
  { id: 'national_parks', icon: 'forest', label: 'National Parks' },
  { id: 'amazing_pools', icon: 'pool', label: 'Amazing Pools' },
  { id: 'islands', icon: 'houseboat', label: 'Islands' },
  { id: 'castles', icon: 'castle', label: 'Castles' },
  { id: 'views', icon: 'landscape', label: 'Views' },
];

export const LISTINGS: Listing[] = [
  {
    id: '1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnjqLsczraflUeSqAym0kpTUehfR_CPG1p8fkeEu5uyIfw6skunxAhMhZKGjDC7k-qPI9aY2wF7wBLSjkfSe2Kx9yIlzQXCo2Rj80_qBUDmsr7ryCubOd1oKQMrMkir0btGJ_dO3KXDhq5tEQI3y8BnAnOFyI8xnFEzZ5oCYXOT40H8pao5VGzvyc2Z7M63Xa1pUdI9c3MoeTAmkFgYrND2Mi191q9gba-OMBwei4_W38QEXmFEJafBbnT9bCgHMrDwuB_JikldFA',
    location: 'Da Lat, Vietnam',
    details: 'Mountain View • 128 km away',
    dates: 'Nov 12 - 17',
    rating: 4.96,
    price: 120,
    isGuestFavorite: true,
  },
  {
    id: '2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBA1FZXF9cRjf-uEn_FJtCFTrX2defPgNDht71F8NB2_RkRQVbUSeiRC9EUKSu9qd86GlPp421zXb0dUFvMqsUNc5Ro4JDRuxOkEM_DMoau6u3Q51wzcHXB7wEeBoZ9M6b_0QgrJ7ZwCAp4f0KjxXu2xF0VMUVLnk73lLIb0LlgWhWJrYYl2jUEEeTC3TchqGvoE9TNhJH1hVjKVMGdTSYMWP4EthwfXHr8OQxUwNbZJ6YbaKNcPE5kRvAGlbtZk3hv6uaQFhBMKko',
    location: 'Phu Quoc, Vietnam',
    details: 'Beachfront • 5 km away',
    dates: 'Dec 01 - 06',
    rating: 4.85,
    price: 245,
  },
  {
    id: '3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTQpZ0qWi79XXuek9pIlqRdyQle44MpIC4MPiOZwG1S8DaREHq09XY6gCSvoZxJUiYkyeVww8vJ5FNHJyNLJ43rtMHzfxNqLdx-3nX6uiplCQWeeZSXf832KyngQsMdxYeBum0pDsH-hq0BSL_erjOFAjn4QXrxUINtqKqImyFUhwPws4P7KK69JvhqpTIrYjZmB5YZtdsg-W88clnR59KKyiKr2RQ7m3BI_SVToy5j1EqhPo5krMW5FtdvfOhrkbfkdeV_XqlT6w',
    location: 'Sapa, Vietnam',
    details: 'Valley View • 340 km away',
    dates: 'Nov 22 - 25',
    rating: 5.0,
    price: 85,
  },
  {
    id: '4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfHFPEUeLrSrmADCqhKLP6c39B77V86_0USR3lvrqmMQoMVOILh7wmgIPRsjP04Qwlz9ej7nakucdAoby9hifdWOM1ShDiXXot3C4ikjVnsyl5nszx762C8mq3Ka_8tvH8qTi4WyA2ZWLLCwYlveGNT4ly5Ag3GZKRZMQfU49bO9qbnOs2R38Mho12xZRthskCIrOvO_TTphkw1WXKu5KVOwx8rffOcpYpZMltOCog-ScOAGn40haeGGTy9i2nIEPegf_iPwHPap4',
    location: 'Ho Chi Minh City',
    details: 'City Center • 2 km away',
    dates: 'Oct 30 - Nov 05',
    rating: 4.92,
    price: 65,
  },
  {
    id: '5',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTNpto8pxngd8vyKVCJXV0TC5whJT6-0Z6u-Zj3yuyz4BpsszyGCdb9iL-Vd40E9rgdRbmw0oNxZ3Hk3iJAFYI5tRgcu-HibX2VTTEBadJeJrxjZidXzq_B--pRqBeVYSZrq3a6zg4dy2hjm8cAgK8ZEswngk0cm6dTZabM9xUPN9NO8sMqITQokpLHxcYarHXKjYv4iB-mm7AiXOuuq7patQFW31wZutIyXHiS3nNGcQS207p3oeTARklUrITpOr9n9RFhTglCMs',
    location: 'Hoi An, Vietnam',
    details: 'Riverside • 800 km away',
    dates: 'Jan 10 - 15',
    rating: 4.88,
    price: 95,
  },
  {
    id: '6',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDsfGYfrut18yfxTaFwKmV01f31CCBoVp2cG9nsOyf_S-I4Xe4WTPL3hTnYEtFkM-dCB6jATXnv85X0tulBS5WH4MPwGaD0AcMC_mKEdq8MLtNHY0HZKOqwyJUzCpU0BGKxOMOo_M-GW1V84OfrxekctjtiBME_A6MUtLxCwWQUeEjQEu111ub8ZEkhg2jK1NLtybGKqpWUbCsx7oUDIzSikwounRwUjYTRn09M6sNGyxndxI65LFkqacjp0R1XAdiLjXsf1LRieg',
    location: 'Nha Trang, Vietnam',
    details: 'Ocean View • 450 km away',
    dates: 'Feb 02 - 07',
    rating: 4.75,
    price: 110,
  },
  {
    id: '7',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1lMcWUk2UErDRIIzvp-UBtPJahNbs7gt7NaHH0u2Ium7mOvpwehlizJbV366l18RwejhafK4pjqPjKzbB3XcTLnqm0c9RORa4ZIfhtAM2EkWJzaKW8Av82IORxKjXlhISo21niyQ6iANfnwVLhAu9cJJ91y75_BoXz1m8FmV8NOLAZ0ci7aKZh75_FbxAd729us9jLYPz-VW1AYCVCb7KvMUufi-R-RK_d_ljFk9F0u7pUy9GEuuIqVQmMlensWuq83AZfskPSAU',
    location: 'Mui Ne, Vietnam',
    details: 'Desert View • 220 km away',
    dates: 'Mar 15 - 20',
    rating: 4.9,
    price: 180,
  },
  {
    id: '8',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBlsw4rBemWKd_LbEvogWkTZIo6pGUTErlgBmiOLtAuYnQ60LnQuUI1pqrJayUE0bz_DUHZDFlQFXpvbMseuwkhex0Nj9-ymU6wlaxafE3DVyZpJXcanjFK81FmEzWcYnayLrmTCUMzSzdVefgcf7gLvponyzFRGdgk7X9Xh9scx7bz_JMP3IoB4NqlX-ZUXKEvSf9jL3lF6t3AZYHV737J55J7F7bIo8tg1qC3ThI9kDnN5s9dpO1s6pzaKIlHYnLn6of8tCTeqNU',
    location: 'Ha Long Bay',
    details: 'Boat House • 1200 km away',
    dates: 'Dec 10 - 12',
    rating: 4.95,
    price: 350,
    isGuestFavorite: true,
  },
];

export const MAP_MARKERS: MapMarker[] = [
  { id: 'm1', price: 120, top: '30%', left: '40%' },
  { id: 'm2', price: 245, top: '60%', left: '20%', isActive: true },
  { id: 'm3', price: 85, top: '20%', left: '60%' },
  { id: 'm4', price: 65, top: '50%', left: '50%' },
  { id: 'm5', price: 95, top: '40%', left: '70%' },
  { id: 'm6', price: 110, top: '70%', left: '80%' },
  { id: 'm7', price: 180, top: '80%', left: '30%' },
  { id: 'm8', price: 350, top: '15%', left: '25%' },
];

// Chat/Messages Constants
export const CURRENT_CHAT_USER: ChatUser = {
  id: 'me',
  name: 'Alex Doe',
  avatarUrl: 'https://i.pravatar.cc/150?u=me',
  isCurrentUser: true,
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    partner: {
      id: 'sarah',
      name: 'Sarah Jenkins',
      avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
      isCurrentUser: false,
    },
    propertyName: 'Modern Loft in Downtown',
    propertyDates: 'Oct 12 - Oct 14',
    propertyImageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=150&h=150&fit=crop',
    status: 'Confirmed',
    unreadCount: 0,
    lastMessageSnippet: 'The lockbox code is 4829. It looks like this:',
    lastMessageTime: '10:42 AM',
    isOnline: true,
    messages: [
      {
        id: 'sys-1',
        senderId: 'system',
        text: '',
        type: 'system',
        timestamp: 'Today, Oct 11',
        systemMeta: {
          title: 'Reservation Confirmed',
          description: "You're all set! Check-in is tomorrow at 3:00 PM.",
          actionText: 'View itinerary',
          icon: 'check',
        },
      },
      {
        id: 'm1',
        senderId: 'sarah',
        text: "Hi there! I'm getting everything ready for your arrival tomorrow. Do you have any questions about the check-in process?",
        type: 'text',
        timestamp: '10:30 AM',
      },
      {
        id: 'm2',
        senderId: 'me',
        text: "Hello Sarah! Yes, could you remind me how to access the building? I think I missed that part in the listing.",
        type: 'text',
        timestamp: '10:35 AM',
        isRead: true,
      },
      {
        id: 'm3',
        senderId: 'sarah',
        text: "No problem! There is a keypad at the main entrance.\n\nThe lockbox code is 4829. It looks like this:",
        type: 'text',
        timestamp: '10:42 AM',
      },
      {
        id: 'm4',
        senderId: 'sarah',
        text: "",
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1091a1661116?w=400&h=300&fit=crop',
        timestamp: '10:42 AM',
      },
    ],
  },
  {
    id: '2',
    partner: {
      id: 'michael',
      name: 'Michael Chen',
      avatarUrl: 'https://i.pravatar.cc/150?u=michael',
      isCurrentUser: false,
    },
    propertyName: 'Cozy Cabin near Lake',
    propertyDates: 'Nov 05 - 08',
    propertyImageUrl: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?w=150&h=150&fit=crop',
    status: 'Confirmed',
    unreadCount: 2,
    lastMessageSnippet: 'Looking forward to hosting you!',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'm2-1',
        senderId: 'michael',
        text: "Looking forward to hosting you!",
        type: 'text',
        timestamp: 'Yesterday',
      },
    ],
  },
  {
    id: '3',
    partner: {
      id: 'emma',
      name: 'Emma Wilson',
      avatarUrl: 'https://i.pravatar.cc/150?u=emma',
      isCurrentUser: false,
    },
    propertyName: 'Beachfront Villa',
    propertyDates: 'Past Trip',
    propertyImageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=150&h=150&fit=crop',
    status: 'Past Trip',
    unreadCount: 0,
    lastMessageSnippet: 'Thanks for being a great guest.',
    lastMessageTime: 'Oct 02',
    messages: [
      {
        id: 'm3-1',
        senderId: 'emma',
        text: "Thanks for being a great guest.",
        type: 'text',
        timestamp: 'Oct 02',
      },
    ],
  },
  {
    id: '4',
    partner: {
      id: 'david',
      name: 'David Brown',
      avatarUrl: 'https://i.pravatar.cc/150?u=david',
      isCurrentUser: false,
    },
    propertyName: 'Mountain Retreat',
    propertyDates: 'Inquiry',
    propertyImageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=150&h=150&fit=crop',
    status: 'Inquiry',
    unreadCount: 0,
    lastMessageSnippet: 'Is the hot tub available in winter?',
    lastMessageTime: 'Sep 28',
    messages: [
      {
        id: 'm4-1',
        senderId: 'me',
        text: "Is the hot tub available in winter?",
        type: 'text',
        timestamp: 'Sep 28',
        isRead: true,
      },
    ],
  },
];
