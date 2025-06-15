import { Form, useActionData, useNavigate, useNavigation, useRouteLoaderData, redirect } from "react-router-dom";
import { checkAuthLoader, getAuthToken } from "../../util/auth";

function EditUserPage() {
    const {user} = useRouteLoaderData('user-details');
    const data = useActionData();
    const navigate = useNavigate();
    const navigation = useNavigation();

    const isSubmitting = navigation.state === 'submitting';

    function cancelHandler() {
        navigate('/admin/users');
    }

    return (
        <Form method='post' >
            <h1>Update User</h1>
            {data && data.errors && (
                <ul>
                    {Object.values(data.error).map((err) => (
                        <li key={err}>{err}</li>
                    ))}
                </ul>
            )}
            <div className="row mb-3">
                <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                    <input type="email" className="form-control" id="email" name="email" required defaultValue={user ? user.email : ''} />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                    <input type="password" className="form-control" id="password" name="password" required defaultValue={user ? user.password : ''} />
                </div>
            </div>
            <div>
                <button className="btn btn-primary" type='button' onClick={cancelHandler} disabled={isSubmitting} > Cancel </button>
                <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'} </button>
            </div>
        </Form>
    )
}

export default EditUserPage;


async function loadUser(id) {
    const response = await fetch('http://localhost:8080/users/' + id);

    if (!response.ok) {
        throw new Response(
            { message: 'Could not fetch details for selected user.' },
            { status: 500 }
        );
    }
    else {
        const resData = await response.json();
        return resData.user;
    }
}


export async function loader({ request, params }) {
    const id = params.userId;

    await checkAuthLoader({ request });
    const user = await loadUser(id);

    return {
        user: user,
    };
}

export async function action({ request, params }) {
    const userId = params.userId;


    const data = await request.formData();

    const userData = {
        email: data.get('email'),
        password: data.get('password'),
    };

    const token = getAuthToken();
    const response = await fetch('http://localhost:8080/users/' + userId, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(userData),
    });

    if (response.status === 422) {
        return response;
    }

    if (!response.ok) {
        throw new Response({ message: 'Could not update user.' }, { status: 500 });
    }

    alert('User updated successfully.');

    return redirect('/admin/users');
}

