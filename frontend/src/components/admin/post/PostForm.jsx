import { useState } from "react";
import { useActionData, Form, redirect, useNavigation, useNavigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import { getAuthToken, getUser } from "../../../util/auth";
import { useEffect } from "react";
import { fileUploadUsingJson } from "../../../util/cdn";
import TextEditor from "../../TextEditor";
import { fetchTags } from '../../../util/common';

function PostForm({ method, post }) {
    const [generatedImageUrl, setGeneratedImageUrl] = useState(post ? post.imageUrl : '');
    const [content, setContent] = useState(post ? post.content : '');
    const userName = getUser();
    const [isVisible, setIsVisible] = useState(post ? post.isVisible : false);
    const [tags, setTags] = useState([]);

    const allSelectedTag = post && post.tags && post.tags.map(tag => parseInt(tag.id));

    const [selectedTags, setSelectedTags] = useState(allSelectedTag ? allSelectedTag : []);

    const tagHandler = (tag) => {
        setSelectedTags((prevSelected) => {
            if (prevSelected.includes(tag.id)) {
                return prevSelected.filter((id) => id !== tag.id);
            } else {
                return [...prevSelected, tag.id];
            }
        });
    };

    useEffect(() => {
        const getTags = async () => {
            const { tags } = await fetchTags();
            setTags(tags);
        }
        getTags();

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
        navigate(method === 'post' ? '/admin' : '/admin/posts');
    }

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
                            <TextEditor value={content} onChange={setContent} />
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
                                onChange={async (event) => await fileUploadUsingJson(event, setGeneratedImageUrl)} />
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
                                defaultValue={userName} />
                        </div>
                    </div>
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="isVisible" name="isVisible" checked={isVisible} onChange={(event) => setIsVisible(event.target.checked)} />
                        <label className="form-check-label" htmlFor="isVisible" >Is Visible </label>
                    </div>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle mb-2" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Tags
                        </button>
                        <input type="hidden" name="selectedTags" value={selectedTags.join(',')} />
                        <ul className="dropdown-menu">
                            {tags.map((tag) => (
                                <li key={tag.id} className="dropdown-item  ${selectedTags.includes(tag.id) ? 'active' : ''}`" onClick={() => tagHandler(tag)} >
                                    {tag.displayName}
                                    {selectedTags.includes(tag.id) && <span>&#10003;</span>}
                                </li>
                            ))}
                        </ul>
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
    const response = await fetch('http://localhost:5243/BlogPost/blogPostId/' + id);

    if (!response.ok) {
        throw new Response({
            message: 'Could not fetch post data',
        },
            { status: 500 }
        )
    } else {
        const resData = await response.json();
        return {
            post: resData
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
        userId: data.get('author'),
        isVisible: data.get('isVisible') === 'on' ? true : false,
        tagIds: data.get('selectedTags') ? data.get('selectedTags').split(',').map(id => parseInt(id)) : [],
        likes: 0,
        dislikes: 0,
        comments: []

    };

    console.log(PostData, " postdata");

    let url = 'http://localhost:5243/BlogPost';

    if (method === 'PUT') {
        const postId = params.postId;
        url = `http://localhost:5243/BlogPost/update/?id=${postId}`;
    }

    const token = getAuthToken().token;

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