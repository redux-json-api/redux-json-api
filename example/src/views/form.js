import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createEntity } from 'redux-json-api';

class PostForm extends Component {

  constructor() {
    super();

    this.state = {
      post: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {

  };

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

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <fieldset>
          <legend>New Post</legend>
          <input placeholder="New post text" onChange={this.handleChange} />
          <button type="submit">Create new post</button>
        </fieldset>
      </form>
    );
  }

}

export default connect()(PostForm);
