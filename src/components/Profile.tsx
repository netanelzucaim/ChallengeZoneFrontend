import ItemsList from "./ItemsList"
import { useEffect, useState } from "react"
import postsService, { CanceledError } from "../services/posts_service"

interface Post {
  _id: string,
  postPic: string,
  content: string,
  sender: string,
  username?: string,
  avatarUrl?: string
}

function PostList() {
  const [items, setItems] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log('useEffect')
    setIsLoading(true)
    postsService.getPostsForUser().then(({ data, abort }) => {
      setItems(data)
      setIsLoading(false)
      return () => { abort() }
    }).catch((error: unknown) => {
      if (!(error instanceof CanceledError)) {
        console.error(error)
        setError('Error fetching data...')
        setIsLoading(false)
      }
    })
  }, [])

  console.log('App rendered')
  return (
    <div className="m-3">
      {isLoading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      <ItemsList items={items} onItemSelected={() => { }} />
    </div>
  )
}

export default PostList