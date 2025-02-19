import { 
  WhatIsLockout,
  HeroSection, 
  Timelines,
  WhyToParticipate,
  Footer
} from "@/components";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="w-full h-[0.1rem] bg-gray-700" ></div>
      <WhatIsLockout />
      <div className="w-full h-[0.1rem] bg-gray-700" ></div>
      <WhyToParticipate />
      <div className="w-full h-[0.1rem] bg-gray-700" ></div>
      <Timelines />
      <Footer />
    </>
  );
}
