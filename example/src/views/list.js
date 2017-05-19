import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setEndpointHost,
  setEndpointPath,
  readEndpoint
} from 'redux-json-api';

import styles from './list.scss';
import Post from './post';
import Form from './form';

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

    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchPostsWithIncludes = this.fetchPostsWithIncludes.bind(this);
    this.mapPostsToView = this.mapPostsToView.bind(this);
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

  mapPostsToView(post) {
    return <Post key={post.id} post={post} onDelete={this.deletePost} />;
  }

  render() {
    const posts = this.props.posts.map(this.mapPostsToView);
    return (
      <div className={styles['news-wrapper']}>
        <div className={styles['news-header']}>
        <h2>React 💜 Redux-JSON-API News</h2>
          <button className="btn btn-sm btn-link" onClick={this.fetchPosts}>Get news</button>
          <button className="btn btn-sm btn-link" onClick={this.fetchPostsWithIncludes}>Include author</button>
        </div>
        <div className={styles['news-list']}>
          {
            posts.length > 0
            ? posts
            : <div>These are not the posts you're looking for! </div>
          }
        </div>
        <Form />
      </div>
    );
  }

}

export default connect(mapStateToProps)(viewComp);
