import { useState } from "react";
import { useActionData, Form, useRouteLoaderData, redirect, useNavigation, useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getAuthToken } from "../../../util/auth";
import { useEffect } from "react";

function PostForm({ method, post }) {
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
    const token = useRouteLoaderData('root');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (method === 'patch') {
            setContent(post.content)
             setGeneratedImageUrl(post.imageUrl);
        };

    }, [post, method]);

   


    const data = useActionData();
    const navigation = useNavigation();
    const navigate = useNavigate();

    const isSubmitting = navigation.state === 'submitting';

    function cancelHandler() {
        navigate('..');
    }

    async function fileHandler(event) {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = async (event) => {
            // console.log(event.target.result);
            const base64 = reader.result.split(',')[1];

            const imageData = {
                fileName: file.name,
                fileContent: base64,
            }

            let url = 'http://localhost:8080/cdn/urlGenerate';

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(imageData)
                });


                if (!response.ok) {
                    throw error('File not uploaded properly.');
                }

                const resData = await response.json();
                setGeneratedImageUrl(resData.url);
            }
            catch (error) {
                console.log(error);
            }
        }

        reader.readAsDataURL(file);

        // const formData = new FormData();
        // formData.append('MyFile1', file);
        // formData.append('MyFile2', file);

        //  let url = 'http://localhost:8080/cdn/upload';

        //     try {
        //         const response = await fetch(url, {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': 'Bearer ' + token
        //             },
        //             body: formData
        //         });


        //         if (!response.ok) {
        //             throw error('File not uploaded properly.');
        //         }

        //         const resData = await response.json();
        //         console.log(resData);
        //         // setGeneratedImageUrl(resData.url);
        //     }
        //     catch (error) {
        //         console.log(error);
        //     }



    }

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            ['image', 'code-block'],
        ],
    };


    return (
        <div className='container py-3'>
            <>
                <Form method={method} >
                    <h1>{method === 'patch' ? 'Edit Post' : 'Add New Post'}</h1>
                    {data && data.errors && (
                        <ul>
                            {Object.values(data.errors).map((err) => (
                                <li key={err}>{err}</li>
                            ))}
                        </ul>
                    )}
                    <div className="row mb-3">
                        <label htmlFor="heading" className="col-sm-2 col-form-label">Heading</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="heading" name="heading" required
                                defaultValue={post ? post.heading : ''} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="title" name="title" required
                                defaultValue={post ? post.title : ''} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="content" className="col-sm-2 col-form-label">Content</label>
                        <div className="col-sm-10">
                            <ReactQuill theme="snow" modules={modules} value={content} onChange={setContent} />
                            <input type="hidden" name="content" value={content} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="shortDescription" className="col-sm-2 col-form-label">Short Description</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="shortDescription" name="shortDescription" required
                                defaultValue={post ? post.shortDescription : ''} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="content" className="col-sm-2 col-form-label">Featured Image Upload</label>
                        <div className="col-sm-10">
                            <input type="file" className="form-control" id="content" name="content" 
                            required={!generatedImageUrl}
                                defaultValue=''
                                onChange={fileHandler} />
                            {method === 'patch' && post && <div>
                                <img src={generatedImageUrl} alt='post-image' style={{ height: '200px', width: '230px' }} />
                            </div>}
                        </div>

                    </div>
                    <div className="row mb-3">
                        <label htmlFor="imageUrl" className="col-sm-2 col-form-label">Featured Image URL</label>
                        <div className="col-sm-10">
                            <input type="url" className="form-control" id="imageUrl" name="imageUrl" required readOnly
                                defaultValue={generatedImageUrl} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="urlHandler" className="col-sm-2 col-form-label">URL Handler</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="urlHandler" name="urlHandler" required 
                                defaultValue={post ? post.urlHandler : ''} />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="publishedDate" className="col-sm-2 col-form-label">Published Date</label>
                        <div className="col-sm-10">
                            <input type="date" className="form-control" id="publishedDate" name="publishedDate" required
                                defaultValue={post ? post.publishedDate : new Date().toISOString().split('T')[0]} readOnly />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="author" className="col-sm-2 col-form-label">Author</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="author" name="author" required
                                defaultValue={post ? post.author : ''} />
                        </div>
                    </div>
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="isVisible" name="isVisible" defaultChecked={post ? post.isVisible : false} />
                        <label className="form-check-label" htmlFor="isVisible" >Is Visible </label>
                    </div>

                    <div className='d-flex justify-content-start'>
                        <button type="button" onClick={cancelHandler} disabled={isSubmitting} className="mx-2">
                            Cancel
                        </button>
                        <button className="btn btn-dark" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting' : 'Submit'}</button>
                    </div>
                </Form>
            </>
        </div>
    )
}

export default PostForm;

export async function loader({ request, params }) {
    const id = params.postId;
    const response = await fetch('http://localhost:8080/posts/' + id);

    if (!response.ok) {
        throw new Response({
            message: 'Could not fetch post data',
        },
            { status: 500 }
        )
    } else {
        const resData = await response.json();
        console.log("post data ", resData);
        return {
            post: resData.post
        };
    }
}

export async function action({ request, params }) {
    const method = request.method;
    const data = await request.formData();

    const PostData = {
        heading: data.get('heading'),
        title: data.get('title'),
        content: data.get('content'),
        shortDescription: data.get('shortDescription'),
        imageUrl: data.get('imageUrl'),
        urlHandler: data.get('urlHandler'),
        publishedDate: data.get('publishedDate'),
        author: data.get('author'),
        isVisible: data.get('isVisible'),
        tags: [],
        likes: 0,
        dislikes: 0,
        comments: []

    };

    console.log("post data is ", PostData);

    let url = 'http://localhost:8080/posts';

    if (method === 'PATCH') {
        console.log("inside patch");
        const postId = params.postId;
        url = 'http://localhost:8080/posts/' + postId;
    }

    const token = getAuthToken();

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(PostData)
    });

    if (response.status === 422 || response.status === 401) {
        return response;
    }

    if (!response.ok) {
        throw new Response({ message: 'Could not add post.' }, { status: 500 });
    }

    const resData = await response.json();

    return redirect('/admin/posts');

}