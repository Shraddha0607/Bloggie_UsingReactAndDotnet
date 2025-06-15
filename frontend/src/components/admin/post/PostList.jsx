import { Link, useSubmit, useRouteLoaderData } from "react-router-dom"

function PostList({ posts }) {
    const token = useRouteLoaderData('root');

    const submit = useSubmit();

    function deleteHandler(id) {
        const proceed = window.confirm('Are you sure?');

        if (proceed) {
            submit(null, { method: 'delete', action: `/admin/posts/${id}` });
        }
    }

    return (
        <div className="container">
            <h1>All Posts </h1>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Title</th>
                            <th scope="col">Publish Date</th>
                            <th scope="col">Tags</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => {
                            return (
                                <tr key={post.id}>
                                    <td>{post.id}</td>
                                    <td>{post.title}</td>
                                    <td>{post.publishedDate}</td>
                                    <td>
                                        <ul>
                                            {post.tags.map((tag) => (
                                                <button key={tag}><span >{tag}</span></button>
                                    ))}
                                        </ul>

                                    </td>
                                    <td><Link to={`${post.id}/edit`}>Edit</Link></td>
                                    <td><button onClick={() => deleteHandler(post.id)}>Delete</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PostList


