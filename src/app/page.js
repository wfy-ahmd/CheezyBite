import Banner from './components/Banner';
import Pizza from './components/Pizza';

// Pizza data with LKR prices and original descriptions for Sri Lankan market
const pizzas = [
  {
    id: 1,
    name: 'Capricciosa',
    description: 'Tender chicken, fresh mushrooms, and bell peppers on our signature tomato base. A Sri Lankan favorite for its rich, savory taste.',
    image: '/capricciosa.webp',
    priceSm: 1490,
    priceMd: 1890,
    priceLg: 2290,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 2,
    name: 'Cheesy Bliss',
    description: 'Triple cheese blend of mozzarella, cheddar, and processed cheese melted to golden perfection. Pure indulgence for cheese lovers.',
    image: '/cheesy.webp',
    priceSm: 1590,
    priceMd: 1990,
    priceLg: 2390,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 3,
    name: 'Tropical Delight',
    description: 'Sweet pineapple chunks with succulent chicken pieces on a creamy cheese base. A refreshing twist loved across Colombo.',
    image: '/hawaii.webp',
    priceSm: 1590,
    priceMd: 1990,
    priceLg: 2390,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 4,
    name: 'Italiano Special',
    description: 'Fresh basil, Roma tomatoes, and premium mozzarella with aromatic herbs. Authentic taste with a local touch.',
    image: '/italian.webp',
    priceSm: 1790,
    priceMd: 2190,
    priceLg: 2590,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 5,
    name: 'Margherita Classic',
    description: 'Simple yet satisfying - vine-ripened tomatoes, fresh mozzarella, and fragrant basil on our handmade crust.',
    image: '/margherita.webp',
    priceSm: 1390,
    priceMd: 1790,
    priceLg: 2190,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 6,
    name: 'Spicy Pepperoni',
    description: 'Loaded with spicy pepperoni slices and extra mozzarella. A crowd-pleaser at every gathering from Kandy to Galle.',
    image: '/pepperoni.webp',
    priceSm: 1690,
    priceMd: 2090,
    priceLg: 2490,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 7,
    name: 'Four Cheese Feast',
    description: 'A heavenly combination of mozzarella, cheddar, parmesan, and cream cheese. Rich, creamy, and utterly delicious.',
    image: '/quattro-formaggi.webp',
    priceSm: 1890,
    priceMd: 2290,
    priceLg: 2690,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 8,
    name: 'Garden Supreme',
    description: 'Colorful bell peppers, onions, mushrooms, and olives layered on a zesty tomato sauce. Fresh and wholesome.',
    image: '/quattro-stagioni.webp',
    priceSm: 1690,
    priceMd: 2090,
    priceLg: 2490,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 9,
    name: 'Seafood Sensation',
    description: 'Premium prawns and fish flakes with tangy onions on a creamy white sauce. A coastal favorite from our kitchen.',
    image: '/tonno.webp',
    priceSm: 1890,
    priceMd: 2290,
    priceLg: 2690,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
  {
    id: 10,
    name: 'Veggie Paradise',
    description: 'A colorful medley of fresh vegetables including capsicum, onions, tomatoes, and corn. Light, healthy, and full of flavor.',
    image: '/vegetarian.webp',
    priceSm: 1390,
    priceMd: 1790,
    priceLg: 2190,
    toppings: [
      { image: '/cherry.png', name: 'cherry tomatoes', price: 150 },
      { image: '/corn.png', name: 'corn', price: 120 },
      { image: '/fresh-tomatoes.png', name: 'fresh tomatoes', price: 130 },
      { image: '/jalapeno.png', name: 'jalapeno', price: 140 },
      { image: '/parmesan.png', name: 'parmesan', price: 180 },
    ],
  },
];

export default function Home() {
  return (
    <section>
      <Banner />
      <div className='container mx-auto'>
        <div id="menu" className='grid grid-cols-2 gap-[15px] md:grid-cols-3 xl:grid-cols-4 xl:gap-[30px] py-12'>
          {pizzas.map((pizza) => {
            return <Pizza key={pizza.id} pizza={pizza} />;
          })}
        </div>
      </div>
    </section>
  );
}
