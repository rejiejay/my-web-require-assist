import login from './../../components/login.js';
import toast from './../../components/toast.js'
import deviceDiffer from './../../utils/device-differ.js'
import loadPageVar from './../../utils/load-page-var.js'

import CONST from './const.js';

class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    async componentDidMount() {
        await login()
        this.initRedirect()
    }

    initRedirect() {
        const isMobileDevice = deviceDiffer()
        const id = loadPageVar('id')

        if (!id) {
            toast.show('没有获取任何id')
            return setTimeout(
                () => window.location.replace("./../index.html"),
                2000
            )
        }

        window.sessionStorage.setItem('require-assist-detail-id', id)
        isMobileDevice ? window.location.href = './../detail/index.html' : window.location.href = './../windows-detail/index.html'
    }

    render() {
        return (<div className="redirect"></div>)
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
