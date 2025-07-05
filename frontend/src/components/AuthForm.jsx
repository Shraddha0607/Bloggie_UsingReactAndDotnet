import { useState, useRef } from 'react';
import { Link, useSearchParams, Form, redirect, useActionData, useSubmit } from 'react-router-dom';
import { API_URL } from '../util/config';

function AuthForm() {
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get('mode') === 'login';
    const [roles, setRoles] = useState([]);
    const actionData = useActionData();
    const [formErrors, setFormErrors] = useState({});
    const formRef = useRef();
    const submit = useSubmit();

    const handleRoleChange = (e) => {
        console.log("event is ", e);
        const { value, checked } = e.target;

        console.log("value is, ", value, " ");

        if (checked) {
            setRoles((prev) =>
                [...prev, value]
            );
        }
        else {
            setRoles((prev) => prev.filter((role) => role !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = formRef.current;
        const email = form.email.value.trim();
        const password = form.password.value.trim();
        const username = form.username?.value.trim();

        const newErrors = {};

        if (!email) newErrors.email = 'Email is required.';
        if (!password) newErrors.password = 'Password is required.';
        if (!isLogin) {
            if (!username) newErrors.username = 'Username is required.';
            if (roles.length === 0) newErrors.roles = 'Please select at least one role.'
        }

        setFormErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            submit(form);
        }
    }

    return (
        <>
            {actionData?.error && (
                <div className='alert alert-danger mx-4 text-center'>
                    ⚠️ {actionData.error}
                </div>
            )}
            <div className='container'>
                <Form method='post' ref={formRef} onSubmit={handleSubmit} >
                    <h1>{isLogin ? 'Log in' : 'Create a new User'}</h1>
                    {!isLogin && <div className="row mb-3">
                        <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="username" name="username" />
                            {formErrors.username && <div className='text-danger'>{formErrors.username}</div>}
                        </div>
                    </div>}
                    <div className="row mb-3">
                        <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input type="email" className="form-control" id="email" name="email" />
                            {formErrors.email && <div className="text-danger">{formErrors.email}</div>}
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                        <div className="col-sm-10">
                            <input type="password" className="form-control" id="password" name="password" />
                            {formErrors.password && <div className='text-danger'>{formErrors.password} </div>}
                        </div>
                    </div>
                    {!isLogin && <div className="row mb-3 ">
                        <label htmlFor="roles" className="col-sm-2 col-form-label">Roles</label>
                        <input type="hidden" name="selectedRoles" value={JSON.stringify(roles)} />
                        {formErrors.roles && <div className='text-danger'> {formErrors.roles} </div>}
                        <div className="">
                            <div class="form-check">
                                <input className="form-check-input" type="checkbox" value="Admin" checked={roles.includes('Admin')} id="role-admin" onChange={handleRoleChange} />
                                <label className="form-check-label" for="flexCheckDefault">
                                    Admin
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="User" checked={roles.includes('User')} id="role-user" onChange={handleRoleChange} />
                                <label className="form-check-label" for="flexCheckDefault">
                                    User
                                </label>
                            </div>
                        </div>
                    </div>}
                    <div>
                        <Link to={`?mode=${isLogin ? 'signup' : 'login'}`}>
                            {isLogin ? 'Create new user' : 'Login'}
                        </Link>

                        <button className="btn btn-dark mx-2">Save</button>

                    </div>
                </Form>
            </div>
        </>

    )
}

export default AuthForm;

export async function action({ request }) {
    const searchParams = new URL(request.url).searchParams;
    const mode = searchParams.get('mode') || 'login';

    if (mode != 'login' && mode != 'signup') {
        throw new Response({ message: 'Unsupported mode.' }, { status: 422 });
    }

    const data = await request.formData();
    const authData = {
        email: data.get('email'),
        password: data.get('password')
    };

    if (mode === 'signup') {
        authData.roles = JSON.parse(data.get('selectedRoles'));
        authData.username = data.get('username');

        const result = await signup(authData);
        if (result?.error) return result;
    }
    else {
        const result = await login(authData);
        if (result?.error) return result;
    }

    return redirect('/');

}


async function signup(authData) {
    try {
        const response = await fetch(`${API_URL}/Auth/Register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Failed to register user.' };
        }
    }
    catch (err) {
        return { error: 'Something went wrong during signup. Please try again.' }
    }

}

async function login(authData) {
    try {

        const response = await fetch(`${API_URL}/Auth/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(authData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData.message || 'Login failed. Check your credentails.' }
        }

        const resData = await response.json();
        const token = resData.jwtToken;
        const userId = resData.id;

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1);
        localStorage.setItem('expiration', expiration.toISOString());
    }
    catch (err) {
        return { error: 'Something went wrong during login. Please try again.' };
    }
}