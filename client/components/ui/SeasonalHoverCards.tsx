import React from 'react';
import { cn } from "@/lib/utils";

export interface SeasonCardProps {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
  href?: string;
}

interface SeasonalHoverCardsProps {
  cards: SeasonCardProps[];
  className?: string;
}

const SeasonCard = ({
  title,
  subtitle,
  description,
  imageSrc,
  imageAlt,
  className,
  href,
}: SeasonCardProps) => {
  const CardContent = (
    <div
      className={cn(
        "group relative flex flex-col justify-end p-6 w-full md:flex-1 h-[350px] md:h-[500px] lg:h-[550px] bg-black rounded-xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out cursor-pointer md:hover:flex-[2.5]",
        className
      )}
    >
      <img
        src={imageSrc}
        className="absolute inset-0 w-full h-full object-cover object-center"
        alt={imageAlt || title}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="relative z-10 space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        <p className="text-base md:text-lg text-gray-300">{subtitle}</p>
      </div>
      <div className="mt-4 transform translate-y-6 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 relative z-10">
        <p className="text-base md:text-lg text-white leading-relaxed">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {CardContent}
      </a>
    );
  }

  return CardContent;
};

export function SeasonalHoverCards({
  cards,
  className,
}: SeasonalHoverCardsProps) {
  return (
    <div className={cn("flex flex-col md:flex-row gap-3 md:gap-4 w-full max-w-7xl mx-auto px-4", className)}>
      {cards.map((card, index) => (
        <SeasonCard
          key={index}
          title={card.title}
          subtitle={card.subtitle}
          description={card.description}
          imageSrc={card.imageSrc}
          imageAlt={card.imageAlt}
          href={card.href}
        />
      ))}
    </div>
  );
}
