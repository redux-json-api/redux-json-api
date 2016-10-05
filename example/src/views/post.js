import React, { Component } from 'react';
import { connect } from 'react-redux';

class post extends Component {

  static propTypes = {
    post: React.PropTypes.object.isRequired
    onDelete: React.PropTypes.func.isRequired
  };

  render() {
    const { post, onDelete } = this.props
    return (
      <div key={post.id} style={{ marginBottom: '20px'}} onClick={onDelete}>
        <div>{post.attributes.value}</div>
        <div>
          <i>Written by:</i> <strong>{this.createe(post.relationships.createe.data.id)}</strong>
        </div>
      </div>
    );
  }

}

export default connect()(post);
