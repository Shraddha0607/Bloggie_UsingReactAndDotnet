import { useLoaderData } from "react-router-dom"

function About() {
    const tags = useLoaderData().tags;

    return (
        <div className=" ">
            <div  className=".container-fluid d-flex justify-content-between">
                <div>
                    <h1>Bloggie - The Dev Blog</h1>
                    <p>
                        Bloggie is the gone coding blogs covering a vast range of topics like HTML, CSS, JavaScript, ASP.NET, C#, Angular etc. Want to read the latest dev articles? Join the Bloggie app and get weekly blogs in your email.
                    </p>
                </div>


                <div className="ml-5 p-3">
                    <img src="https://images.pexels.com/photos/360591/pexels-photo-360591.jpeg?auto=compress&cs=tinysrgb&w=600" className="img-fluid" alt='bloggie' />
                </div>
            </div>

            <div>
                {tags && tags.map((tag) => (
                    <span key={tag.id} class="badge text-bg-dark m-1">{tag.name}</span>
                ))}
            </div>
        </div>
    )
}

export default About
