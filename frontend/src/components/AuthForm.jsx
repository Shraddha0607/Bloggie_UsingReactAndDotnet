import { Link, useSearchParams, Form, redirect } from 'react-router-dom';

function AuthForm() {
    const [searchParams] = useSearchParams();
    const isLogin = searchParams.get('mode') === 'login';


    return (
        <div className='container'>
            <Form method='post' >
                <h1>{isLogin ? 'Log in' : 'Create a new User'}</h1>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                    <div className="col-sm-10">
                        <input type="email" className="form-control" id="email" name="email" required />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                    <div className="col-sm-10">
                        <input type="password" className="form-control" id="password" name="password" required />
                    </div>
                </div>
                {!isLogin && <div className="row mb-3">
                    <label htmlFor="roles" className="col-sm-2 col-form-label">Role</label>
                    <div className="col-sm-10">
                        <input type="tet" className="form-control" id="roles" name="roles" required />
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
        username: data.get('email'),
        password: data.get('password')
    };

    if (mode === 'signup') {
        authData.role = data.get('roles');

        await signup(authData);
    }
    else {
        await login(authData);
    }

    return redirect('/');

}


async function signup(authData) {
    const response = await fetch('http://localhost:5243/Auth/Register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
    });

    if (response.status === 422 || response.status === 401) {
        return response;
    }

    if (!response.ok) {
        throw new Response({ message: 'Could not add user!' }, { status: 500 });
    }

}

async function login(authData) {
    const response = await fetch('http://localhost:5243/Auth/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(authData)
    });

    if (response.status === 422 || response.status === 401) {
        return response;
    }

    if (!response.ok) {
        throw new Response({ message: 'Could not authenticate user.' }, { status: 500 });
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