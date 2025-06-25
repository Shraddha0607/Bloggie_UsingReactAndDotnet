export const fetchTags = async () => {
     const response = await fetch('http://localhost:5243/Tag/all');

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