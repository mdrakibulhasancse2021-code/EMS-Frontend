import Footer from "../components/shared/footer";
import Navbar from "../components/shared/navbar";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-16">{children}</main>
      <Footer /> {/* ফুটার এখানে বসিয়ে দিন */}
    </div>
  );
}
