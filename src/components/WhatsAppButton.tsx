import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  productName?: string;
  className?: string;
}

const WhatsAppButton = ({ productName, className = "" }: WhatsAppButtonProps) => {
  const handleClick = () => {
    const phone = "919810984537";
    const message = productName
      ? `Namaste Palak! I am very interested in your WellWith ${productName}. Please tell me more about its ingredients.`
      : `Namaste Palak! I am interested in WellWith Sea Buckthorn products. Please tell me more.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className={`whatsapp-float flex items-center justify-center w-14 h-14 ${className}`}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-primary-foreground" />
    </button>
  );
};

export default WhatsAppButton;
