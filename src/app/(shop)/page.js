// Force Re-compile 3
import Banner from '../components/Banner';
import { BestSellers, Highlights, HowItWorks, OffersBanner, SocialProof } from '../components/LandingSections';
import dbConnect from '@/lib/dbConnect';
import Pizza from '@/models/Pizza';
import Topping from '@/models/Topping';

async function getData() {
  try {
    await dbConnect();
    
    // Fetch directly from database - no HTTP calls needed
    const [pizzas, toppings] = await Promise.all([
      Pizza.find({ enabled: true }).sort({ createdAt: -1 }).lean(),
      Topping.find({ enabled: true }).lean()
    ]);

    // Convert MongoDB documents to plain objects with string IDs
    const processedPizzas = pizzas.map(pizza => ({
      ...pizza,
      _id: pizza._id.toString(),
      toppings: toppings.map(t => ({ ...t, _id: t._id.toString() }))
    }));

    return processedPizzas;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return [];
  }
}

export default async function Home() {
  const pizzas = await getData();

  return (
    <main>
      <Banner />
      <Highlights />
      <BestSellers pizzas={pizzas} />
      <OffersBanner />
      <HowItWorks />
      <SocialProof />
    </main>
  );
}

