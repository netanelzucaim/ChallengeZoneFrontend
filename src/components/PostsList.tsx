import ItemsList from "./ItemsList"
import { useEffect, useState } from "react"
import postsService, { CanceledError } from "../services/posts_service"

function PostList() {
  const [items, setItems] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log('useEffect')
    setIsLoading(true)
    const { request, abort } = postsService.getPosts()
    request.then((response) => {
      console.log(response.data)
      setItems(response.data.map((item) => item.title))
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
      <ItemsList items={items} title="Posts" onItemSelected={() => { }} />
    </div>
  )
}

export default PostList
