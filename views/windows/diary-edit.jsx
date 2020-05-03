import fetch from './../../components/async-fetch/fetch.js';
import toast from './../../components/toast.js'
import { confirmPopUp } from './../../components/confirm-popup.js';
import TagComponent from './../../components/tag-selection/index.jsx';
import timeTransformers from './../../utils/time-transformers.js';

import CONST from './const.js';

class DiaryEditComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            situation: '',
            target: '',
            action: '',
            result: '',
            conclusion: '',
            tag: '',
            timestamp: new Date().getTime()
        }

        this.status = CONST.PAGE_EDIT_STATUS.DEFAULTS
        this.data = {}
        this.id = null

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth

    }

    async init(data) {
        if (!data) {
            this.status = CONST.PAGE_EDIT_STATUS.ADD
            return this.setState({
                title: '',
                situation: '',
                target: '',
                action: '',
                result: '',
                conclusion: '',
                tag: ''
            })
        }

        this.id = data.androidid
        this.data = JSON.parse(JSON.stringify({
            title: data.eventtitle,
            situation: data.eventsituation,
            target: data.eventtarget,
            action: data.eventaction,
            result: data.eventresult,
            conclusion: data.eventconclusion,
            tag: data.tag
        }))
        this.status = CONST.PAGE_EDIT_STATUS.EDIT
        this.setState({
            title: data.eventtitle,
            situation: data.eventsituation,
            target: data.eventtarget,
            action: data.eventaction,
            result: data.eventresult,
            conclusion: data.eventconclusion,
            tag: data.tag
        })
    }

    verifyEditDiff() {
        const { status } = this
        if (status !== CONST.PAGE_EDIT_STATUS.EDIT) return false

        const { title, situation, target, action, result, conclusion, tag } = this.state
        const data = this.data

        let isDiff = false
        if (title !== data.title) isDiff = true
        if (situation !== data.situation) isDiff = true
        if (target !== data.target) isDiff = true
        if (action !== data.action) isDiff = true
        if (result !== data.result) isDiff = true
        if (conclusion !== data.conclusion) isDiff = true
        if (tag !== data.tag) isDiff = true
        return isDiff
    }

    closeHandle() {
        const { title, situation, target, action, result, conclusion, timestamp, tag } = this.state
        const { status } = this
        const { editDiaryRecordCloseHandle } = this.props

        if (status === CONST.PAGE_EDIT_STATUS.ADD && !!!title && !!!result) return editDiaryRecordCloseHandle({ isUpdate: false });
        if (this.verifyEditDiff() === false) return editDiaryRecordCloseHandle({ isUpdate: false });

        confirmPopUp({
            title: '你确认要退出吗?',
            succeedHandle: () => editDiaryRecordCloseHandle({ isUpdate: true })
        })
    }

    addHandle() {
        const { editDiaryRecordCloseHandle } = this.props
        let { title, situation, target, action, result, conclusion, timestamp, tag } = this.state

        if (!title) title = timeTransformers.dateToYYYYmmDDhhMM(new Date())
        if (!situation) situation = '未知情况'
        if (!target) target = '漫无目的'
        if (!action) action = '迷之行动'
        if (!result) result = '无疾而终'

        const nowDate = timestamp ? new Date(+timestamp) : new Date()

        const fullyear = nowDate.getFullYear()
        const month = nowDate.getMonth() + 1
        const week = timeTransformers.getWeekInMonth(nowDate)

        fetch.post({
            url: 'android/event/add',
            body: {
                eventtitle: title,
                eventsituation: situation,
                eventtarget: target,
                eventaction: action,
                eventresult: result,
                eventconclusion: conclusion,
                tag,
                timestamp: nowDate.getTime(),
                fullyear,
                month,
                week
            }
        }).then(
            () => editDiaryRecordCloseHandle({ isUpdate: true }),
            error => { }
        )
    }

    editHandle() {
        const { editDiaryRecordCloseHandle } = this.props
        const { id } = this
        let { title, situation, target, action, result, conclusion, timestamp, tag } = this.state

        if (!title) title = timeTransformers.dateToYYYYmmDDhhMM(new Date())
        if (!situation) situation = '未知情况'
        if (!target) target = '漫无目的'
        if (!action) action = '迷之行动'
        if (!result) result = '无疾而终'

        const nowDate = timestamp ? new Date(+timestamp) : new Date()

        const fullyear = nowDate.getFullYear()
        const month = nowDate.getMonth() + 1
        const week = timeTransformers.getWeekInMonth(nowDate)

        fetch.post({
            url: 'android/event/edit',
            body: {
                androidid: id,
                eventtitle: title,
                eventsituation: situation,
                eventtarget: target,
                eventaction: action,
                eventresult: result,
                eventconclusion: conclusion,
                tag,
                timestamp: nowDate.getTime(),
                fullyear,
                month,
                week
            }
        }).then(
            res => editDiaryRecordCloseHandle({ isUpdate: true }),
            error => { }
        )
    }

    delHandle() {
        const { editDiaryRecordCloseHandle } = this.props
        const { id } = this

        const handle = () => fetch.post({
            url: 'android/recordevent/del',
            body: { androidid: id }
        }).then(
            res => editDiaryRecordCloseHandle({ isUpdate: true }),
            error => { }
        )

        confirmPopUp({
            title: `你确认要删除吗?`,
            succeedHandle: handle
        })
    }

    timeStampHandle() {
        const self = this
        const nowYear = new Date().getFullYear()
        const handle = data => self.setState({ timestamp: data })

        const datepicker = new Rolldate({
            el: '#picka-date',
            format: 'YYYY-MM-DD hh:mm',
            beginYear: nowYear,
            endYear: nowYear + 10,
            lang: { title: '当时时间?' },
            confirm: function confirm(date) {
                const timestamp = timeTransformers.YYYYmmDDhhMMToTimestamp(date)
                handle(timestamp)
            }
        })

        datepicker.show()
    }

    timeStampClearHandle() {
        document.getElementById('picka-date').value = ''
        this.setState({ timestamp: null });
    }

    selectTagHandle(tag) {
        this.setState({ tag })
    }

    render() {
        const self = this
        const { isShow } = this.props
        const { title, situation, target, action, result, conclusion, timestamp, tag } = this.state

        const { clientHeight, status } = this
        const minHeight = clientHeight - 46 - 26 - 52

        return [
            <div className="edit flex-center" style={!!!isShow ? { display: 'none' } : {}}>
                <div className="edit-container flex-start-top">
                    <div className="edit-operating flex-rest"
                        style={{ minHeight }}
                    >
                        <div className="title-input flex-center">
                            <input type="text" placeholder="简单描述/提问/归纳:"
                                value={title}
                                onChange={({ target: { value } }) => this.setState({ title: value })}
                            />
                        </div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="详细描述情况是什么"
                                style={{ height: (minHeight - 63 - 32) / 2, borderBottom: '1px solid #ddd' }}
                                value={situation}
                                onChange={({ target: { value } }) => this.setState({ situation: value })}
                            ></textarea>
                        </div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="得出什么结论"
                                style={{ height: (minHeight - 63 - 32) / 2 }}
                                value={conclusion}
                                onChange={({ target: { value } }) => this.setState({ conclusion: value })}
                            ></textarea>
                        </div>
                    </div>
                    <div className="edit-other">
                        <div className="edit-other-container"
                            style={{ minHeight }}
                        >
                            <div className="other-operating">
                                <div className="other-operating-container flex-center close-container noselect"
                                    onClick={this.closeHandle.bind(this)}
                                >关闭</div>
                            </div>
                            <div className="other-input">
                                <div class="edit-title">当时目标想法是什么?</div>
                                <div class="edit-input flex-start-center">
                                    <textarea className="content-textarea fiex-rest" type="text"
                                        placeholder="目标想法是什么"
                                        style={{ height: 140 }}
                                        value={target}
                                        onChange={({ target: { value } }) => this.setState({ target: value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="other-input">
                                <div class="edit-title">当时有啥行动?</div>
                                <div class="edit-input flex-start-center">
                                    <textarea className="content-textarea fiex-rest" type="text"
                                        placeholder="有啥行动"
                                        style={{ height: 140 }}
                                        value={action}
                                        onChange={({ target: { value } }) => this.setState({ action: value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="other-input">
                                <div class="edit-title">结果如何?</div>
                                <div class="edit-input flex-start-center">
                                    <textarea className="content-textarea fiex-rest" type="text"
                                        placeholder="结果如何"
                                        style={{ height: 240 }}
                                        value={result}
                                        onChange={({ target: { value } }) => this.setState({ result: value })}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="other-input">
                                <div class="edit-title">当时时间?</div>
                                <div class="edit-input flex-start-center">
                                    <input readonly type="text"
                                        id="picka-date"
                                        value={timestamp ? timeTransformers.dateToYYYYmmDDhhMM(new Date(+timestamp)) : ''}
                                        placeholder="时间?"
                                        onClick={this.timeStampHandle.bind(this)}
                                    />
                                    <div class="picka-clear flex-center"
                                        onClick={this.timeStampClearHandle.bind(this)}
                                    >取消</div>
                                </div>
                            </div>
                            <div className="other-input">
                                <div class="edit-title">请选择标签?</div>
                                <div class="edit-input">
                                    <div className="select-tag">
                                        <div className="select-tag-container flex-center"
                                            onClick={() => self.refs.tag.show()}
                                        >{tag ? tag : '请选择标签'}</div>
                                    </div>
                                </div>
                            </div>
                            {status === CONST.PAGE_EDIT_STATUS.ADD && <div className="other-operating">
                                <div className="other-operating-container flex-center noselect"
                                    onClick={this.addHandle.bind(this)}
                                >新增</div>
                            </div>}
                            {status === CONST.PAGE_EDIT_STATUS.EDIT && <div className="other-operating">
                                <div className="other-operating-container flex-center noselect"
                                    onClick={this.editHandle.bind(this)}
                                >编辑</div>
                            </div>}
                            {status === CONST.PAGE_EDIT_STATUS.EDIT && <div className="other-operating">
                                <div className="other-operating-container flex-center noselect"
                                    onClick={this.delHandle.bind(this)}
                                >删除</div>
                            </div>}
                        </div>
                    </div>
                </div>
            </div >,

            <TagComponent ref='tag'
                selectHandle={this.selectTagHandle.bind(this)}
            ></TagComponent>
        ]
    }
}

export default DiaryEditComponent
