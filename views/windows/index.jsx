import fetch from './../../components/async-fetch/fetch.js';
import login from './../../components/login.js';

import CONST from './const.js';

class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.mindData
        this.mindInstan
    }

    async componentDidMount() {
        await login()
        await this.initMind()
        await this.initSelectHandle()
    }

    async initMind() {
        const self = this

        this.mindData = {
            meta: { name: "jsMind", author: "hizzgdev@163.com", version: "0.4.6" },
            format: "node_array",
            data: CONST.MIND.DEFAULTS
        }

        await fetch.get({ url: 'mind/get/all', query: {} }).then(
            ({ data }) => {
                const root = data.find(element => element.id === 1);

                self.mindData.data = [
                    {
                        id: 1,
                        isroot: true,
                        topic: root.title
                    },
                    ...data.filter(element => element.id !== 1).map(item => ({
                        id: +item.id,
                        parentid: +item.parentid,
                        topic: item.title,
                        direction: 'right',
                        expanded: true
                    }))
                ]
            },
            error => { }
        )
        this.mindInstan = new jsMind({
            container: 'jsmind_container',
            editable: true,
            theme: CONST.THEME.PRIMARY
        })

        this.mindInstan.show(this.mindData);
    }

    initSelectHandle() {
        const self = this

        const selectNodeHandle = node => {
            const data = self.mindInstan.get_node(node)
            console.log('data', data.id)
        }

        this.mindInstan.add_event_listener((type, { evt, node }) => {
            if (type === 4 && evt === 'select_node') selectNodeHandle(node)
        });
    }

    expandAllHandle() {
        this.mindInstan.expand_all()
    }

    render() {

        return [
            <div className="operation">
                <div className="operation-container flex-start">
                    <div className="operation-item">
                        <div className="operation-item-container flex-center"
                            onClick={this.expandAllHandle.bind(this)}
                        >展开所有</div>
                    </div>
                    <div className="operation-item">
                        <div className="operation-item-container flex-center">随机查看</div>
                    </div>
                </div>
            </div>,

            <div className="mind" id="jsmind_container"></div>
        ]
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
