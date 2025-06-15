import { useRouteLoaderData } from "react-router-dom";
import PostForm from "./PostForm";


function EditPostPage() {
    const data = useRouteLoaderData('post-details');
    return <PostForm method='patch' post={data.post} />
}

export default EditPostPage;