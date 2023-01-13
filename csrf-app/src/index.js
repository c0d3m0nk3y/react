import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';

const API_HOST = 'https://phase-two.primecarers.co.uk';

let _csrfToken = null;

async function getCsrfToken() {
    if (_csrfToken === null) {
        const response = await fetch(`${API_HOST}/app/api/get-csrf-token`, {
            credentials: 'include',
        });
        const data = await response.json();
        _csrfToken = data.csrfToken;
    }
    return _csrfToken;
}

async function testRequest(method) {
    const response = await fetch(`${API_HOST}/app/api/ping`, {
        method: method,
        headers: (
            method === 'POST'
                ? { 'X-CSRFToken': await getCsrfToken() }
                : {}
        ),
        credentials: 'include',
    });
    const data = await response.json();
    return data.result;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testGet: 'KO',
            testPost: 'KO',
        };
    }

    async componentDidMount() {
        this.setState({
            testGet: await testRequest('GET'),
            testPost: await testRequest('POST'),
        });
    }

    render() {
        return (
            <div>
                <p>Test GET request: {this.state.testGet}</p>
                <p>Test POST request: {this.state.testPost}</p>
            </div>
        );
    }
}

export default App;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
