import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
