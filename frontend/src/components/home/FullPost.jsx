import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useLoaderData, Form } from 'react-router-dom';
import { getAuthToken } from '../../util/auth';

function FullPost() {

    const token = getAuthToken();
    const {post} = useLoaderData();

    // const url = 'http://localhost:8080/posts/';

    const dislikeHandler = async () =>  {

        try {
            const id = post.id;
            const url = 'http://localhost:8080/posts/dislike/' + id;
            // url = `${url}dislike/${id}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Response(
                    { message: 'Could able to dislike post!' },
                    { status: 500 }
                )
            }
            else {
                alert("Thank you for your feedback.");
            }
        }
        catch (error) {
        }
    }

    const likeHandler = async () => {
         try {
            const id = post.id;
            const url = 'http://localhost:8080/posts/like/' + id;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Response(
                    { message: 'Could able to like post!' },
                    { status: 500 }
                )
            }
            else {
                alert("Thank you for your feedback.");
            }
        }
        catch (error) {
        }
    }

    return (
        <div className="container" >

            <div className="m-3">
                <h1 className="card-title">{post.heading}</h1>
                <div className="d-flex justify-content-between">
                    <p className="card-title">{post.author}</p>
                    <p className="card-title">{post.publishedDate}</p>
                </div>
                <img src={post.imageUrl} className="card-img-top m-4" alt="..." />
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className='mx-3'>

                <span><FontAwesomeIcon icon={faThumbsUp} onClick={likeHandler} /> {post.likes}</span>
                <span style={{ marginLeft: '1rem' }}><FontAwesomeIcon icon={faThumbsDown} onClick={dislikeHandler} /> {post.dislikes}</span>
            </div>
            <div className="card m-3" >
                <div className="card-body ">
                    <Form method='post'>
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label"><strong>Comment</strong></label>
                            <input type="text" className="form-control" id="comment" name="comment" required/>
                        </div>
                        <button className="btn btn-dark">Submit</button>
                    </Form>
                </div>
            </div>

        </div>
    )
}

export default FullPost;


export async function loader({ params, request }) {

    const urlHandler = params.postUrl;

    const response = await fetch('http://localhost:8080/posts/byUrl/' + urlHandler);

    if (!response.ok) {
        throw new Response(
            { message: 'Could not fetch post data!' },
            { status: 500 }
        )
    }
    else {
        const resData = await response.json();
        return { post: resData.post };
    }
}

export async function action({ params, request }) {
    console.log("params are ", params);
    console.log("request is ", request);
    console.log("comment action hit");

    const data = await request.formData();

    const comment = data.get('comment');
    console.log("comment is ", comment);
}
