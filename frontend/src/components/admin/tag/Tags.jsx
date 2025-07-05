import { Await, redirect, useRouteLoaderData, useActionData } from "react-router-dom";
import TagList from "./TagList";
import { Suspense } from "react";
import { getAuthToken } from "../../../util/auth";
import { API_URL } from "../../../util/config";

function TagsPage() {
    const { tags } = useRouteLoaderData('tags');
    const actionData = useActionData();
    console.log(actionData?.error, " is the errr");

    return (
        <Suspense fallback={<p>Loading...</p>} >
            {actionData?.error && <div className='alert alert-danger mx-4 text-center'>
                {actionData.error}
            </div>}
            <Await resolve={tags}>
                {(loadedTags) => <TagList tags={loadedTags} />}
            </Await>
        </Suspense>
    )
}

export default TagsPage;

export async function loader() {
    const response = await fetch(`${API_URL}/Tag/all`);

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
        return { tags: resData };
    }
}


export async function action({ params, request }) {

    const tagId = params.tagId;
    const token = getAuthToken().token;

    try {
        const response = await fetch(`${API_URL}/Tag/id/${tagId}`, {
            method: request.method,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return { error: errorText.message || "Could not delete tag."};
        }
        alert("Tag deleted successfully with id ", tagId);
    }
    catch (error) {
        return { error: "Something went wrong." }
    }


    return redirect('/admin/tags');
}