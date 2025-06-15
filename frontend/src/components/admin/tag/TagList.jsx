import { Link, useSubmit, useRouteLoaderData } from "react-router-dom"

function TagList({ tags }) {
    const token = useRouteLoaderData('root');

    const submit = useSubmit();

    function deleteHandler(id) {
        const proceed = window.confirm('Are you sure?');

        if (proceed) {
            submit(null, { method: 'delete', action: `/admin/tags/${id}` });
        }
    }

    return (
        <div className="container">
            <h1>All Tags </h1>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Display Name</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.map((tag) => (
                            <tr key={tag.id}>
                                <td>{tag.id}</td>
                                <td>{tag.name}</td>
                                <td>{tag.displayName}</td>
                                <td><Link to={`${tag.id}/edit`}>Edit</Link></td>
                                <td><button onClick={() => deleteHandler(tag.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TagList


