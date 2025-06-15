import { Link, useSubmit, useRouteLoaderData } from "react-router-dom"

function UsersList({ users }) {
    const token = useRouteLoaderData('root');

    const submit = useSubmit();

    function deleteHandler(id) {
        const proceed = window.confirm('Are you sure?');

        if (proceed) {
            submit(null, { method: 'delete', action: `/admin/users/${id}` });
        }
    }

    return (
        <div className="container">
            <h1>All registered users </h1>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Email</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td><Link to={`${user.id}/edit`}>Edit</Link></td>
                                <td><button onClick={() => deleteHandler(user.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UsersList


