import axios from "axios";
import { useEffect, useState, createContext, useReducer } from "react";

export const RoomContext = createContext();

export const RoomReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROOMS":
      return {
        room: action.payload,
      };
    case "CREATE_ROOM":
        return {
            room: [action.payload.room, ...state.room],
          };
    default:
      return state;
  }
};
export const RoomContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RoomReducer, {
    room: null,
  });

  useEffect(()=>{

    const fetchRoom = async()=>{
        try{
            const response = await axios.get("/api/room");

            if(response.status === 200){
                dispatch({type: "SET_ROOMS",payload: response.data})
            }
        }catch(err){
            console.log(err)
        }
    }
    fetchRoom();
  },[])

  console.log("RoomContext state: ", state);
  return (
    <RoomContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};
