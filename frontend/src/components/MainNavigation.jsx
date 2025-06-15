import { Form, NavLink, useLoaderData } from 'react-router-dom';

function MainNavigation() {
    const token = useLoaderData('root');

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Bloggie</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item mb-5">
                                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} aria-current="page" to=""> Home </NavLink>
                            </li>
                            {token && <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="admin"> Admin </NavLink>
                            </li>}
                            {!token && <li className="nav-item">
                                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} to="/auth?mode=login">Authentication</NavLink>
                            </li>}
                            {token && <li>
                                <Form action='/logout' method='post'>
                                    <button>Logout</button>
                                </Form>
                            </li>}
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default MainNavigation;
