addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // You can extract more information from the request if needed
  const url = new URL(request.url)
  
  // Return a simple response like "Hello, World!"
  return new Response('Hello, World!', {
    headers: { 'content-type': 'text/plain' },
  })
}
