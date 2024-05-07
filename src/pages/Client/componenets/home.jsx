import { Link } from "react-router-dom"

export const Home = ()=>{
    return(
        <div className="text-3xl">
            Home Page

            <div className="flex flex-row">

                <li>
                    <Link to='/admin'>


                    Admin
                    </Link>
                </li>
            </div>
        </div>
    )
}