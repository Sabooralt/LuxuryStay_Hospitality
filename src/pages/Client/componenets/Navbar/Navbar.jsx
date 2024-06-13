import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotiDropDown } from "@/globalComponents/NotiDropDown";
import { useAuthContextProvider } from "@/hooks/useAuthContext";
import { BellIcon, LucideMenu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { getInitials } from "@/utils/getInitials";
import { CgMenuMotion } from "react-icons/cg";
import { MenuItems } from "./MenuItems";

export const Navbar = () => {
  const { user, dispatch, logout } = useAuthContextProvider();
  const [shouldShowNavbar, setShouldShowNavbar] = useState(false);
  const [isAnimating, setIsAnimating] = useState();
  const [isOpen, setIsOpen] = useCycle(false, true);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (disabled) {
      const timer = setTimeout(() => {
        setDisabled(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [disabled]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 790);

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
    }
  }, [isAnimating, isOpen]);

  const handleScroll = useRef(() => {
    const scrolled = window.scrollY;
    const threshold = 300;

    if (scrolled > threshold) {
      setShouldShowNavbar(true);
    } else {
      setShouldShowNavbar(false);
    }
  }).current;

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <nav
      className={`fixed w-full  ${
        isOpen ? "text-black " : "text-primary"
      } transition-colors duration-500 z-50`}
      style={{
        backdropFilter: isAnimating
          ? ""
          : shouldShowNavbar
          ? "blur(0.2rem)"
          : "",
        backgroundColor: isAnimating
          ? ""
          : shouldShowNavbar
          ? "rgba(24, 24, 27, 0.7)"
          : "transparent",
      }}
    >
      <MenuItems
        key="menu-items"
        isOpen={isOpen}
        handleIsOpen={() => setIsOpen()}
        setIsAnimating={setIsAnimating}
      />

      <ul
        className={`z-50 flex border-b ${
          isOpen ? "border-black" : "border-white"
        } border-opacity-30 flex-row p-5 md:p-0 md:pl-14 items-center`}
      >
        <button
          onClick={() => setIsOpen()}
          disabled={disabled}
          className="cursor-pointer z-50 text-md items-center flex gap-2 tracking-widest uppercase "
        >
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, rotate: "180deg" }}
              animate={{ opacity: 1, rotate: "0" }}
              exit={{ opacity: 0, rotate: "180deg" }}
              transition={{ duration: 0.2 }}
              key={"open"}
            >
              <X className="size-5" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              key={"closed"}
            >
              <CgMenuMotion className="size-5" />
            </motion.div>
          )}
          Menu
        </button>
        <div className="z-50 uppercase grid place-items-center tracking-widest text-xl md:pl-20 md:pr-0  mx-auto">
          Luxury Stay
        </div>

        <div className="flex justify-between w-fit h-full gap-5 items-center z-20 relative">
          {user && (
            <div className="flex flex-row gap-3">
              <NotiDropDown userType="user" user={user} />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer shadow-lg">
                    <AvatarImage src="//" alt="user" />
                    <AvatarFallback
                      className={`${
                        isOpen
                          ? "text-primary bg-zinc-900"
                          : "text-black bg-primary"
                      } transition duration-500`}
                    >
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {user && user.role === "admin" && (
                    <>
                      <DropdownMenuGroup>
                        <Link className="font-semibold curs" to="/admin">
                          <DropdownMenuItem className="cursor-pointer">
                            Admin Panel
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuGroup>
                    <Link to="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/profile/bookings">
                      <DropdownMenuItem className="cursor-pointer">
                        Bookings
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/profile/billings">
                      <DropdownMenuItem className="cursor-pointer">
                        Billings
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <Link to="/profile/settings">
                      <DropdownMenuItem className="cursor-pointer">
                        Settings
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <button
            className={`hidden md:block px-5 py-7 cursor-pointer border-l font-light text-md ${
              isOpen ? "border-black" : "border-white"
            } border-opacity-30`}
          >
            Book Now
          </button>
        </div>
      </ul>
    </nav>
  );
};
