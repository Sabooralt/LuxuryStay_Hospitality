import { TopBar } from "../components/TopBar"
import { AddTask } from "../components/task/AddTask"

export const Tasks = ()=>{
    return(
        <div>
            <TopBar  children={"Tasks"}/>

            <AddTask/>
        </div>
    )
}