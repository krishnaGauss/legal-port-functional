import React from 'react';

// Define an interface for the props the component will receive
interface HeroProps {
  onAuthClick: () => void;
}

const Hero = ({ onAuthClick }: HeroProps) => {
  return (
    <section id="home" className="bg-dark-blue pt-16 pb-32">
      <div className="container mx-auto px-4 grid md:grid-cols-2 items-center gap-8">
        {/* Left: Text Content */}
        <div className="text-white">
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Get Expert Legal Advice Anytime, Anywhere
          </h1>
          <p className="text-gray-300 mb-8 max-w-lg">
            Connect with trusted lawyers instantly via chat, call, or video.
          </p>
          {/* Use the onAuthClick prop for the button's onClick event */}
          <button
            onClick={onAuthClick}
            className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-dark-blue transition-colors"
          >
            Request Free Consultation
          </button>
        </div>

        {/* Right: Image */}
        <div className="hidden md:block relative h-full">
          <img
            src="/lady-justice.png"
            alt="Lady Justice"
            className="absolute bottom-[-8rem] right-0 max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;