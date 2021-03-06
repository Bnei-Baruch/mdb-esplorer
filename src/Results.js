import React, {Component, PropTypes} from 'react';
import ResultItem from './ResultItem';
import Paginator from './Paginator';
import './Results.css';

class Results extends Component {
    static propTypes = {
        data: PropTypes.object
    };

    renderSummary() {
        const {data, page, onPageChange} = this.props;
        return !!data ?
            <div className="results-summary">
                Found {data.hits.total} results ({data.took} ms)
                <Paginator page={page} totalPages={Math.floor(data.hits.total / 10)} onChange={onPageChange}/>
            </div> :
            null;
    }

    renderItems() {
        const data = this.props.data;
        if (!data) return null;

        const hits = this.props.data.hits;
        if (hits.total === 0) {
            return (<p>No results found. Try something else...</p>)
        }
        return <div className="results-list">
            {hits.hits.map(x => <ResultItem data={x} key={x._id}/>)}
        </div>
    }

    render() {
        return (
            <div className="results">
                {this.renderSummary()}
                {this.renderItems()}
            </div>
        );
    }
}

export default Results;
