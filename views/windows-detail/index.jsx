import fetch from './../../components/async-fetch/fetch.js';
import toast from './../../components/toast.js'
import { confirmPopUp } from './../../components/confirm-popup.js';
import { inputPopUp, inputPopUpDestroy } from './../../components/input-popup.js';
import { dropDownSelectPopup, dropDownSelectPopupDestroy } from './../../components/drop-down-select-popup.js';
import jsonHandle from './../../utils/json-handle.js';

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
            childNodes: [],

            isShowMultifunction: true
        }

        this.newParentid = null
        this.newParentTitle = null
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
        const { newParentid, newParentTitle } = this

        if (!title) return toast.show('标题不能为空');
        if (!content) return toast.show('内容不能为空');

        const handle = () => {
            fetch.post({
                url: 'mind/add/parentid',
                body: { parentid: newParentid, title, content, timeSpan, view, nature }
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
            title: `你确定要保存到{${newParentTitle}}吗?`,
            succeedHandle: handle
        })
    }

    creatNewHandle() {
        const { id } = this
        const { title } = this.state
        this.newParentid = +id
        this.newParentTitle = title
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

    initParentHandle() {
        const { parent } = this.state

        this.id = +parent.id
        this.status = CONST.PAGE_STATUS.EDIT
        this.initMind()
    }

    initNodeHandle(id) {
        this.id = +id
        this.status = CONST.PAGE_STATUS.EDIT
        this.initMind()
    }

    delNodeHandle() {
        const self = this
        const { id } = this

        const handle = () => {
            fetch.post({
                url: 'mind/del/id',
                body: { id }
            }).then(
                () => self.initRandomHandle(),
                error => { }
            )
        }

        confirmPopUp({
            title: `你确定要删除吗?`,
            succeedHandle: handle
        })
    }

    renderConclusion() {
        const { content, isShowMultifunction } = this.state
        const self = this
        const result = jsonHandle.verifyJSONString({ jsonString: content })
        const isMultifunction = result => {
            if (!result.isCorrect) return false
            if (!isShowMultifunction) return false
            if (!!result.data && !!result.data.content) return true
            return false
        }

        if (isMultifunction(result) === false) return [
            <div className="edit-mind-description multi-function flex-start">
                <div className="flex-rest">策略结论</div>
                {result.isCorrect && <div className="multi-function-add"
                    onClick={() => self.setState({ isShowMultifunction: true })}
                >展示JSON</div>}
                {!result.isCorrect && <div className="multi-function-add"
                    onClick={() => self.setState({ content: `{"content": "${content}"}` })}
                >展示JSON</div>}
            </div>,
            <div className="content-input">
                <textarea className="content-textarea fiex-rest" type="text"
                    placeholder="请输入结论"
                    value={content}
                    style={{ height: 180 }}
                    onChange={({ target: { value } }) => this.setState({ content: value })}
                ></textarea>
            </div>
        ]

        const contentObj = result.data
        const delMultiItem = index => {
            const handle = () => {
                contentObj.child.splice(index, 1)
                self.setState({ content: JSON.stringify(contentObj) })
            }

            confirmPopUp({
                title: `你确定要删除吗?`,
                succeedHandle: handle
            })
        }
        const addMultiItem = () => {
            const inputHandle = multiContent => {
                const multiItem = CONST.MULTI_FUNCTION_ITEM.DEFAULTS
                multiItem.content = multiContent

                if (!!contentObj.child && contentObj instanceof Array) {
                    contentObj.child.push(multiItem)
                } else {
                    contentObj.child = [multiItem]
                }

                self.setState({ content: JSON.stringify(contentObj) })

                inputPopUpDestroy()
            }

            inputPopUp({
                title: '请输要新增的结论',
                inputHandle,
                mustInput: false
            })
        }
        const changeMultiItemHandle = (value, index) => {
            contentObj.child[index].content = value
            self.setState({ content: JSON.stringify(contentObj) })
        }

        const jumpMultiItem = index => window.location.href = contentObj.child[index].bindUrl

        const bindUrlMultiItem = index => {
            const bindUrl = contentObj.child[index].bindUrl
            const inputHandle = url => {
                contentObj.child[index].bindUrl = url
                self.setState({ content: JSON.stringify(contentObj) })
                inputPopUpDestroy()
            }
            let popupConfiguration = {
                title: '请输要绑定的链接',
                inputHandle,
                mustInput: false
            }
            const dropDownSelectHandle = ({ value, label }) => {
                if (value === CONST.MULTI_FUNCTION_BIND_URL_TYPE.MIND.value) {
                    popupConfiguration.defaultValue = `${CONST.MULTI_FUNCTION_BIND_URL_TYPE.MIND.url}?id=`
                }
                if (value === CONST.MULTI_FUNCTION_BIND_URL_TYPE.TASK.value) {
                    /** Need todo */
                    popupConfiguration.defaultValue = `${CONST.MULTI_FUNCTION_BIND_URL_TYPE.TASK.url}?id=`
                }
                dropDownSelectPopupDestroy()
                inputPopUp(popupConfiguration)
            }

            /**
             * 含义: 存在 url 则直接输入
             */
            if (bindUrl) {
                popupConfiguration.defaultValue = bindUrl
                inputPopUp(popupConfiguration)
            } else {
                dropDownSelectPopup({
                    list: [
                        CONST.MULTI_FUNCTION_BIND_URL_TYPE.MIND,
                        CONST.MULTI_FUNCTION_BIND_URL_TYPE.TASK
                    ],
                    handle: dropDownSelectHandle,
                    mustInput: false
                })
            }
        }

        const renderMultiItem = () => {
            if (!contentObj || !contentObj.child) return null
            const list = contentObj.child

            return list.map((item, key) => <div className="multi-function-item flex-start-center" key={key}>
                <input type="text" placeholder="请输入策略"
                    value={item.content}
                    onChange={({ target: { value } }) => changeMultiItemHandle(value, key)}
                />
                {!!item.bindUrl && <div className="multifunction-item-jump flex-center"
                    onClick={() => jumpMultiItem(key)}
                >跳转</div>}
                <div className="multifunction-item-bind flex-center"
                    onClick={() => bindUrlMultiItem(key)}
                >bindUrl</div>
                <div className="multifunction-item-del flex-center"
                    onClick={() => delMultiItem(key)}
                >删除</div>
            </div>)
        }

        return [
            <div className="edit-mind-description multi-function flex-start">
                <div className="flex-rest">策略结论</div>
                <div className="multi-function-add"
                    onClick={addMultiItem}
                >新增</div>
                <div className="multi-function-add"
                    onClick={() => self.setState({ isShowMultifunction: false })}
                >隐藏JSON</div>
            </div>,
            renderMultiItem(),
            <div className="content-input">
                <textarea className="content-textarea fiex-rest" type="text"
                    placeholder="请输入结论"
                    value={contentObj.content}
                    style={{ height: 180 }}
                    onChange={({ target: { value } }) => this.setState({ content: value })}
                ></textarea>
            </div>
        ]
    }

    render() {
        const { id, title, timeSpan, view, nature, parent, childNodes } = this.state
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
                        {this.renderConclusion.call(this)}
                        <div className="edit-separation"></div>
                        <div className="edit-mind-description">时间跨度考量</div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="不同时间跨度如何看待?"
                                value={timeSpan}
                                onChange={({ target: { value } }) => this.setState({ timeSpan: value })}
                            ></textarea>
                        </div>
                        <div className="edit-separation"></div>
                        <div className="edit-mind-description">多角度思考</div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="不同角度如何看待?"
                                value={view}
                                onChange={({ target: { value } }) => this.setState({ view: value })}
                            ></textarea>
                        </div>
                        <div className="edit-separation"></div>
                        <div className="edit-mind-description">深度思考</div>
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

                            <div className="mind-operating-title">操作区域</div>
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

                            {status === CONST.PAGE_STATUS.EDIT && childNodes.length === 0 && <div className="mind-operating-item">
                                <div className="operating-item-container flex-center close-container noselect"
                                    onClick={this.delNodeHandle.bind(this)}
                                >删除当前需求</div>
                            </div>}

                            <div className="mind-operating-title">层级区域</div>

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

                            {status === CONST.PAGE_STATUS.EDIT && childNodes.map((node, key) =>
                                <div className="mind-operating-item" key={key}>
                                    <div className="operating-item-container flex-center close-container noselect"
                                        onClick={() => this.initNodeHandle(+node.id)}
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
