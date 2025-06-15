import { useLoaderData } from "react-router-dom"
import About from "../components/home/About"
import PostCard from "../components/home/PostCard"

function Home() {
  const posts = useLoaderData().posts;

  return (
    <div className="container">
      <About />
      <div className="row m-3 px-3">
        {posts.map((post) => (
          <div className="col-lg-4 col-lg-6 col-xxl-4 mb-3" key={post.id}>
            <PostCard post={post} />
          </div>
        ))}
      </div>


    </div>
  )
}

export default Home

export async function loader() {
  const response = await fetch('http://localhost:8080/posts');
  const tagResponse = await fetch('http://localhost:8080/tags');

  if (!response.ok) {
    throw new Response({
      message: 'Could not fetch posts.'
    },
      {
        status: 500,
      });
  }
  if (!tagResponse.ok) {
    throw new Response(
      {
        message: 'Could not fetch tags!'
      },
      {
        status: 500,
      }
    )
  }

  else {
    const resData = await response.json();
    const tagResData = await tagResponse.json();

    return {
      posts: resData.posts,
      tags: tagResData.tags
    };
  }
}
