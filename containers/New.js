import React from 'react';
import { connect } from 'react-redux';
import { fetchDevice } from '../actions';
import { updatePath } from 'redux-simple-router';

class New extends React.Component {
    render() {
        const { dispatch } = this.props;

        return (
            <div className='app'>
                { ['id1', 'id2', 'id3'].map(x => {
                    return <button key={x}
                            onClick={() => dispatch(updatePath(`/device/${x}`))}>{x}
                        </button>
                })}
            </div>
        );
    }
}

export default connect()(New);
