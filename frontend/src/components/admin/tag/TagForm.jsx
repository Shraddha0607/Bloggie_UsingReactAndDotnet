import { useActionData, useSearchParams, useNavigate, Form, redirect, useNavigation } from 'react-router-dom';
import { getAuthToken } from '../../../util/auth';
import { API_URL } from '../../../util/config';

function TagForm({ method, tag }) {

    console.log("method is ", method, " tag is ", tag);
    const data = useActionData();
    const navigation = useNavigation();
    const navigate = useNavigate();

    const isSubmitting = navigation.state === 'submitting';

    function cancelHandler() {
        navigate('..');
    }

    return (
        <>
            {data?.error && <div className='alert alert-danger mx-4 text-center '>
                ⚠️ {data.error}
            </div>}
            <div className='container py-3'>
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
        </>
    )
}

export default TagForm;

export async function loader({ request, params }) {
    const id = params.tagId;
    const response = await fetch(`${API_URL}/Tag/tagId/${id}`);

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
            tag: resData,
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

    let url = `${API_URL}/Tag`;

    if (method === 'PUT') {
        console.log("inside patch");
        const tagId = params.tagId;
        url = `${API_URL}/Tag/update?id=${tagId}`;
    }

    const token = getAuthToken().token;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(tagData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            return { error: errorData?.message || "Failed to add tag." }
        }

        const resData = await response.json();
    }
    catch (error) {
        return { error: 'Something went wrong while adding tag. Please try again.' }
    }



    return redirect('/admin/tags');

}
