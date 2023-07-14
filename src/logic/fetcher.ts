export const fetcher = (key: string) =>
  fetch(key)
    .then((resp) => {
      return resp && resp.json()
    })
    .then((data) => {
      // eslint-disable-next-line antfu/if-newline
      if (data.message) throw new Error(data.message)
      return data
    })
