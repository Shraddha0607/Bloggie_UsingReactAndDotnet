import { useRouteLoaderData } from "react-router-dom";
import TagForm from "./TagForm";


function EditTagPage() {
    const data = useRouteLoaderData('tag-details');
    return <TagForm method='put' tag={data.tag} />
}

export default EditTagPage;