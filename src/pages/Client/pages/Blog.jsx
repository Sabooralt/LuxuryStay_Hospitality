import { Button } from "@/components/ui/button";
import { HeroScreen } from "../componenets/HeroScreen";
import { NewsCard } from "../componenets/NewsCard";

export const Blog = () => {
  const navigationButtons = ["Previous", 1, 2, 3, "Next"];
  return (
    <div className="grid gap-20 ">
      <HeroScreen height={80}>
        <h1 className="text-6xl">News & Events</h1>
        <p className="text-2xl">
          Read our daily news and events of our luxury hotel.
        </p>
      </HeroScreen>

      <div className="grid p-20 justify-items-center gap-10 items-center mx-auto">
        <div className="grid px-[10rem]  grid-cols-3 gap-10 z-40">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="grid col-span-1">
              <NewsCard />
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-3">
          {navigationButtons.map((item, index) => (
            <Button
              key={index}
              size="sm"
              className="border-secondary bg-primary text-secondary font-thin hover:bg-white"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
