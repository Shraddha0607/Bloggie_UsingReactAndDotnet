import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useLoaderData , useFetcher} from 'react-router-dom';
import { getAuthToken, getUser } from '../../util/auth';
import { API_URL } from '../../util/config';

function FullPost() {

    const authData = getAuthToken();
    const token = authData?.token;
    const isAdmin = authData?.roles === 'Admin';
    const userId =getUser();

    const { post } = useLoaderData();
    let fetcher = useFetcher();

    const [likes, setLikes] = useState();
    const [dislikes, setDislikes] = useState();
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    
    useEffect(() => {
            fetchReaction();
    }, []);

    useEffect(() => {
        if(fetcher.state === 'idle') {
            fetchReaction();
            const commentInput = document.getElementById('comment');
            if (commentInput) commentInput.value = '';
        }
    }, [fetcher.state]);

    const fetchReaction = async () => {

            try {
                const reactionResponse = await fetch(`${API_URL}/BlogPostReaction?PostId=${post.id}&UserId=${userId}`);
                const commentResponse = await fetch(`${API_URL}/Comment?PostId=${post.id}`);

                if (!reactionResponse.ok) {
                    throw new Error("Could not fetch reaction!");
                }

                if (!commentResponse.ok) {
                    throw new Error('Could not fetch comments');
                }

                const reactionResData = await reactionResponse.json();
                const commentResData = await commentResponse.json();

                setLikes(reactionResData.likeCount);
                setDislikes(reactionResData.disLikeCount);
                setComments([...commentResData]);
            }
            catch (error) {
                console.error(error);
            }
        };

    const dislikeHandler = async () => {

        try {
            console.log("dislike clicked");
            const url = `${API_URL}/BlogPostReaction`;

            const reactionData = {
                blogId: post.id,
                userId: userId,
                userReaction: 2
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reactionData)
            });

            if (!response.ok) {
                throw new Response(
                    { message: 'Could able to dislike post!' },
                    { status: 500 }
                )
            }
            else {
                alert("Thank you for your feedback.");
                await fetchReaction(); 
            }
        }
        catch (error) {
        }
    }

    const likeHandler = async () => {
        try {
            const id = post.id;

            const reactionData = {
                blogId: post.id,
                userId: userId,
                userReaction: 1
            };

            const url = `${API_URL}/BlogPostReaction`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(reactionData)
            });

            if (!response.ok) {
                throw new Response(
                    { message: 'Could not able to like post!' },
                    { status: 500 }
                )
            }
            else {
                alert("Thank you for your feedback.");
                await fetchReaction(); 
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    function commentHandler() {
        setShowComments(!showComments);
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

                <span><FontAwesomeIcon icon={faThumbsUp} onClick={likeHandler} /> {likes}</span>
                <span style={{ marginLeft: '1rem' }}><FontAwesomeIcon icon={faThumbsDown} onClick={dislikeHandler} /> {dislikes}</span>
                <div>
                    <button onClick={commentHandler}>
                        {showComments ? "Hide comments" : "Show comments"}
                    </button>

                    {showComments && (
                        <div>
                            <h6>All Comments</h6>
                            {comments.length > 0 ? (
                                <div>
                                    {comments.map((comment) => (
                                        <p key={comment.id}>{comment.content}</p>
                                    ))}
                                </div>
                            ) : (
                                <p>No comments found.</p>
                            )}
                        </div>
                    )}
                </div>

            </div>
            {!isAdmin && <div className="card m-3" >
                <div className="card-body ">
                    <fetcher.Form method='post'>
                        <input type="hidden" name="postId" value={post.id} />
                        <input type="hidden" name="userId" value={userId} />
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label"><strong>Comment</strong></label>
                            <input type="text" className="form-control" id="comment" name="comment" required />
                        </div>
                       <button className="btn btn-dark"> {fetcher.state === 'submitting' ? 'Submitting' : 'Submit'}</button>
                    </fetcher.Form>
                </div>
            </div>}

        </div>
    )
}

export default FullPost;


export async function loader({ params, request }) {

    const urlHandler = params.postUrl;

    const response = await fetch(`${API_URL}/BlogPost/byUrl/${urlHandler}`);

    if (!response.ok) {
        throw new Response(
            { message: 'Could not fetch post data!' },
            { status: 500 }
        )
    }
    else {
        const resData = await response.json();
        return { post: resData };
    }
}

export async function action({ params, request }) {

    const data = await request.formData();

    const commentData = {
        "content": data.get('comment'),
        "postId": data.get('postId'),
        "userId": data.get('userId')
    };

    console.log(commentData, " is the comment payload");

    let url = `${API_URL}/Comment`;
    const token = getAuthToken().token;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(commentData)
    });

    if (response.status === 422 || response.status === 401) {
        return response;
    }

    const resData = await response.json();
    if (response.status === 409) {
        alert(resData.message);
        return;
    }

    if (!response.ok) {
        throw new Response({ message: 'Could not add comment!' }, { status: 500 });
    }

    alert('Thank you for your review comment.');

}
