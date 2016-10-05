import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setEndpointHost,
  setEndpointPath,
  readEndpoint,
  createEntity
} from 'redux-json-api';

import Post from './post';

const mapStateToProps = ({
  api: {
    posts
  }
}) => ({
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
    return <Post key={post.id} post={post} onDelete={this.deletePost} />;
  }

  render() {
    const posts = this.props.posts.map(this.mapPostsToView);
    return (
      <div>
        <h2>React 💜 Redux-JSON-API News</h2>
        <div>
          <button className="btn btn-sm btn-primary" onClick={this.fetchPosts}>Get some posts</button>
          <button className="btn btn-sm btn-primary" onClick={this.fetchPostsWithIncludes}>Get some posts with creators</button>
        </div>
        {
          posts.length > 0
          ? posts
          : <div>These are not the posts you're looking for! </div>
        }
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
