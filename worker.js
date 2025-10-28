

export default serve((app) => {
  app.get('/', (c) => c.text('Hello World!'))
})
