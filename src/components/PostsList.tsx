import ItemsList from "./ItemsList"
import { useEffect, useState } from "react"
import postsService, { CanceledError } from "../services/posts_service"

interface Post {
  _id: string,
  title: string,
  content: string,
  sender: string,
  avatarUrl: string
}

function PostList() {
  const [items, setItems] = useState<Post[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log('useEffect')
    setIsLoading(true)
    const { request, abort } = postsService.getPostsForUser()
    request.then((response) => {
      console.log(response.data)
      setItems(response.data as any)
      setIsLoading(false)
    }).catch((error) => {
      if (!(error instanceof CanceledError)) {
        console.error(error)
        setError('Error fetching data...')
        setIsLoading(false)
      }
    })
    return () => { abort() }
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
