import AdminNavigation from './AdminNavigation'
import { Outlet } from 'react-router-dom'

function AdminLayout() {

  return (
    <>
      <AdminNavigation />
      <div>
        <Outlet />
      </div>
    </>
  )
}

export default AdminLayout
