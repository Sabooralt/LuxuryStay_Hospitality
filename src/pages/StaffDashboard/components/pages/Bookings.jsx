import { AddBooking } from "../AddBooking";
import { RecentBookings } from "../RecentBookings";

export const StaffBookings = () => {
  return (
    <div className="grid items-start p-5 lg:grid-cols-2">
      <AddBooking />
      <RecentBookings/>
    </div>
  );
};
