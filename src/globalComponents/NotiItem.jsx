import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { Dot } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

export const NotiItem = ({ noti }) => {

    const handleNotiSeen = async (id) => {
        try {
          const response = await axios.patch(`/api/notis/markSeen/${id}`);
    
          if (response.status === 200) {
            console.log("success noti updated as seen");
          }
        } catch (err) {
          console.log(err);
        }
      };
  return (
    <motion.div key={noti._id} onClick={()=>handleNotiSeen(noti._id)}>
      <Link to={noti.link ? noti.link : "#"}>
        <DropdownMenuItem
          onClick={() => handleNotiSeen(noti._id)}
          key={noti._id}
          className={`px-0   ${
            !noti.seen ? "bg-gray-50 font-semibold" : "px-4"
          } ${noti.link && "cursor-pointer"}`}
        >
          <div className={`p-1 flex flex-row items-center`}>
            {!noti.seen && <Dot className="grid w-6 h-6 text-blue-400" />}
            <div>
              <h1>{noti.title}</h1>
              <div className="flex font-sm">
                {formatDistanceToNow(new Date(noti.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        </DropdownMenuItem>
      </Link>
    </motion.div>
  );
};
