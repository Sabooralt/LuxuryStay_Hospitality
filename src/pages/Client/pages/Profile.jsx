import { Link, NavLink, Outlet } from "react-router-dom";

export const Profile = () => {
  const profileNavItems = [
    {
      name: "General",
      link: "/profile",
    },
    {
      name: "Bookings",
      link: "/profile/bookings",
    },
    {
      name: "Billing",
      link: "/profile/billing",
    },
    {
      name: "Settings",
      link: "/profile/settings",
    },
  ];
  return (
    <div className="p-24 grid place-items-start gap-10 bg-slate-50">
      <div className="text-3xl font-semibold">Profile</div>
      <div className="grid grid-cols-4 ">
        <div className="grid col-span-1 place-content-start">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            {profileNavItems.map((item, index) => (
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `font-semibold ${isActive ? "text-black" : "text-gray-600"}`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="grid col-span-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
