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
      <div id="about" className="w-full h-[0.1rem] bg-gray-700" ></div>
      <WhatIsLockout />
      <div id="benefits" className="w-full h-[0.1rem] bg-gray-700" ></div>
      <WhyToParticipate />
      <div  className="w-full h-[0.1rem] bg-gray-700" ></div>
      <Timelines />
      <Footer />
    </>
  );
}
