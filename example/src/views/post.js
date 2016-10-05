import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteEntity } from 'redux-json-api';

import styles from './post.scss'

const mapStateToProps = ({
  api: {
    users
  }
}) => ({
  users: (users || { data: [] }).data,
});
class Post extends Component {

  constructor() {
    super();

    this.handleDelete = this.handleDelete.bind(this);
    this.createe = this.createe.bind(this);
  }

  static propTypes = {
    post: React.PropTypes.object.isRequired
  };

  createe(userId) {
    const { users } = this.props;
    const postUser = users.find(user => user.id === userId);
    return postUser ? postUser.attributes.name : '';
  }

  handleDelete() {
    const { post, dispatch } = this.props;
    dispatch(deleteEntity(post));
  }

  render() {
    const { post } = this.props;
    // onClick={this.handleDelete}
    return (
      <div key={post.id} className={styles['post-item']}>
        <p>{post.attributes.value}</p>
        <div className={styles.byline}>
          <i>Written by:</i> <strong>{this.createe(post.relationships.createe.data.id)}</strong>
        </div>
        <button className="btn btn-xs btn-link glyphicon glyphicon-trash" onClick={this.handleDelete} />
      </div>
    );
  }

}

export default connect(mapStateToProps)(Post);
