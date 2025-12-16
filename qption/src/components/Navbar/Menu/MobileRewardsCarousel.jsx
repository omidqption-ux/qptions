import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const MobileRewardsCarousel = () => {
  const rewards = [
    { src: '/trustpilot.png', alt: 'Trustpilot Rating' },
    { src: '/rew1.png', alt: 'Reward 1' },
    { src: '/rew2.png', alt: 'Reward 2' },
    { src: '/rew3.png', alt: 'Reward 3' },
    { src: '/emirates1.png', alt: 'Emirates' },
    { src: '/financesonline.png', alt: 'Finances Online' }
  ];

  return (
    <div className="mobile-rewards-carousel w-full">
      <div className="rewards-track">
        {rewards.map((reward, index) => (
          <motion.div
            key={index}
            className="reward-slide"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="hover:scale-110 transition-transform duration-300 flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-linear-to-r from-green-500/0 via-green-500/40 to-green-500/0 bg-size-[200%_100%] animate-shine" />
              <Image
                src={reward.src}
                alt={reward.alt}
                width={300}
                height={120}
                className="object-contain relative z-10"
              />
            </div>
          </motion.div>
        ))}
      </div>
      <style jsx>{`
  .mobile-rewards-carousel {
    display: block;
    width: 100%;
    overflow: hidden;
    padding: 1rem 0;
  }

  .rewards-track {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 0 1rem;
  }

  .reward-slide {
    flex: 0 0 80%;
    scroll-snap-align: center;
  }

  .rewards-track::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 769px) {
    /* optional: tweak layout for desktop */
    .reward-slide {
      flex: 0 0 25%;
    }
  }
`}</style>
    </div>
  );
};

export default MobileRewardsCarousel; 