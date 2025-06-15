import { Await, redirect, useRouteLoaderData } from "react-router-dom";
import UsersList from "./UsersList";
import { Suspense } from "react";
import { getAuthToken } from "../../util/auth";

function UsersPage() {
    const { users } = useRouteLoaderData('users');

    return (
        <Suspense fallback={<p>Loading...</p>} >
            <Await resolve={users}>
                {(loadedUsers) => <UsersList users={loadedUsers} />}
            </Await>
        </Suspense>
    )
}

export default UsersPage;

export async function loadUsers() {
    const response = await fetch('http://localhost:8080/users');

    if (!response.ok) {
        throw new Response({
            message: 'Could not fetch users.'
        },
            {
                status: 500,
            });
    }
    else {
        const resData = await response.json();
        return { users: resData.users };
    }
}


export async function action({ params, request }) {

    const userId = params.userId;
    const token = getAuthToken();

    const response = await fetch('http://localhost:8080/users/' + userId, {
        method: request.method,
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });

    if (!response.ok) {
        throw new Response(
            { message: 'Could not delete user.' },
            { status: 500 }
        );
    }

    return redirect('/admin/users');
}