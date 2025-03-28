import { NavLink } from "react-router-dom";

export default function NavbarList({ isMinimize }) {

    const itemsNavbar = [
        {
            title: 'Dashboard',
            items: [
                {to: 'beranda' ,icon: "bi bi-house-fill", label: 'Beranda'},
                {to: 'dashboard', icon: 'bi bi-postcard-fill', label: 'About'},
            ],
        },
        {
            title: 'Pengaduan',
            items: [
                {to: 'status-pengaduan', icon: 'bi bi-question-square-fill', label: 'Status Pengaduan'},
                {
                    icon: 'bi bi-database-fill-exclamation ',
                    label: 'Detil Pengaduan ▼',
                    subItems: [
                        { to: 'detail-pengaduan-tindak-kejahatan', label: 'Tindak Kejahatan' },
                        { to: 'detail-pengaduan-kehilangan', label: 'Khilangan' },
                        { to: 'detail-pengaduan-kdrt', label: 'KDRT' },
                        { to: 'detail-pengaduan-bulyying', label: 'Bulyying' },
                        { to: 'detail-pengaduan-tindakan-mencurigakan', label: 'Tindakan Mencurigakan' },
                    ],
                },
                {to: 'statistik-pengaduan', icon: 'bi bi-bar-chart-fill', label: 'Statistik Pengaduan' },
            ],
        },
        {
            title: 'Tiketing',
            items: [
                {to: 'status-tiket', icon: 'bi bi-ticket-fill', label: 'Status Tiket'},
            ],
        },
        {
            title: 'Pendapat',
            items: [
                {to: 'kritik', icon: 'bi bi-ticket-fill', label: 'Kritik'},
                {to: 'saran', icon: 'bi bi-stickies-fill', label: 'Saran'},
                {to: 'komentar', icon: 'bi bi-file-earmark-bar-graph-fill', label: 'Komentar'},
            ],
        },
    ];

    return (
        <div className="content w-100 p-0 m-0">
            {itemsNavbar.map((list, index) => (
                <div className="navbar-list-items p-1 m-0" style={{ borderBottom: '2px solid #E9F1FA' }} key={index}>
                    <p className="kategori m-0" style={{ color: '#E9F1FA', padding: '0 0 0 1rem' }}>
                        {list.title}
                    </p>
                    <ul className="p-0 m-0 w-100">
                        {list.items.map((item, i) => (
                            <li key={i} className={item.subItems ? "has-submenu" : ""}>
                                <NavLink
                                        to={item.to}
                                        className={({ isActive }) => 
                                            item.label === "Detil Pengaduan ▼" 
                                                ? (isActive ? 'custom-list' : 'custom-list-active') 
                                                : (isActive ? 'list-active' : 'list')
                                        }
                                >
                                    <i className={item.icon} style={{ marginRight: '1rem', color: '#E9F1FA' }}></i>
                                    {item.label}
                                </NavLink>
                                {item.subItems && (
                                    <ul className="submenu">
                                        {item.subItems.map((subItem, j) => (
                                            <li key={j}>
                                                <NavLink
                                                    to={subItem.to}
                                                    className={({ isActive }) => isActive ? 'list-active' : 'list'}
                                                >
                                                    {subItem.label}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
