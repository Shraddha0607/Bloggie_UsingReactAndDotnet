import { NavLink } from "react-router-dom"

function AdminNavigation() {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item mb-5">
                            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} aria-current="page" to="tags/newTag">Add Tag</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="tags">Show All Tag</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="posts/newPost">Add Blog Post</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="posts">Show All Blog Post</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'} to="users">Show All User</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default AdminNavigation
