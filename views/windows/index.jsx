import fetch from './../../components/async-fetch/fetch.js';
import login from './../../components/login.js';
import toast from './../../components/toast.js'

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

        const editId = window.sessionStorage['require-assist-detail-id']
        if (editId) {
            this.expandNodeHandle(+editId)
            window.sessionStorage['require-assist-detail-id'] = ''
        }
    }

    initSelectHandle() {
        const self = this

        const selectNodeHandle = node => {
            const data = self.mindInstan.get_node(node)

            window.sessionStorage.setItem('require-assist-detail-id', data.id)
            window.location.href = './detail/index.html'
        }

        this.mindInstan.add_event_listener((type, { evt, node }) => {
            if (type === 4 && evt === 'select_node') selectNodeHandle(node)
        });
    }

    expandAllHandle() {
        this.mindInstan.expand_all()
        this.colorRestoration()
    }

    collapseAllHandle() {
        const self = this
        this.mindData.data.filter(element => element.id !== 1).map(element => self.mindInstan.collapse_node(element.id))
        this.colorRestoration()
    }

    colorRestoration() {
        const self = this
        this.mindData.data.filter(element => element.id !== 1).map(element => {
            const bgcolor = '#428bca'
            const fgcolor = '#FFF'
            self.mindInstan.set_node_color(element.id, bgcolor, fgcolor)
        })
    }

    expandNodeHandle(id) {
        const self = this

        if (id === 1) return false /** 无法展开根目录 */

        const currentNode = this.mindData.data.find(element => element.id === id);

        if (!currentNode) return toast.show(`无法找到id=${id}`)

        let depthList = []
        const findParent = node => {
            depthList.push(node.id)

            if (node.parentid !== 1) {
                const parentNode = self.mindData.data.find(element => element.id === node.parentid);
                findParent(parentNode)
            }
        }
        findParent(currentNode)

        this.collapseAllHandle()

        const bgcolor = '#f1c40f'
        const fgcolor = '#FFF'
        this.mindInstan.set_node_color(currentNode.id, bgcolor, fgcolor)

        depthList.reverse().map(id => self.mindInstan.expand_node(id))
    }

    expandRandomHandle() {
        const shuffle = mindArray => {
            let len = mindArray.length;
            for (let i = 0; i < len - 1; i++) {
                let index = parseInt(Math.random() * (len - i));
                let temp = mindArray[index];
                mindArray[index] = mindArray[len - i - 1];
                mindArray[len - i - 1] = temp;
            }
            return mindArray;
        }
        const mindData = this.mindData.data.filter(element => element.id !== 1)

        const randomNode = shuffle(mindData)[0]

        this.expandNodeHandle(randomNode.id)
    }

    render() {

        return [
            <div className="operation">
                <div className="operation-container flex-start">
                    <div className="operation-item">
                        <div className="operation-item-container flex-center noselect"
                            onClick={this.expandAllHandle.bind(this)}
                        >展开所有</div>
                    </div>
                    <div className="operation-item">
                        <div className="operation-item-container flex-center noselect"
                            onClick={this.expandRandomHandle.bind(this)}
                        >随机查看</div>
                    </div>
                </div>
            </div>,

            <div className="mind" id="jsmind_container"></div>
        ]
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
