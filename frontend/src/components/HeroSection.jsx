import { Button } from "./ui/moving-border";
import HomeAnimation from "@/assets/HomeAnimation.mp4";
import { Spotlight } from "./ui/Spotlight";

export default function HeroSection() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden">
      <Spotlight className="left-20" />
      
      <div className="w-full h-64 md:h-auto lg:w-1/2 lg:h-screen overflow-hidden lg:order-2">
        <video
          src={HomeAnimation}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6 md:p-10 text-center lg:text-left lg:order-1">
        <h1 className="text-5xl md:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold">
          LOCKOUT
        </h1>
        <p className="text-neutral-500 max-w-lg my-2 text-lg md:text-2xl">
          TWO CODERS, ONE WINNER, NO MERCY
        </p>
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}
