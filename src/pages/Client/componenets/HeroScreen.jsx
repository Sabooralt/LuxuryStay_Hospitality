export const HeroScreen = ({ children, height }) => {
  return (
    <div
      className={`h-[100vh] bg-[url('/ClientImages/main.jpg')] bg-no-repeat bg-cover grid items-center text-center`}
    >
      <div className={`absolute h-[100vh] inset-0 bg-overlay`}></div>
      <div className="z-20 drop-shadow-lg grid gap-3 place-items-center mx-auto text-primary w-fit">
        {children}
      </div>
    </div>
  );
};
