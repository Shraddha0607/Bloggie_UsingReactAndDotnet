import { Form, NavLink, useLoaderData } from 'react-router-dom';

function MainNavigation() {
    const authData = useLoaderData('root');
    const token = authData?.token;
    const isAdmin = authData?.roles && authData.roles.includes("Admin");
    const userName = authData?.userName;

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary ">
                <div className="container-fluid bg-secondary">
                    <a className="navbar-brand" href="#">Bloggie</a>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item mb-5">
                                <NavLink className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} aria-current="page" to=""> Homee </NavLink>
                            </li>
                            {token && isAdmin  && <li className="nav-item">
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
                        <h4><span className="badge bg-secondary">{userName}</span></h4>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default MainNavigation;
