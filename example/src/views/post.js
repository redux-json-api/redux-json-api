import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteEntity } from 'redux-json-api';

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
    return (
      <div key={post.id} style={{ marginBottom: '20px' }} onClick={this.handleDelete}>
        <div>{post.attributes.value}</div>
        <div>
          <i>Written by:</i> <strong>{this.createe(post.relationships.createe.data.id)}</strong>
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(Post);
