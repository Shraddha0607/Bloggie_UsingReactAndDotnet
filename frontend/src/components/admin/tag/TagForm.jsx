import { Link, useSearchParams, useNavigate, Form, redirect, useActionData, useNavigation } from 'react-router-dom';
import { getAuthToken } from '../../../util/auth';

function TagForm({ method, tag }) {
    const data = useActionData();
    const navigation = useNavigation();
    const navigate = useNavigate();

    const isSubmitting = navigation.state === 'submitting';

    function cancelHandler() {
        navigate('..');
    }

    return (
        <div className = 'container py-3'> 
            <Form method={method} >
                <h1>{method === 'patch' ? 'Edit Tag' : 'Add New Tag'}</h1>
                {data && data.errors && (
                    <ul>
                        {Object.values(data.errors).map((err) => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                )}
                <div className="row mb-3">
                    <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="name" name="name" required
                            defaultValue={tag ? tag.name : ''} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="displayName" className="col-sm-2 col-form-label">Display Name</label>
                    <div className="col-sm-10">
                        <input type="text" className="form-control" id="displayName" name="displayName" required
                            defaultValue={tag ? tag.displayName : ''} />
                    </div>
                </div>
                <div className='d-flex justify-content-start'>
                    <button type="button" onClick={cancelHandler} disabled={isSubmitting} className='mx-2'>
                        Cancel
                    </button>
                    <button className="btn btn-dark" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting' : 'Submit'}</button>
                </div>
            </Form>
        </div>
    )
}

export default TagForm;

export async function loader({ request, params }) {
    const id = params.tagId;
    const response = await fetch('http://localhost:8080/tags/' + id);

    if (!response.ok) {
        throw new Response(
            { message: 'Could not fetch details for selected tag.' },
            {
                status: 500,
            }
        );
    } else {
        const resData = await response.json();
        return {
            tag: resData.tag,
        };
    }
}

export async function action({ request, params }) {
    const method = request.method;
    const data = await request.formData();

    const tagData = {
        name: data.get('name'),
        displayName: data.get('displayName'),
    };

    let url = 'http://localhost:8080/tags';

    if (method === 'PATCH') {
        console.log("inside patch");
        const tagId = params.tagId;
        url = 'http://localhost:8080/tags/' + tagId;
    }

    const token = getAuthToken();

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(tagData)
    });

    if (response.status === 422 || response.status === 401) {
        return response;
    }

    if (!response.ok) {
        throw new Response({ message: 'Could not add tag.' }, { status: 500 });
    }

    const resData = await response.json();

    return redirect('/admin/tags');

}
