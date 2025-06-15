import { Await, redirect, useRouteLoaderData } from "react-router-dom";
import PostList from "./PostList";
import { Suspense } from "react";
import { getAuthToken } from "../../../util/auth";

function PostsPage() {
    const { posts } = useRouteLoaderData('posts');

    return (
        <Suspense fallback={<p>Loading...</p>} >
            <Await resolve={posts}>
                {(loadedPosts) => <PostList posts={loadedPosts} />}
            </Await>
        </Suspense>
    )
}

export default PostsPage;

export async function loader() {
    const response = await fetch('http://localhost:8080/posts');

    if (!response.ok) {
        throw new Response({
            message: 'Could not fetch posts.'
        },
            {
                status: 500,
            });
    }
    else {
        const resData = await response.json();
        return { posts: resData.posts };
    }
}


export async function action({ params, request }) {

    const postId = params.postId;
    const token = getAuthToken();

    const response = await fetch('http://localhost:8080/posts/' + postId, {
        method: request.method,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        throw new Response(
            { message: 'Could not delete post.' },
            { status: 500 }
        );
    }

    return redirect('/admin/posts');
}