import { MagicCard } from "@/components/ui/magic-card";

export function Tournament() {
  return (
    <div
      className={
        "w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }
    >
      <MagicCard
        className="h-[50vh] cursor-pointer flex-col items-center justify-center whitespace-nowrap text-4xl shadow-2xl"
        gradientColor={"#262626"}
      >
        Magic
      </MagicCard>
      <MagicCard
        className="cursor-pointer flex-col items-center justify-center whitespace-nowrap text-4xl shadow-2xl"
        gradientColor={"#262626"}
      >
        Card
      </MagicCard>
    </div>
  );
}
