export default function ModalHeaders({ title }) {
    return(
        <div className="w-100 d-flex justify-content-between align-items-center" style={{height:'5rem', padding:'0 1rem', backgroundColor:'#00ABE4', borderLeft:'1px solid #E9F1FA', borderRadius:'5px', borderBottom: '2px solid #E9F1FA'}}>
            <h1 style={{color:'#E9F1FA'}}>{title}</h1>
            <div className="h-100 d-flex align-items-center justify-content-center p-2">
                <div className="m-0 p-0 h-100" style={{width:'4rem',backgroundColor: '#E9F1FA', borderRadius:'50%'}}></div>
            </div>
        </div>
    )
}

const HeaderBeranda = () => <ModalHeaders title='Beranda'/>
const HeaderPengaduan = () => <ModalHeaders title='Pengaduan'/>
const HeaderDashboard = () => <ModalHeaders title='Dashboard'/>
const HeaderStatusTiket = () => <ModalHeaders title='Status Tiket'/>
const HeaderStatistikTiket = () => <ModalHeaders title='Statistik Tiket'/>
const HeaderInformasiTiket = () => <ModalHeaders title='Informasi Tiket'/>
const HeaderStatusPengaduan = () => <ModalHeaders title='Status Pengaduan'/>
const HeaderInformasiPengaduan = () => <ModalHeaders title='Informasi Pengaduan'/>
const HeaderStatistikPengaduan = () => <ModalHeaders title='Statistik Pengaduan'/>



export { 
    HeaderBeranda, 
    HeaderPengaduan, 
    HeaderDashboard, 
    HeaderStatusTiket, 
    HeaderStatistikTiket, 
    HeaderInformasiTiket, 
    HeaderStatusPengaduan,
    HeaderInformasiPengaduan,
    HeaderStatistikPengaduan
 }