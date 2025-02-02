import { HeaderBeranda } from "../../../modal/ModalHeaders"

const Beranda = () => {
    return(
        <>
            <HeaderBeranda/>
            <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                <div className="name-card d-flex p-3">
                    <div className=" h-100" style={{backgroundColor: '#E9F1FA', borderRadius: '5px', width: '10rem'}}></div>
                    <div className="h-100 p-0 m-0">
                        <div className="d-flex p-0 m-0">
                            <div className="p-0 m-0">
                                <ul className="list-unstyled p-0 m-0">
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>Nama</li>
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>NIM</li>
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>Email</li>
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>Fakultas</li>
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>Universitas</li>
                                </ul>
                            </div>
                            <div className=" p-0 m-0">
                            <ul className="list-unstyled p-0 m-0">
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>: T Magdalena</li>
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>: 2011033</li>
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>: tmagdalena1409@gmail.com</li>
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>: Teknik Komputer</li>
                                    <li style={{marginLeft: '0.5rem', color: '#E9F1FA'}}>: Sains Cut Nyak Dien</li>
                                </ul>
                            </div>
                        </div>
                    <div className="p-2 m-0 flex-grow-1" style={{height:'5.5rem',width:'23rem',borderRadius: '1px solid #E9F1FA'}}>
                        <p className="note-card">Project akhir skripsi, sebagai syarat kelulusan sarjana S1, dengan judul skripsi Rancang Bangun Aplikasi Helpdesk Berbasis Web Menggunakan Framework Node.Js dan Bootstrap</p>
                    </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}

export default Beranda