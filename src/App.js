import React, {Component} from 'react';
import SearchBar from './SearchBar';
import Results from './Results';
import './App.css';
import logo from './KL_Tree_64.png';

const API_BACKEND = process.env.NODE_ENV !== 'production' ? process.env.REACT_APP_API_BACKEND : '';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            searchTerm: '',
            inProgress: false,
            page: 0
        }
    }

    doSearch(searchTerm, page=0) {
        console.log('Searching for:', searchTerm, ' page: ', page);
        this.setState({searchTerm, page, inProgress: true});
        fetch(API_BACKEND + 'search?text=' + searchTerm + '&page=' + page)
            .then(response => {
                if (response.ok) {
                    return response.json().then(data => this.setState({data, inProgress: false}));
                }
                throw new Error('Network response was not ok.');
            })
            .catch(err => {
                console.error("Error during search", err);
                this.setState({inProgress: false})
            });
    }

    render() {
        return (
            <div className="app">
                <div className="app-header">
                    <img src={logo} alt="logo"/>
                    <h2>MDB Elasticsearch Explorer</h2>
                </div>
                <p className="app-intro">
                    Enter search term and click enter (or search button)
                </p>
                <SearchBar onSearch={(x) => this.doSearch(x)}
                           inProgress={this.state.inProgress}/>
                <br/>
                <Results data={this.state.data}
                         page={this.state.page}
                         onPageChange={(x) => this.doSearch(this.state.searchTerm, x)}/>
            </div>
        );
    }
}

export default App;
