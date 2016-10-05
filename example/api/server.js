const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const Imm = require('immutable');
const posts = require(__dirname + '/dummy-posts.json');
const postsWithIncludes = require(__dirname + '/dummy-posts-with-includes.json');

const app = express();
app.use(cors());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.get('/api/posts', function (req, res) {
  if (req.query.include) {
    res.send(postsWithIncludes);
    return;
  }
  res.send(posts);
});

app.post('/api/posts', function(req, res) {
  const responsePosts = Imm.fromJS(posts)
    .updateIn(['data'], posts => {
      const latestPost = posts.last();
      const newPost = Object.assign(req.body.data, {
        id: parseInt(latestPost.get('id'), 10) + 1
      });

      return posts.push(newPost);
    })
    .toJS()
  res.send(responsePosts)
});

app.delete('/api/posts/:postId', function(req, res) {
  const responsePosts = Imm.fromJS(posts)
    .updateIn(['data'], posts => {
      const postIdx = posts.findIndex(post => post.id === req.params.postId);
      if (postIdx === -1) {
        res.status(404).send('Could not find post, please see request object.')
        return
      }
      return posts.delete(postIdx);
    })
    .toJS()

  res.send(responsePosts);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
