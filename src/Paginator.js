import React from 'react';
import './Paginator.css';

const getNeighbourhood = (props) => {
    const {page, totalPages, neighbours} = props;
    let neighbourhoud = [];
    for (let i = page - neighbours; i <= page + neighbours; i++) {
        if (i >= 0 && i <= totalPages) {
            neighbourhoud.push(i);
        }
    }
    return neighbourhoud;
};

const onClick = (event, page, callback) => {
    event.preventDefault();
    callback(page);
};

const Paginator = (props) => {
    return <div className="paginator">
        {props.page > 0 ?
            <a href="" onClick={(e) => onClick(e, props.page - 1, props.onChange)}>Prev</a>
            : null}

        {getNeighbourhood(props).map(x => {
            return <a href=""
                      key={x}
                      className={props.page === x ? "paginator-active" : ""}
                      onClick={(e) => onClick(e, x, props.onChange)}>
                {x}
            </a>
        })}

        {props.page < props.totalPages ?
            <a href="" onClick={(e) => onClick(e, props.page + 1, props.onChange)}>Next</a>
            : null}
    </div>;
};

Paginator.propTypes = {
    page: React.PropTypes.number,
    totalPages: React.PropTypes.number,
    neighbours: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired
};

Paginator.defaultProps = {
    page: 0,
    totalPages: 0,
    neighbours: 3
};

export default Paginator;