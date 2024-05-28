import { Link } from "react-router-dom";
import { HeroScreen } from "../componenets/HeroScreen";
import { Button } from "@/components/ui/button";
import { Crop, Star } from "lucide-react";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { TiGroupOutline } from "react-icons/ti";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RelaxAndEnjoy } from "../componenets/RelaxAndEnjoy";

export const Home = () => {
  return (
    <main className="grid gap-20">
      <HeroScreen height={"80"}>
        <h1 className="text-7xl drop-shadow-lg w-fit">
          Welcome To Our Luxury Rooms
        </h1>

        <p className="text-2xl">Discover our world's #1 Luxury Room For VIP.</p>

        <Button className="text-primary hover:bg-slate-50 hover:text-black bg-secondary p-6 uppercase text-lg font-thin">
          Book Now
        </Button>
      </HeroScreen>

      <div className="grid grid-cols-2 bg-white justify-center mx-auto items-center px-20">
        <div className="flex flex-col mr-auto text-center gap-3 px-20">
          <h3 className="uppercase text-gray-400 text-sm">
            STAY WITH OUR LUXURY ROOMS
          </h3>

          <h1 className="text-5xl">Stay and Enjoy</h1>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus illo
            similique natus, a recusandae? Dolorum, unde a quibusdam est?
            Corporis deleniti obcaecati quibusdam inventore fuga eveniet! Qui
            delectus tempore amet!
          </p>
        </div>

        <div>
          <img src="/ClientImages/home1.png" />
        </div>
      </div>

      <div className="w-full py-20 gap-10 bg-gray-100 grid text-center">
        <div>
          <h3 className="text-gray-400 capitalize">Our luxury rooms </h3>
          <h1 className="text-5xl"> Featured Rooms</h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mx-auto justify-items-center">
          <div className="grid col-span-1 max-w-[650px]">
            <div className="relative">
              <div className="w-fit relative">
                <img src="/ClientImages/img_1.jpg" alt="" />
                <div className="absolute inset-0 bg-overlay"></div>

                <div className="absolute bottom-5 left-5 font-light drop-shadow-2xl flex items-center gap-2 text-primary">
                  Featured Room{" "}
                  <div className="flex gap-1">
                    {[1, 2, 3].map((_) => (
                      <StarFilledIcon />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white px-5 py-10 text-justify font-light grid gap-5">
                <h1 className="text-3xl text-secondary">Presidental Room</h1>

                <div className="flex gap-5 items-center ">
                  <div className="flex gap-2 items-center">
                    <TiGroupOutline className="w-6 h-6" />2 Guests
                  </div>
                  <div className="flex gap-2 items-center">
                    <Crop className="w-6 h-6" />
                    <span>
                      22 ft <sup>2</sup>
                    </span>
                  </div>
                </div>

                <div className="">
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. At
                    consequatur provident laborum odio, dolore voluptatibus
                    soluta dicta, cupiditate tempora minima quos? Doloribus
                    accusantium soluta reprehenderit numquam odio veritatis
                    perferendis praesentium.
                  </p>
                </div>

                <Button className="bg-secondary capitalize w-fit p-5 rounded-none">
                  Book Now from 20$
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-2 col-span-1 ">
            {[1, 2].map((_, index) => (
              <div key={index} className="relative w-fit ">
                <img
                  src="/ClientImages/img_2.jpg"
                  alt="Featured Room"
                  className="block max-w-[445px]"
                />
                <div className="absolute inset-0 bg-overlay"></div>
                <div className="absolute text-primary bottom-5 left-5 font-light drop-shadow-2xl flex items-center gap-2">
                  <span className="flex">Featured Room</span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map((star, starIndex) => (
                      <StarFilledIcon key={starIndex} />
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="bg-yellow-400 hover:bg-yellow-500 font-thin"
                  >
                    From $22
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <RelaxAndEnjoy />

        <div className="py-20 gap-10 grid items-center">
          <div>
            <h3 className="text-gray-400 capitalize">OUR BLOG </h3>
            <h1 className="text-5xl"> Our Recent Blog</h1>
          </div>

          <div className="grid grid-cols-3 px-20 gap-10 mx-auto">
            {[1, 2, 3, 4].map((_, index) => (
              <Card className="grid col-span-1 text-justify p-0" key={index}>
                <CardHeader className="p-0">
                  <img
                    src="/ClientImages/person_2.jpg"
                    alt=""
                    className="max-w-[500px] w-full max-h-[300px] object-cover"
                  />
                </CardHeader>

                <CardContent className="grid gap-5 p-8">
                  <div className="font-light text-gray-500 pb-3 border-b  w-fit border-black">
                    <span className="uppercase text-sm">Rooms</span>
                  </div>

                  <h1 className="text-secondary text-3xl">New Rooms</h1>

                  <p className="font-thin tracking-tight text-gray-600">
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Molestiae dignissimos cupiditate corrupti, eius enim aliquid
                    voluptatum laudantium neque atque facilis aut ratione
                    blanditiis obcaecati nam quasi odit nostrum. Error, facilis?
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};
