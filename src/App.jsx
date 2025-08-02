import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      author: author,
      url: url
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    setTitle('')
    setAuthor('')
    setUrl('')

    setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    setType('success')
    setTimeout(() => {
      setMessage(null)
      setType(null)
    }, 5000)
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
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={message} type={type} />
      <div>{blogForm()}</div>
      <p></p>
      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>
      <p></p>
      <div>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
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