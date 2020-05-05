import fetch from './../../../components/async-fetch/fetch.js';

import CONST from './const.js';

class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            content: '',
            timeSpan: '',
            view: '',
            nature: '',

            childNodes: []
        }

        this.id = null
        this.status = CONST.PAGE_STATUS.DEFAULTS
    }

    async componentDidMount() {
        this.initPageStatus()
        await this.initMind()
    }

    initPageStatus() {
        const editId = window.sessionStorage['require-assist-detail-id']

        if (editId) {
            this.id = editId
            this.status = CONST.PAGE_STATUS.EDIT
        }

        window.sessionStorage['require-assist-detail-id'] = ''
    }

    async initMind() {
        const self = this

        await fetch.get({ url: 'mind/get/all', query: {} }).then(
            ({ data }) => { },
            error => { }
        )
    }

    updateHandle() { }

    closeHandle() { }

    initRandomHandle() { }

    editParentIdHandle() { }

    addHandle() { }

    initParentHandle() { }

    initNodeHandle() { }

    render() {
        const { title, content, timeSpan, view, nature, childNodes } = this.state

        return [
            <div className="mind flex-center">
                <div className="mind-container flex-start-top">

                    <div className="mind-content flex-rest">
                        <div className="title-input flex-center">
                            <input type="text" placeholder="请输入标题"
                                value={title}
                                onChange={({ target: { value } }) => this.setState({ title: value })}
                            />
                        </div>
                        <div className="edit-separation"></div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="请输入结论"
                                value={content}
                                style={{ height: 180 }}
                                onChange={({ target: { value } }) => this.setState({ content: value })}
                            ></textarea>
                        </div>
                        <div className="edit-separation"></div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="不同时间跨度如何看待?"
                                value={timeSpan}
                                onChange={({ target: { value } }) => this.setState({ timeSpan: value })}
                            ></textarea>
                        </div>
                        <div className="edit-separation"></div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="不同角度如何看待?"
                                value={view}
                                onChange={({ target: { value } }) => this.setState({ view: value })}
                            ></textarea>
                        </div>
                        <div className="edit-separation"></div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="深度追溯本质是什么?"
                                value={nature}
                                onChange={({ target: { value } }) => this.setState({ nature: value })}
                            ></textarea>
                        </div>

                    </div>

                    <div className="mind-operating">
                        <div className="mind-operating-container">

                            <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.updateHandle.bind(this)}
                                >更新当前需求</div>
                            </div>

                            <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.editParentIdHandle.bind(this)}
                                >修改当前id</div>
                            </div>

                            <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.closeHandle.bind(this)}
                                >追溯当前需求路径</div>
                            </div>

                            <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.addHandle.bind(this)}
                                >当前层级新增</div>
                            </div>

                            <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.initParentHandle.bind(this)}
                                >查看上一层</div>
                            </div>

                            <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.initRandomHandle.bind(this)}
                                >随机查看一条数据</div>
                            </div>

                            {childNodes.map((node, key) =>
                                <div className="mind-operating-item" key={key}>
                                    <div className="operating-item-container flex-center close-container noselect"
                                        onClick={() => this.initNodeHandle(node.id)}
                                    >查看子节点({node.title})</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ]
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
