import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  productName?: string;
  className?: string;
}

const WhatsAppButton = ({ productName, className = "" }: WhatsAppButtonProps) => {
  const phone = "919266086554";
  const message = productName
    ? `Namaste Palak! I am very interested in your WellWith ${productName}. Please tell me more about its ingredients.`
    : `Namaste Palak! I am interested in WellWith Sea Buckthorn products. Please tell me more.`;
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-float flex items-center justify-center w-14 h-14 ${className}`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-primary-foreground" />
    </a>
  );
};

export default WhatsAppButton;
