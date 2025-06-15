import './App.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'

import Home, {loader as homeLoader} from './pages/Home';
import AdminLayout from './components/AdminLayout';
import AuthForm, { action as authAction } from './components/AuthForm';
import UsersPage, { loadUsers as usersLoader, action as deleteUserAction } from './components/user/Users';
import { loader as tokenLoader, checkAuthLoader } from './util/auth';
import EditUserPage, { action as manipulateUserAction, loader as editUserPageLoader, } from './components/user/EditUser';
import { action as logoutAction } from './pages/Logout';
import TagsPage , { loader as tagsLoader, action as deleteTagAction } from './components/admin/tag/Tags';
import NewTagPage from './components/admin/tag/NewTag';
import EditTagPage from './components/admin/tag/EditTag';
import { action as addTagAction, loader as editTagPageLoader } from './components/admin/tag/TagForm';
import PostsPage, { loader as postsLoader, action as deletePostAction } from './components/admin/post/Posts';
import NewPostPage from './components/admin/post/NewPost';
import { action as addPostAction } from './components/admin/post/PostForm';
import EditPostPage from './components/admin/post/EditPost';
import {loader as editPostPageLoader } from './components/admin/post/PostForm';
import FullPost, {loader as postLoader, action as commentAction} from './components/home/FullPost';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    loader: tokenLoader,
    id: 'root',
    children: [
      {
        index: true,
        element: <Home />,
        loader: homeLoader
      },
      {
        path: 'post/:postUrl',
        element: <FullPost />,
        loader: postLoader,
        action: commentAction
      },
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          {
            path: 'users',
            element: <UsersPage />,
            loader: usersLoader,
            id: 'users',
          },
          {
            path: 'users/:userId/edit',
            element: <EditUserPage />,
            id: 'user-details',
            loader: editUserPageLoader,
            action: manipulateUserAction,
          },
          {
            path: 'users/:userId',
            id: 'user-detail',
            loader: checkAuthLoader,
            action: deleteUserAction,
          },
          {
            path: 'tags',
            element: <TagsPage />,
            loader: tagsLoader,
            id: 'tags',
          },
          {
            path: 'tags/newTag',
            element: <NewTagPage />,
            action: addTagAction,
          },
          {
            path: 'tags/:tagId/edit',
            id: 'tag-details',
            element: <EditTagPage />,
            loader: editTagPageLoader,
            action: addTagAction,
          },
          {
            path: 'tags/:tagId',
            id: 'tag-detail',
            loader: checkAuthLoader,
            action: deleteTagAction,
          },
          {
            path: 'posts',
            element: <PostsPage />,
            loader: postsLoader,
            id: 'posts',
          },
          {
            path: 'posts/newPost',
            element: <NewPostPage />,
            action: addPostAction,
          },
          {
            path: 'posts/:postId/edit',
            id: 'post-details',
            element: <EditPostPage />,
            loader: editPostPageLoader,
            action: addPostAction
          },
          {
            path: 'posts/:postId',
            id: 'post-detail',
            loader: checkAuthLoader,
            action: deletePostAction,
          },
         
        ]
      },
      {
        path: 'auth',
        element: <AuthForm />,
        action: authAction,
      },
      {
        path: 'logout',
        action: logoutAction,
      }
    ]
  }
])
function App() {

  return (
    <RouterProvider router={router}>
    </RouterProvider>
  )
}

export default App
