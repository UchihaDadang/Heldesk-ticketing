import Beranda from './admin-page/content/content-items/Beranda'
import Dashboard from './admin-page/content/content-items/Dashboard'
import AdminPage from './admin-page/AdminPage'
import './App.css'
import LoginAdmin from './login/LoginAdmin'
import LoginUser from './login/LoginUser'
import NotFound from './protect-route/NotFound'
import ProtectedRoute from './protect-route/ProtectedRoute'
import UserPage from './user-page/UserPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Pengaduan from './admin-page/content/content-items/Pengaduan'
import InformasiPengaduan from './admin-page/content/content-items/InformasiPengaduan'
import StatusPengaduan from './admin-page/content/content-items/StatusPengaduan'
import StatistikPengaduan from './admin-page/content/content-items/StatistikPengaduan'
import InformaiTiket from './admin-page/content/content-items/InformasiTiket'
import StatusTiket from './admin-page/content/content-items/StatusTiket'
import StatistikTiket from './admin-page/content/content-items/StatistikTiket'
import { GoogleOAuthProvider } from '@react-oauth/google'

const App = () => {
  return (
    <GoogleOAuthProvider 
    clientId='1055181885424-f2iha2701nfhb22hugvc3pcfle4kvd7r.apps.googleusercontent.com'
    onScriptLoadError={() => console.log('Failed to load Google script')}
    onScriptLoadSuccess={() => console.log('Google script loaded successfully')}>
      <Router>
        <Routes>
          <Route path='/' element={<LoginUser/>}/>
          <Route path='/login/admin' element={<LoginAdmin/>}/>
          <Route element={<ProtectedRoute/>}>
            <Route path='/admin' element={<AdminPage/>}>
              <Route index element={<Beranda to="beranda" replace />} />
              <Route path="beranda" element={<Beranda />}/>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="pengaduan" element={<Pengaduan />} />
              <Route path="informasi-pengaduan" element={<InformasiPengaduan />}/>
              <Route path="status-pengaduan" element={<StatusPengaduan />} />
              <Route path="statistik-pengaduan" element={<StatistikPengaduan />} />
              <Route path="informasi-tiket" element={<InformaiTiket />} />
              <Route path="status-tiket" element={<StatusTiket />} />
              <Route path="statistik-tiket" element={<StatistikTiket />} />
            </Route>
          </Route>
          <Route path='/user/beranda' element={<UserPage/>}/>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App