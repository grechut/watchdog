import React from 'react';
import { connect } from 'react-redux';
import { createDevice } from '../actions';
import { updatePath } from 'redux-simple-router';

class New extends React.Component {
    render() {
        const { dispatch } = this.props;

        return (
            <div className='app'>
                <button onClick={() => dispatch(createDevice())}
                    className="btn btn-success">
                    New device
                </button>
            </div>
        );
    }
}

export default connect()(New);
