import { AddBooking } from "../AddBooking";
import { AllBookings } from "../AllBookings";
import { RecentBookings } from "../RecentBookings";

export const StaffBookings = () => {
  return (
    <div className="p-5 grid gap-10">
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <AddBooking />
        <RecentBookings />
      </div>
      <div className="grid w-full">
        <AllBookings />
      </div>
    </div>
  );
};
