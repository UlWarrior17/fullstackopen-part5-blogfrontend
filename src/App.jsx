import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const likeBlog = async (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id)
    blogToUpdate.likes++
    
    const returnedBlog = await blogService.update(id, blogToUpdate)
    setBlogs(blogs.map(blog => blog.id !== id ? blog : {...returnedBlog, user: blogToUpdate.user}))
  }

  const addBlog = async (blogObject) => {
    try{
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      console.log('after new blog is added',blogs)

      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setType('success')
      setTimeout(() => {
        setMessage(null)
        setType(null)
      }, 5000)
    } catch (error) {
      setMessage(`Error creating blog`)
      setType('error')
      setTimeout(() => {
        setMessage(null)
        setType(null)
      }, 5000)
    }
  }

  const removeBlog = async (id) => {
    const blogToRemove = blogs.find(blog => blog.id === id)
    
    if (window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)) {
      try {
        await blogService.remove(blogToRemove.id)
        setBlogs(blogs.filter(blog => blog.id !== id))

        setMessage(`Blog ${blogToRemove.title} removed`)
        setType('success')
        setTimeout(() => {
          setMessage(null)
          setType(null)
        }, 5000)
      } catch (error) {
        setMessage('Error removing blog')
        setType('error')
        setTimeout(() => {
          setMessage(null)
          setType(null)
        }, 5000)
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try { 
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong password or username')
      setType('error')
      setTimeout(() => {
        setMessage(null)
        setType(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    blogService.setToken(null)
    setUser(null)
  }

  const loginForm = () => (
    <div>
      <h1>log in to application</h1>
      <Notification message={message} type={type} />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );


  const blogList = () => (
    <div>
      <h1>blogs</h1>
      <Notification message={message} type={type} />
      <p></p>
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <br />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <br />
      <div>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={() => likeBlog(blog.id)}
            removeBlog={() => removeBlog(blog.id)}
            currentUser={user}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {user == null ?
        loginForm() :
        <div>
          {blogList()}
        </div>
      }
    </div>
  )
}

export default App