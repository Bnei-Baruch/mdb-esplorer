import React, {Component, PropTypes} from 'react';
import Spinner from './Spinner';
import './SearchBar.css';

class SearchBar extends Component {
    static propTypes = {
        onSearch: PropTypes.func.isRequired,
        inProgress: PropTypes.bool
    };

    static defaultProps = {
        inProgress: false
    };

    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleKeyPress(event) {
        if (event.KeyCode === 13 || event.which === 13) {
            this.handleSubmit(event);
        }
    }

    handleSubmit(event) {
        this.props.onSearch(this.state.value);
        event.preventDefault();
    }

    render() {
        return (
            <div className="search-bar">
                <div className="search-bar-wrapper">
                    <input type="text"
                           value={this.state.value}
                           placeholder="search term"
                           onChange={(e) => this.handleChange(e)}
                           onKeyPress={(e) => this.handleKeyPress(e)}
                           autoFocus={true}
                    />
                    <input type="submit" value="Search" onClick={(e) => this.handleSubmit(e)}/>
                    {this.props.inProgress ? <span><Spinner /> Searching...</span> : null}
                </div>
            </div>
        );
    }
}

export default SearchBar;
