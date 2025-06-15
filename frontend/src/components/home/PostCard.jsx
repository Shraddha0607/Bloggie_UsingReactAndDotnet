import { Link } from "react-router-dom"
function PostCard({ post }) {

    return (
        <div className="card shadow p-3 mb-5 bg-body-tertiary rounded" >
            <img src={post.imageUrl} className="card-img-top" alt="..." />
            <div className="card-body">
                <h5 className="card-title">{post.heading}</h5>
                <div>
                    <h6 className="card-subtitle mb-2 text-body-secondary">Author: {post.author}</h6>
                    <h6 className="card-subtitle mb-2 text-body-secondary">Published Date: {post.publishedDate} </h6>
                </div>
                <div className="mt-4 mb-3">
                    {post.tags && post.tags.map((tag) => (
                        <span key={tag.id}><button>{tag}</button></span>
                    ))}
                </div>
                <p className="card-text">{post.shortDescription}</p>
                <Link to={`post/${post.urlHandler}`} className="btn btn-dark">Read More</Link>
            </div>
        </div>
    )
}

export default PostCard
