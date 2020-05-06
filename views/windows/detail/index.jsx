import fetch from './../../../components/async-fetch/fetch.js';
import toast from './../../../components/toast.js'
import { confirmPopUp } from './../../../components/confirm-popup.js';
import { inputPopUp, inputPopUpDestroy } from './../../../components/input-popup.js';

import CONST from './const.js';

class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            id: null,
            title: '',
            content: '',
            timeSpan: CONST.PAGE_STATUS.DEFAULTS.timeSpan,
            view: CONST.PAGE_STATUS.DEFAULTS.view,
            nature: '',

            parent: null,
            childNodes: []
        }

        this.parentid = null
        this.parentTitle = null
        this.id = null
        this.status = CONST.PAGE_STATUS.DEFAULTS
        this.mind = CONST.MIND.DEFAULTS
    }

    async componentDidMount() {
        this.initPageStatus()
        await this.initMind()
    }

    initPageStatus() {
        const editId = window.sessionStorage['require-assist-detail-id']

        if (editId) {
            this.setState({ id: editId })
            this.id = editId
            this.status = CONST.PAGE_STATUS.EDIT
        }

        window.sessionStorage['require-assist-detail-id'] = ''
    }

    async initMind() {
        const self = this
        const { id, status } = this

        if (status !== CONST.PAGE_STATUS.EDIT) return this.initRandomHandle()

        await fetch.get({ url: 'mind/get/id', query: { id } }).then(
            ({ data: { childNodes, current, parent } }) => {
                self.mind = {
                    title: current.title,
                    content: current.content,
                    timeSpan: current.timeSpan,
                    view: current.view,
                    nature: current.nature
                }
                self.setState({
                    id,
                    title: current.title,
                    content: current.content,
                    timeSpan: current.timeSpan,
                    view: current.view,
                    nature: current.nature,
                    parent,
                    childNodes
                })
            },
            error => { }
        )
    }

    updateHandle() {
        const self = this
        const { title, content, timeSpan, view, nature } = this.state
        const { id, status } = this

        if (!title) return toast.show('标题不能为空');
        if (!content) return toast.show('内容不能为空');

        if (status !== CONST.PAGE_STATUS.EDIT) return
        if (this.verifyEditDiff() === false) return toast.show('没有数据改变')

        fetch.post({
            url: 'mind/edit/id',
            body: { id, title, content, timeSpan, view, nature }
        }).then(
            res => {
                self.mind = { title, content, timeSpan, view, nature }
                toast.show('更新成功')
            },
            error => { }
        )
    }

    verifyEditDiff() {
        const { status } = this
        if (status !== CONST.PAGE_STATUS.EDIT) return false

        const { title, content, timeSpan, view, nature } = this.state
        const mind = this.mind

        let isDiff = false
        if (title !== mind.title) isDiff = true
        if (content !== mind.content) isDiff = true
        if (timeSpan !== mind.timeSpan) isDiff = true
        if (view !== mind.view) isDiff = true
        if (nature !== mind.nature) isDiff = true
        return isDiff
    }

    closeHandle() {
        const { title, content, timeSpan, view, nature } = this.state
        const { id, status } = this
        const colse = () => {
            window.sessionStorage.setItem('require-assist-detail-id', id)
            window.history.back(-1)
        }

        if (status === CONST.PAGE_STATUS.ADD && !!!title && !!!content && !!!timeSpan && !!!view && !!!nature) return colse();
        if (this.verifyEditDiff() === false) return colse();

        confirmPopUp({
            title: `数据未保存, 你确认要退出吗?`,
            succeedHandle: colse
        })
    }

    async initRandomHandle() {
        const self = this

        await fetch.get({ url: 'mind/get/random', query: {} }).then(
            ({ data: { childNodes, current, parent } }) => {
                self.id = current.id
                self.status = CONST.PAGE_STATUS.EDIT
                self.mind = {
                    title: current.title,
                    content: current.content,
                    timeSpan: current.timeSpan,
                    view: current.view,
                    nature: current.nature
                }
                self.setState({
                    id: current.id,
                    title: current.title,
                    content: current.content,
                    timeSpan: current.timeSpan,
                    view: current.view,
                    nature: current.nature,
                    parent,
                    childNodes
                })
            },
            error => { }
        )
    }

    editParentIdHandle() {
        const { id } = this
        const self = this

        const inputHandle = async newParentId => {
            await fetch.post({
                url: 'mind/edit/parent/id',
                body: {
                    newParentId,
                    oldId: id
                }
            }).then(
                () => {
                    self.initMind()
                    toast.show('更新成功')
                    inputPopUpDestroy()
                },
                error => { }
            )
        }

        inputPopUp({
            title: '请输要修改的节点, 或节点的别名?',
            inputHandle,
            mustInput: false,
            defaultValue: id
        })
    }

    saveAddHandle() {
        const self = this
        const { title, content, timeSpan, view, nature } = this.state
        const { parentid, parentTitle } = this

        if (!title) return toast.show('标题不能为空');
        if (!content) return toast.show('内容不能为空');

        const handle = () => {
            fetch.post({
                url: 'mind/add/parentid',
                body: { parentid, title, content, timeSpan, view, nature }
            }).then(
                ({ data }) => {
                    self.id = data.id
                    self.status = CONST.PAGE_STATUS.EDIT
                    self.initMind()
                },
                error => { }
            )
        }

        confirmPopUp({
            title: `你确定要保存到{${parentTitle}}吗?`,
            succeedHandle: handle
        })
    }

    creatNewHandle() {
        const { id } = this
        const { title } = this.state
        this.parentid = +id
        this.parentTitle = title
        this.id = null
        this.mind = CONST.MIND.DEFAULTS
        this.status = CONST.PAGE_STATUS.ADD
        this.setState({
            id: null,
            title: '',
            content: '',
            timeSpan: CONST.MIND.DEFAULTS.timeSpan,
            view: CONST.MIND.DEFAULTS.view,
            nature: '',
            parent: null,
            childNodes: []
        })
    }

    initParentHandle() { }

    initNodeHandle() { }

    delNodeHandle() { }

    render() {
        const { id, title, content, timeSpan, view, nature, parent, childNodes } = this.state
        const { status } = this

        return [
            <div className="mind flex-center">
                <div className="mind-container flex-start-top">

                    <div className="mind-content flex-rest">
                        <div className="title-input flex-start-center">
                            <input type="text" placeholder="请输入标题"
                                value={title}
                                onChange={({ target: { value } }) => this.setState({ title: value })}
                            />
                            {id && <div className="title-id">{id}</div>}
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

                            {status === CONST.PAGE_STATUS.EDIT && <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.closeHandle.bind(this)}
                                >追溯当前需求路径</div>
                            </div>}

                            {status === CONST.PAGE_STATUS.ADD && <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.saveAddHandle.bind(this)}
                                >保存</div>
                            </div>}

                            {status === CONST.PAGE_STATUS.EDIT && <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.updateHandle.bind(this)}
                                >更新当前需求</div>
                            </div>}

                            {status === CONST.PAGE_STATUS.EDIT && <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.editParentIdHandle.bind(this)}
                                >修改当前id</div>
                            </div>}

                            {status === CONST.PAGE_STATUS.EDIT && <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.creatNewHandle.bind(this)}
                                >新增(在当前层级)</div>
                            </div>}

                            {status === CONST.PAGE_STATUS.EDIT && parent && <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.initParentHandle.bind(this)}
                                >查看上一层({parent.title})</div>
                            </div>}

                            <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.initRandomHandle.bind(this)}
                                >随机查看一条数据</div>
                            </div>

                            {status === CONST.PAGE_STATUS.EDIT && childNodes.length === 0 && <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.delNodeHandle.bind(this)}
                                >删除当前需求</div>
                            </div>}

                            {status === CONST.PAGE_STATUS.EDIT && childNodes.map((node, key) =>
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
