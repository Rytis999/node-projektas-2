const mongoose = require('mongoose')
require('dotenv').config()

// Connects DB
mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.nyjr2.mongodb.net/learn?retryWrites=true&w=majority`)
.then(() =>
  console.log('Connected to MongoDB')
).catch(err => console.log(err))

// Creates schema for new post
const postSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {type: Date, default: Date.now},
  isPublished: Boolean
})

// Class - Model
const postModel = mongoose.model('Posts', postSchema)

// DB controllers
async function createPost() {
  // add post object - typicly gathered from API POST request
  const post = new postModel({
    name: 'New post name',
    author: 'Ryts',
    tags: ['coding', 'school'],
    isPublished: true
  })

  // Write to DB and console.log result
  const result = await post.save()
  console.log(result)
}

async function getPosts() {
  // finds all posts - typicly we send data to get all api call response
  const posts = await postModel.find();
  console.log(posts)
}

async function filterPosts() {
  // finds and filters all posts - typicly we send data to get filtered or get /:id api call response
  // Also we can sort data
  const posts = await postModel.find({author: 'Rytis', isPublished: true}).sort({name: 1});
  console.log(posts)
}

async function postCount() {
  // finds and filters all posts - typicly we send data to get filtered or get /:id api call response
  // Also we can sort data
  const count = await postModel.find().count();
  console.log(count)
}

async function postPagination(count, size) {
  // We set page number and posts per page then get all of sorted posts
  const posts = await postModel.find().skip((count - 1) * size).limit(size)
  console.log(posts)
}

async function updatePost(id) {
  // Updates data on db
  const post = await postModel.findById(id)
  if(!post) return

  if(post.isPublished) return

  post.isPublished = true
  post.author = 'R. Rimašauskas'
  const result = await post.save()
  console.log(result)
}

async function updatePostDifferent(id) {
  // Updates data on db, better version
  const result = await postModel.updateOne({_id: id}, {$set: {author: 'R. Rimašauskas', isPublished: false}})
  console.log(result)
}

async function removePost(id) {
  const result = await postModel.findByIdAndRemove(id)
  console.log(result)
}



// Functions (controllers) INIT
createPost()
getPosts()
filterPosts()
postCount()
postPagination(1, 3)
updatePost('623310b095fd8e77861bf0a0')
updatePostDifferent('623310b095fd8e77861bf0a0')
removePost('623310b095fd8e77861bf0a0')