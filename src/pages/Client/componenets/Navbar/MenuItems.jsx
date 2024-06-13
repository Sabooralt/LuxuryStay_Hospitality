import { AnimatePresence, delay, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { socials } from "../Footer";

export const MenuItems = ({ handleIsOpen, isOpen,setIsAnimating }) => {
  const guestNavItems = [
    { name: "Home", link: "/" },
    { name: "Rooms", link: "/rooms" },
    { name: "Blogs", link: "/blogs" },
    { name: "Policies", link: "/policies" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
    { name: "Feedbacks", link: "/feedback" },
  ];

  const containerVariants = {
    open: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    },
    closed: {
      opacity: 0,
      transition: { staggerChildren: 0.02, staggerDirection: -1 },
    },
  };

  const footerVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.7,
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
      delay: 1,
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };
  const imgVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        x: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      x: -50,
      opacity: 0,
      transition: {
        x: { stiffness: 1000 },
      },
    },
  };

  const sidebar = {
    open: {
      clipPath: `inset(0 0 0 0)`,
      transition: {
        delay: 0,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      clipPath: "inset(0 0 100% 0)",
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <motion.div
      className={`fixed text-zinc-900 -z-10 size-full`}
      style={{
        backgroundColor: "rgb(212, 206, 197)",
      }}
      variants={sidebar}
      initial={false}
      onAnimationComplete={definition=> {
        definition === "closed" && setIsAnimating(false)
      }}
      animate={isOpen ? "open" : "closed"}
    >
      <motion.div
        animate={isOpen ? "open" : "closed"}
        variants={containerVariants}
        className="grid pt-20 size-full place-items-center"
      >
        <motion.div
          animate={isOpen ? "open" : "closed"}
          className="grid place-items-center size-full md:grid-cols-2 gap-10"
        >
          <motion.div
            variants={imgVariants}
            className="col-span-1 hidden md:block relative w-fit"
          >
            <img
              className="max-w-md rounded-lg h-[350px] mx-auto"
              src="/ClientImages/NavItem.jpg"
            />
            <div className="absolute bg-overlay_1 inset-0"></div>
          </motion.div>
          <div className="col-span-1 size-full place-content-center">
            <motion.div
              animate={isOpen ? "open" : "closed"}
              className="grid md:grid-cols-3 pt-5 md:pt-0 md:place-items-start place-items-center gap-5 md:gap-10 text-zinc-900"
              variants={containerVariants}
            >
              {guestNavItems.map((i, index) => (
                <motion.div
                  key={index}
                  onClick={handleIsOpen}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  variants={itemVariants}
                  className="col-span-1 font-balkind size-fit text-3xl md:text-4xl tracking-wide"
                >
                  <Link to={i.link}>{i.name}</Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          variants={footerVariants}
          className=" flex flex-col justify-between gap-5"
        >
          <div className="flex flex-row gap-10">
            <div className="flex flex-col items-center ">
              <div className="font-medium">Developed By</div>
              <div>
                <a href="https://saboordev.netlify.app">
                  <p className="text-gray-700 group border-black relative">
                    <span>saboordev.netlify.app</span>
                    <div className="absolute bottom-0 group-hover:w-full transition-all duration-300 w-0 h-[2px] rounded-lg bg-black"></div>
                  </p>
                </a>
              </div>
            </div>
            <div className="flex flex-col items-center ">
              <div className="font-medium">Design inspired from</div>
              <div>
                <a href="https://dribbble.com/shots/20891256-Grand-Emily-Hotel-Website">
                  <p className="text-gray-700 group border-black relative">
                    <span>Afterglow</span>
                    <div className="absolute bottom-0 group-hover:w-full transition-all duration-300 w-0 h-[2px] rounded-lg bg-black"></div>
                  </p>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-5 mx-auto">
            {socials.map((s, index) => (
              <Link key={index} to={s.link}>
                {s.icon}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
