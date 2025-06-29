import { API_URL } from "./config";

export const fetchTags = async () => {
     const response = await fetch(`${API_URL}/Tag/all`);

    if (!response.ok) {
        throw new Response({
            message: 'Could not fetch tags.'
        },
            {
                status: 500,
            });
    }
    else {
        const resData = await response.json();
        return { tags: resData };
    }

}