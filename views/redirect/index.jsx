import fetch from './../components/async-fetch/fetch.js';
import login from './../components/login.js';
import toast from './../components/toast.js'
import deviceDiffer from './../utils/device-differ.js'

import CONST from './const.js';

class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    async componentDidMount() {
        await login()
    }

    render() {

        return (<div className="redirect"></div>)
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
