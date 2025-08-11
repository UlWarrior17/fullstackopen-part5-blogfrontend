import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, currentUser }) => {
  const [visible, setVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isAuthorized = currentUser.username === blog.user.username

  return (
    <div style={blogStyle}>
      {!visible && (
        <div>
          {blog.title} {blog.author}{" "}
          <button onClick={() => setVisibility(true)}>view</button>
        </div>
      )}
      {visible && (
        <div>
          {blog.title} {blog.author}{" "}
          <button onClick={() => setVisibility(false)}>hide</button>
          <br />
          <a href={blog.url} target="_blank">
            {blog.url}
          </a>
          <br />
          likes {blog.likes} <button onClick={likeBlog}>like</button>
          <br />
          {blog.user.name}
          <br />
          {isAuthorized && <button onClick={removeBlog}>remove</button>}
          {/* <button onClick={removeBlog}>remove</button> */}
        </div>
      )}
    </div>
  );}

export default Blog