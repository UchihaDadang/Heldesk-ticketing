import Content from "./content/Content";
import Navbar from "./navbar/Navbar";
import { Outlet } from "react-router-dom";

const AdminPage = () => {
    return(
        <div className="admin-page d-flex m-0 p-0" style={{height: '100vh', width: '100vw', overflow: "hidden"}}>
            <Navbar/>
            <Content>
                <Outlet/>
            </Content>
        </div>
    )
}

export default AdminPage