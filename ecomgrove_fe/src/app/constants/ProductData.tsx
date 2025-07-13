export const ProductSortingType = [
  { id: 1, name: "Default Sorting", lowerName: "default_sorting" },
  { id: 2, name: "High to Low", lowerName: "high-to-low" },
  { id: 3, name: "Low to High", lowerName: "low-to-high" },
  { id: 4, name: "New Added", lowerName: "new-added" },
];

export const categoriesData = [
  { id: 1, name: "Shoes" },
  { id: 2, name: "Clothing" },
  { id: 3, name: "Accessories" },
];

export const productData = [
  {
    id: 1,
    name: "Classic Running Shoes",
    desc: "Comfortable and stylish running shoes for daily workouts.",
    price: 59.99,
    imagePath: [
      {
        url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      },
    ],
    categories: "Shoes",
  },
  {
    id: 2,
    name: "Men's Casual Shirt",
    desc: "Breathable cotton shirt perfect for casual outings.",
    price: 29.99,
    imagePath: [
      {
        url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      },
    ],
    categories: "Clothing",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    desc: "High quality wireless headphones with noise cancellation.",
    price: 99.99,
    imagePath: [
      {
        url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
      },
    ],
    categories: "Electronics",
  },
  {
    id: 4,
    name: "Leather Wallet",
    desc: "Durable leather wallet with multiple card slots.",
    price: 25.0,
    imagePath: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
      },
    ],
    categories: "Accessories",
  },
  {
    id: 5,
    name: "Sports Cap",
    desc: "Lightweight and breathable cap for sports activities.",
    price: 15.5,
    imagePath: [
      {
        url: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=800&q=80",
      },
    ],
    categories: "Accessories",
  },
  {
    id: 6,
    name: "Elegant Wristwatch",
    desc: "Water-resistant wristwatch with leather strap.",
    price: 149.99,
    imagePath: [
      {
        url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
      },
    ],
    categories: "Accessories",
  },
];
