import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import {
  BadgeCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  Info,
  MapPin,
  Sparkles,
  Star,
  X
} from 'lucide-react';
import { DiscoveryCard, SwipeAction } from '@pairup/domain-types';

interface SwipeCardProps {
  card: DiscoveryCard;
  isFront: boolean;
  onSwipe: (action: SwipeAction) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ card, isFront, onSwipe }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [showFullBio, setShowFullBio] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 150], [0, 1]);
  const passOpacity = useTransform(x, [-20, -150], [0, 1]);

  const photos = card.photos && card.photos.length > 0
    ? card.photos.map((p) => p.url)
    : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800'];

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      onSwipe(SwipeAction.LIKE);
    } else if (info.offset.x < -threshold) {
      onSwipe(SwipeAction.PASS);
    } else if (info.offset.y < -120) {
      onSwipe(SwipeAction.SUPER_LIKE);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <motion.div
      style={isFront ? { x, rotate } : {}}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={isFront ? handleDragEnd : undefined}
      whileTap={isFront ? { cursor: 'grabbing' } : undefined}
      className={`absolute inset-0 w-full h-[580px] sm:h-[620px] rounded-3xl overflow-hidden shadow-2xl bg-midnightInk text-white cursor-grab select-none ${
        !isFront ? 'scale-[0.96] -translate-y-3 pointer-events-none opacity-85' : 'z-20'
      }`}
    >
      {/* Background Image Carousel */}
      <img
        src={photos[photoIndex]}
        alt={card.displayName}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      />

      {/* Dark gradient for typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnightInk via-midnightInk/30 to-black/30 pointer-events-none" />

      {/* Photo Pagination Bars */}
      {photos.length > 1 && (
        <div className="absolute top-3 inset-x-4 flex gap-1.5 z-20">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i === photoIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}

      {/* Tap Left / Right targets to flip photos */}
      <div className="absolute inset-0 flex z-10">
        <div className="w-1/2 h-2/3" onClick={prevPhoto} />
        <div className="w-1/2 h-2/3" onClick={nextPhoto} />
      </div>

      {/* Animated Stamp: LIKE (Right Drag) */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-12 left-6 z-30 pointer-events-none border-4 border-coral text-coral font-display font-black text-3xl sm:text-4xl tracking-wider uppercase px-4 py-1.5 rounded-2xl rotate-[-15deg] bg-black/40 backdrop-blur-md shadow-2xl shadow-coral/50 flex items-center gap-2"
      >
        <span>LIKE</span>
        <Heart className="w-8 h-8 fill-coral" />
      </motion.div>

      {/* Animated Stamp: PASS (Left Drag) */}
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-12 right-6 z-30 pointer-events-none border-4 border-rose text-rose font-display font-black text-3xl sm:text-4xl tracking-wider uppercase px-4 py-1.5 rounded-2xl rotate-[15deg] bg-black/40 backdrop-blur-md shadow-2xl shadow-rose/50 flex items-center gap-2"
      >
        <span>PASS</span>
        <X className="w-8 h-8 stroke-[3]" />
      </motion.div>

      {/* Card Information Layer */}
      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 z-20 pointer-events-none">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white drop-shadow-md">
              {card.displayName}, {card.age}
            </h2>
            {card.verificationStatus === 'VERIFIED' && (
              <BadgeCheck className="w-6 h-6 text-sky-400 fill-sky-400/20 drop-shadow" />
            )}
            {card.pronouns && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white/90 font-medium">
                {card.pronouns}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullBio(!showFullBio);
            }}
            className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-colors"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>

        {/* Location & Intentions */}
        <div className="flex items-center gap-3 text-xs text-white/80 font-medium mb-3 flex-wrap">
          {card.city && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-peach" />
              <span>{card.city}</span>
              {card.approximateDistanceKm !== null && card.approximateDistanceKm !== undefined && (
                <span className="text-white/60">• ~{card.approximateDistanceKm} km away</span>
              )}
            </span>
          )}

          <span className="px-2 py-0.5 rounded-full bg-coral/30 border border-coral/40 text-white font-semibold">
            {card.relationshipIntention?.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Short Bio */}
        {card.bio && (
          <p className="text-xs sm:text-sm text-white/90 line-clamp-2 leading-relaxed mb-3">
            {card.bio}
          </p>
        )}

        {/* Interest Chips */}
        {card.interests && card.interests.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {card.interests.slice(0, 4).map((interest) => (
              <span
                key={interest.id}
                className="px-2.5 py-1 rounded-xl bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white flex items-center gap-1 shadow-sm"
              >
                <span>{interest.emoji || '✨'}</span>
                <span>{interest.name}</span>
              </span>
            ))}
            {card.interests.length > 4 && (
              <span className="text-[11px] text-white/70 font-semibold px-1">
                +{card.interests.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
