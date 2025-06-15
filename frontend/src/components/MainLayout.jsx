import { useEffect } from 'react'
import Footer from "./Footer";
import MainNavigation from "./MainNavigation"
import { Outlet, useSubmit } from 'react-router-dom';
import { getTokenDuration } from '../util/auth';
import { useLoaderData } from 'react-router-dom';

function MainLayout() {

  const token = useLoaderData();
  const submit = useSubmit();

  useEffect(() => {
    if (!token) {
      return;
    }

    if (token === 'EXPIRED') {
      submit(null, { action: '/logout', method: 'post' });
      return;
    }

    const tokenDuration = getTokenDuration();

    setTimeout(() => {
      submit(null, { action: '/logout', method: 'post' })
    }, tokenDuration);

  }, [token, submit]);

  return (
    <div className='d-flex flex-column min-vh-100'>
      <main className='flex-fill' >
        <MainNavigation />
        <div>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout
