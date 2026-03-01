export function fetcher(key: string) {
  return fetch(key)
    .then((resp) => {
      return resp && resp.json()
    })
    .then((data) => {
      if (data.message) throw new Error(data.message)
      return data
    })
}
