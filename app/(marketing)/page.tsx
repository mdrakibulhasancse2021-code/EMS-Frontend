import BusinessImpact from "../components/shared/BusinessImpact";
import Features from "../components/shared/Features";
import Hero from "../components/shared/hero";
import Solutions from "../components/shared/Solutions";

export default function LandingPage() {
  return (
    <main className="bg-white dark:bg-slate-950">
      <Hero />
      <Features />
      {/* নতুন প্রোডাক্টিভিটি সেকশন চাইলে এখানে যোগ করতে পারেন */}

      <Solutions />
      {/* <BusinessImpact></BusinessImpact> */}
    </main>
  );
}
