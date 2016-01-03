import React, { PropTypes } from 'react';

export class Btn extends React.Component {
  render() {
    return (
      <button onClick={this.props.onClick} className="btn btn-success">
        {this.props.text}
      </button>
    );
  }
}

Btn.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
};
