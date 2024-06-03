import { socket } from "@/socket";
import axios from "axios";
import { useEffect, useState, createContext, useReducer } from "react";

export const RoomContext = createContext();

export const RoomReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROOMS":
      return {
        room: action.payload,
      };
    case "NEW_ROOM":
      return {
        room: [action.payload, ...state.room],
      };
      case "DELETE_ROOM":
        return {
          
          room: state.room
            ? state.room.filter((w) => !action.payload.includes(w._id))
            : [],
        };
    default:
      return state;
  }
};
export const RoomContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RoomReducer, {
    room: [],
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get("/api/room");

        if (response.status === 200) {
          dispatch({ type: "SET_ROOMS", payload: response.data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRoom();
  }, []);

  useEffect(() => {
    const deleteRoom = (room) => {
      dispatch({ type: "DELETE_ROOM", payload: room });
    };

    const newRoom = (room) => {
      dispatch({ type: "NEW_ROOM", payload: room.room });
    };

    socket.on("deleteRoom", deleteRoom);
    socket.on("newRoom", newRoom);

    return () => {
      socket.off("deleteRoom", deleteRoom);
      socket.off("newRoom", newRoom);
    };
  }, [socket]);

  console.log("RoomContext state: ", state);
  return (
    <RoomContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};
