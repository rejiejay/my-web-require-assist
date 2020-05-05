import CONST from './const.js';

class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }

    async componentDidMount() {
        this.initMind()
    }

    initMind() {
        const mind = new jsMind({
            container: 'jsmind_container',
            editable: true,
            theme: 'orange'
        });
        mind.show();
    }

    render() {

        return [
            <div className="operation">
                <div className="operation-container flex-start">
                    <div className="operation-item">
                        <div className="operation-item-container flex-center">展开所有</div>
                    </div>
                    <div className="operation-item">
                        <div className="operation-item-container flex-center">随机查看</div>
                    </div>
                </div>
            </div>,

            <div className="mind" id="jsmind_container">
            </div>
        ]
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
