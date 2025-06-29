import { Form, useActionData, useNavigate, useNavigation, useRouteLoaderData, redirect } from "react-router-dom";
import { checkAuthLoader, getAuthToken } from "../../../util/auth";
import { useState } from "react";
import { API_URL } from "../../../util/config";

function EditUserPage() {
    const { user } = useRouteLoaderData('user-details');
    const data = useActionData();
    const navigate = useNavigate();
    const navigation = useNavigation();

    const [roles, setRoles] = useState(user.roles);

    const isSubmitting = navigation.state === 'submitting';

    function cancelHandler() {
        navigate('/admin/users');
    }

    const handleRoleChange = (e) => {
        console.log("event is ", e);
        const {value, checked} = e.target;

        console.log("value is, ", value, " ");

        if (checked) {
            setRoles ((prev) => 
                [...prev, value]
            );
        }
        else {
            setRoles ((prev) => prev.filter((role) => role !== value));
        }
    };

    return (
        <div className="container">

            <Form method='post' >
                <h1>Update User</h1>
                {data && data.errors && (
                    <ul>
                        {Object.values(data.error).map((err) => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                )}
                <input type="hidden" name="id" value={user.id} />
                <div className="row mb-3">
                    <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                    <div className="col-sm-10">
                        <input type="username" className="form-control" id="username" name="username" required readOnly  defaultValue={user ? user.userName : ''} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" id="email" name="email" required defaultValue={user ? user.email : ''} readOnly />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="password" name="password" required defaultValue={user ? user.password : ''} />
                    </div>
                </div>
                <div className="row mb-3 ">
                    <label htmlFor="roles" className="col-sm-2 col-form-label">Roles</label>
                    <input type="hidden" name="selectedRoles" value={JSON.stringify(roles)} />
                    <div className="">
                        <div class="form-check">
                            <input className="form-check-input" type="checkbox" value="Admin" checked={roles.includes('Admin')} id="role-admin"  onChange={handleRoleChange}/>
                            <label className="form-check-label" for="flexCheckDefault">
                                Admin
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" value="User"  checked={roles.includes('User')} id="role-user" onChange={handleRoleChange}/>
                            <label className="form-check-label" for="flexCheckDefault">
                                User
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <button className="btn btn-primary" type='button' onClick={cancelHandler} disabled={isSubmitting} > Cancel </button>
                    <button className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Updating...' : 'Update'} </button>
                </div>
            </Form>

        </div>
    )
}

export default EditUserPage;


async function loadUser(id) {
    const response = await fetch(`${API_URL}/User?id=${id}`);

    if (!response.ok) {
        throw new Response(
            { message: 'Could not fetch details for selected user.' },
            { status: 500 }
        );
    }
    else {
        const resData = await response.json();
        return resData;
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
        id : data.get('id'),
        password: data.get('password'),
        userName: data.get('username'),
        email: data.get('email'),
        roles: JSON.parse(data.get('selectedRoles'))
    };

    const token = getAuthToken();
    const response = await fetch(`${API_URL}/User?id=${userId}`, {
        method: 'PUT',
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

