import { NavLink } from "react-router-dom"

export default function NavbarLogo() {
    const itemsNavbar = [
        {
            title: 'Dashboard',
            items: [
                {to: 'beranda' ,icon: "bi bi-house-fill"},
                {to: 'dashboard', icon: 'bi bi-postcard-fill'},
            ],
        },
        {
            title: 'Pengaduan',
            items: [
                {to: 'pengaduan', icon: 'bi bi-question-square-fill'},
                {to: 'status-pengaduan', icon: 'bi bi-question-square-fill'},
                {to: 'informasi-pengaduan', icon: 'bi bi-database-fill-exclamation'},
                {to: 'statistik-pengaduan', icon: 'bi bi-bar-chart-fill'},
            ],
        },
        {
            title: 'Tiketing',
            items: [
                {to: 'status-tiket', icon: 'bi bi-ticket-fill'},
                {to: 'informasi-tiket', icon: 'bi bi-stickies-fill'},
                {to: 'statistik-tiket', icon: 'bi bi-file-earmark-bar-graph-fill'},
            ],
        },
        {
            title: 'pendapat',
            items: [
                {to: 'kritik', icon: 'bi bi-ticket-fill'},
                {to: 'saran', icon: 'bi bi-stickies-fill'},
                {to: 'komentar', icon: 'bi bi-file-earmark-bar-graph-fill'},
            ],
        },
    ]
    return(
        <div className="p-0 m-0" style={{width : '5%'}}>
            {itemsNavbar.map((list, index) => (
                <div className="navbar-list-logo p-0 m-0 w-100 d-flex justify-content-center align-items-center"key={index}>
                    <ul className="p-0 m-0" style={{width: '100%'}}>
                        {list.items.map((item, i) => (
                            <li key={i}>
                                <NavLink
                                 to={item.to} 
                                 className={({isActive}) => isActive ? 'minimize-list-logo-active' : 'minimize-list-logo'}>
                                    <i className={`minimize-icon ${item.icon}`} style={{ color: '#E9F1FA'}}></i>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    )
}