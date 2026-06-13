import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";

export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Hi Ooty Trails, I'd like to book a cab in Ooty.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
