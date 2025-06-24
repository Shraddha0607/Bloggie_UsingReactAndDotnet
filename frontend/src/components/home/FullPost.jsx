import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useLoaderData, Form } from 'react-router-dom';
import { getAuthToken, getUser } from '../../util/auth';

function FullPost() {

    const token = getAuthToken();
    const { post } = useLoaderData();
    const userId = getUser();

    const [likes, setLikes] = useState();
    const [dislikes, setDislikes] = useState();
    const [comments, setComments] = useState([]);
    console.log(comments.length); 

    // const url = 'http://localhost:8080/posts/';

    useEffect(() => {
        const fetchReaction = async () => {

            try {
                console.log("Before fetching reaction");
                const reactionResponse = await fetch(`http://localhost:5243/BlogPostReaction?PostId=${post.id}&UserId=${userId}`);
                const commentResponse = await fetch(`http://localhost:5243/Comment?PostId=${post.id}`);

                if (!reactionResponse.ok) {
                    throw new Error("Could not fetch reaction!");
                }

                if (!commentResponse.ok) {
                    throw new Error('Could not fetch comments');
                }

                const reactionResData = await reactionResponse.json();
                const commentResData = await commentResponse.json();
                console.log("comments ", commentResData, " and length is ", commentResData.length);

                setLikes(reactionResData.likeCount);
                setDislikes(reactionResData.disLikeCount);
                setComments(...commentResData);
            }
            catch (error) {

            }

        }

        fetchReaction();
    }, []);

    const dislikeHandler = async () => {

        try {
            console.log("dislike clicked");
            const url = 'http://localhost:5243/BlogPostReaction';

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
            }
        }
        catch (error) {
        }
    }

    const likeHandler = async () => {
        try {
            console.log("like clicked");
            const id = post.id;

            const reactionData = {
                blogId: post.id,
                userId: userId,
                userReaction: 1
            };


            const url = 'http://localhost:5243/BlogPostReaction';

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
                console.log("like api done");
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

                <span><FontAwesomeIcon icon={faThumbsUp} onClick={likeHandler} /> {likes}</span>
                <span style={{ marginLeft: '1rem' }}><FontAwesomeIcon icon={faThumbsDown} onClick={dislikeHandler} /> {dislikes}</span>
                {comments.length > 0 && <div>
                    <p>dghjk</p>
                    {comments.map((comment) => {
                        console.log(comment)
                        return (<p key={comment.id}>{comment.content}</p>)
})}
                </div>}
            </div>
            <div className="card m-3" >
                <div className="card-body ">
                    <Form method='post'>
                        <input type="hidden" name="postId" value={post.id} />
                        <input type="hidden" name="userId" value={userId} />
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label"><strong>Comment</strong></label>
                            <input type="text" className="form-control" id="comment" name="comment" required />
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

    const response = await fetch('http://localhost:5243/BlogPost/byUrl/' + urlHandler);

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

    let url = 'http://localhost:5243/Comment';
    const token = getAuthToken();

    const response = await fetch(url, {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(commentData)
    });
    
    if (response.status === 422 || response.status === 401) {
        return response;
    }
    if(!response.ok) {
        throw new Response ({ message : 'Could not add comment!'}, {status : 500});
    }

    const resData = await response.json();
    console.log(resData, " is the return data");
    alert('Thank you for your review comment.');

}


//     let url = 'http://localhost:5243/Tag';
//     const token = getAuthToken();

//     const response = await fetch(url, {
//         method: method,
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + token
//         },
//         body: JSON.stringify(tagData)
//     });

//     const resData = await response.json();

//     return redirect('/admin/tags');

// }
