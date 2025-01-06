import { BackgroundLines } from "./ui/background-lines";
import { Button } from "./ui/moving-border";

export default function HeroSection() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h1 className="relative z-0 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
        LOCKOUT
      </h1>
      <p></p>
      <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10 text-xl">
        TWO CODERS, ONE WINNER, NO MERCY
      </p>
      <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
      >
        Get Started
      </Button>
      -
    </BackgroundLines>
  );
}
