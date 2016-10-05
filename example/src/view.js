import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setEndpointHost,
  setEndpointPath,
  readEndpoint,
  deleteEntity,
  createEntity
} from 'redux-json-api';
import Post from 'views/posts';

const mapStateToProps = ({
  api: {
    posts,
    users
  }
}) => ({
  users: (users || { data: [] }).data,
  posts: (posts || { data: [] }).data
});
class viewComp extends Component {

  static propTypes = {

  };

  constructor(props) {
    super(props);

    this.state = {
      post: ''
    };

    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchPostsWithIncludes = this.fetchPostsWithIncludes.bind(this);
    this.mapPostsToView = this.mapPostsToView.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(setEndpointHost('http://localhost:3000'));
    dispatch(setEndpointPath('/api'));
  }

  fetchPosts() {
    const { dispatch } = this.props;
    dispatch(readEndpoint('posts'));
  }

  fetchPostsWithIncludes() {
    const { dispatch } = this.props;
    dispatch(readEndpoint('posts?include=posts.createe'));
  }

  deletePost(post) {
    const { dispatch } = this.props;
    dispatch(deleteEntity(post));
  }

  createe(userId) {
    const { users } = this.props;
    const postUser = users.find(user => user.id === userId);
    return postUser ? postUser.attributes.name : '';
  }

  handleChange(e) {
    this.setState({ post: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.post.length === 0) {
      alert('Please write some post content.');
      return;
    }

    const { dispatch } = this.props;
    dispatch(createEntity({
      type: 'posts',
      attributes: {
        value: this.state.post
      },
      relationships: {
        createe: {
          data: {
            type: 'users',
            id: '1'
          }
        }
      }
    }));
  }

  mapPostsToView(post) {
    return (
      <div key={post.id} style={{ marginBottom: '20px' }} onClick={this.deletePost.bind(this, post)}>
        <div>{post.attributes.value}</div>
        <div>
          <i>Written by:</i> <strong>{this.createe(post.relationships.createe.data.id)}</strong>
        </div>
      </div>
    );
  }

  render() {
    const posts = this.props.posts.map(this.mapPostsToView);
    return (
      <div>
        <button onClick={this.fetchPosts}>Get some posts</button>
        <button onClick={this.fetchPostsWithIncludes}>Get some posts with creators</button>
        <div>
          <h1>Posts</h1>
          {
            posts.length > 0
            ? posts
            : <div>These are not the posts you're looking for! </div>
          }
        </div>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <fieldset>
            <legend>New Post</legend>
            <input placeholder="New post text" onChange={this.handleChange} />
            <button type="submit">Create new post</button>
          </fieldset>
        </form>
      </div>
    );
  }

}

export default connect(mapStateToProps)(viewComp);
