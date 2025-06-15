import { Await, redirect, useRouteLoaderData } from "react-router-dom";
import TagList from "./TagList";
import { Suspense } from "react";
import { getAuthToken } from "../../../util/auth";

function TagsPage() {
    const { tags } = useRouteLoaderData('tags');

    return (
        <Suspense fallback={<p>Loading...</p>} >
            <Await resolve={tags}>
                {(loadedTags) => <TagList tags={loadedTags} />}
            </Await>
        </Suspense>
    )
}

export default TagsPage;

export async function loader() {
    const response = await fetch('http://localhost:8080/tags');

    if (!response.ok) {
        throw new Response({
            message: 'Could not fetch tags.'
        },
            {
                status: 500,
            });
    }
    else {
        const resData = await response.json();
        return { tags: resData.tags };
    }
}


export async function action({ params, request }) {

    const tagId = params.tagId;
    const token = getAuthToken();

    const response = await fetch('http://localhost:8080/tags/' + tagId, {
        method: request.method,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        throw new Response(
            { message: 'Could not delete tag.' },
            { status: 500 }
        );
    }

    return redirect('/admin/tags');
}