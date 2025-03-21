import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
