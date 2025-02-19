import { Timeline } from "@/components/ui/timeline";
import C2022 from "./Past/2022.jsx";
import C2023 from "./Past/2023.jsx";
export default function Timelines() {
  const data = [
    {
      title: "2024",
      content: (
        <></>
      ),
    },
    {
      title: "2023",
      content: (
        <C2023 />
      ),
    },
    {
      title: "2022",
      content: (
        <C2022 />
      ),
    },
  ];

  return (
    <div id="history" className="w-full mt-0  ">
      <Timeline data={data} />
    </div>
  );
}
