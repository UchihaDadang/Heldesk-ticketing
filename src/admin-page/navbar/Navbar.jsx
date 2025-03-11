import { useState } from "react";
import NavbarItems from "./NavbarItems";
import NavbarList from "./navbar-list/NavbarList";
import NavbarLogo from "./navbar-list/NavbarLogo";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [isMinimize, setMinimize] = useState(false);
    const navigate = useNavigate();

    const handleMinimize = () => {
        setMinimize(!isMinimize)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login/admin')
        Swal.fire({
            title: "Berhasil Logout!",
            timer: 1000,
            showConfirmButton: false,
            icon: "success"
        });        
    }

    return(
        <div className={`navbar h-100 p-0 m-0 d-flex flex-column position-relative ${isMinimize ? 'minimize-bar' : 'navbar'}`}>
            <div className={`w-100 p-3 m-0 text-center ${isMinimize ? 'title' : 'title-full'}`}>{isMinimize ? '' : <h1 style={{color: '#E9F1FA'}}>helpdesk</h1>}</div>
                <div className={`btn-full position-absolute ${isMinimize ? 'btn-minimize' : 'btn-full'}`} onClick={handleMinimize}>
                    {isMinimize ? <i className="bi-minimize bi-arrow-right-square-fill"></i> : <i className="bi-full bi-arrow-left-square-fill"></i>}
                </div>
            <NavbarItems>
                {isMinimize ? <NavbarLogo/>:<NavbarList/>}
            </NavbarItems>
            <div className="log-out w-100 p-3 m-0 "style={{height: '5rem', borderTop: '2px solid #E9F1FA'}}>
                {isMinimize ? <i className="bi-logout bi-door-open-fill fs-3"></i> : <button onClick={handleLogout} type="button" className="btn-logout w-100 h-100"><i className="bi-full-logout bi-door-open-fill fs-5"></i>LOG OUT</button>} 
            </div>
        </div>
    )
}

export default Navbar