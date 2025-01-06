import { Features, HeroSection, Timelines } from "../components";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="w-full h-[0.1rem] bg-gray-700" ></div>
      <Features />
      <div className="w-full h-[0.1rem] bg-gray-700" ></div>
      <Timelines />
    </>
  );
}
