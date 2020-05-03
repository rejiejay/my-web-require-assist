import fetch from './../../components/async-fetch/fetch.js'
import toast from './../../components/toast.js'
import timeTransformers from './../../utils/time-transformers.js';
import jsonHandle from './../../utils/json-handle.js';
import { confirmPopUp } from './../../components/confirm-popup.js';
import TagComponent from './../../components/tag-selection/index.jsx';

import CONST from './const.js';

class MainComponent extends React.Component {
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

        this.status = CONST.PAGE_STATUS.DEFAULTS
        this.id = null
    }

    async componentDidMount() {
        this.initPageStatus()
    }

    initPageStatus() {
        const editStr = window.sessionStorage['rejiejay-diary-system-diary-edit']
        window.sessionStorage['rejiejay-diary-system-diary-edit'] = ''

        if (editStr && editStr !== 'null') {

            const editVerify = jsonHandle.verifyJSONString({ jsonString: editStr })

            if (editVerify.isCorrect) {
                const { id, title, situation, target, action, result, conclusion, tag, timestamp } = editVerify.data
                this.id = id
                this.status = CONST.PAGE_STATUS.EDIT
                this.setState({ title, situation, target, action, result, conclusion, tag })
            }

        } else {
            this.status = CONST.PAGE_STATUS.ADD
        }
    }

    saveHandle() {
        const self = this
        let {
            title,
            situation,
            target,
            action,
            result,
            conclusion,
            tag,
            timestamp
        } = this.state

        if (!title) title = timeTransformers.dateToYYYYmmDDhhMM(new Date())
        if (!situation) situation = '未知情况'
        if (!target) target = '漫无目的'
        if (!action) action = '迷之行动'
        if (!result) return toast.show('结果不能为空');

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
            () => window.location.replace('./../index.html'),
            error => { }
        )
    }

    editHandle() {
        const self = this
        const { id } = this
        let {
            title,
            situation,
            target,
            action,
            result,
            conclusion,
            tag,
            timestamp
        } = this.state

        if (!title) title = timeTransformers.dateToYYYYmmDDhhMM(new Date())
        if (!situation) situation = '未知情况'
        if (!target) target = '漫无目的'
        if (!action) action = '迷之行动'
        if (!result) return toast.show('结果不能为空');

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
            () => window.location.replace('./../index.html'),
            error => { }
        )
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

    deleteHandle() {
        const { id } = this

        const handle = () => fetch.post({
            url: 'android/recordevent/del',
            body: { androidid: id }
        }).then(
            () => window.location.replace('./../index.html'),
            error => { }
        )

        confirmPopUp({
            title: `确认要解除删除?`,
            succeedHandle: handle
        })
    }

    render() {
        const self = this
        let {
            title,
            situation,
            target,
            action,
            result,
            conclusion,
            tag,
            timestamp
        } = this.state

        const status = this.status

        return [
            <div class="edit">
                <div class="edit-title edit-required">*简单描述/提问/归纳:</div>
                <div class="edit-input flex-start-center">
                    <input type="text" placeholder="标题"
                        value={title}
                        onChange={({ target: { value } }) => this.setState({ title: value })}
                    />
                </div>

                <div class="edit-title">情况是什么?</div>
                <div class="edit-input flex-start-center">
                    <textarea rows="5" type="text" placeholder="情况"
                        value={situation}
                        onChange={({ target: { value } }) => this.setState({ situation: value })}
                    ></textarea>
                </div>

                <div class="edit-title">目标想法是什么?</div>
                <div class="edit-input flex-start-center">
                    <textarea rows="5" type="text" placeholder="目标"
                        value={target}
                        onChange={({ target: { value } }) => this.setState({ target: value })}
                    ></textarea>
                </div>

                <div class="edit-title">有啥行动?</div>
                <div class="edit-input flex-start-center">
                    <textarea rows="5" type="text" placeholder="行动"
                        value={action}
                        onChange={({ target: { value } }) => this.setState({ action: value })}
                    ></textarea>
                </div>

                <div class="edit-title">结果如何?</div>
                <div class="edit-input flex-start-center">
                    <textarea rows="5" type="text" placeholder="结果"
                        value={result}
                        onChange={({ target: { value } }) => this.setState({ result: value })}
                    ></textarea>
                </div>

                <div class="edit-title">得出什么结论?</div>
                <div class="edit-input flex-start-center">
                    <textarea rows="5" type="text" placeholder="结论"
                        value={conclusion}
                        onChange={({ target: { value } }) => this.setState({ conclusion: value })}
                    ></textarea>
                </div>

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

                <div className="select-tag">
                    <div className="select-tag-container flex-center"
                        onClick={() => self.refs.tag.show()}
                    >{tag ? tag : '请选择标签'}</div>
                </div>
            </div>,

            <div class="operation">
                <div class="operation-container flex-start-center">
                    {status === CONST.PAGE_STATUS.ADD && [
                        <div class="vertical-line"></div>,
                        <div class="operation-button flex-center flex-rest"
                            onClick={this.saveHandle.bind(this)}
                        >保存</div>
                    ]}
                    {status === CONST.PAGE_STATUS.EDIT && [
                        <div class="vertical-line"></div>,
                        <div class="operation-button flex-center flex-rest"
                            onClick={this.editHandle.bind(this)}
                        >修改</div>
                    ]}
                    {status === CONST.PAGE_STATUS.EDIT && [
                        <div class="vertical-line"></div>,
                        <div class="operation-button flex-center flex-rest"
                            onClick={this.deleteHandle.bind(this)}
                        >删除</div>
                    ]}
                    <div class="vertical-line"></div>
                    <div class="operation-button flex-center flex-rest"
                        onClick={() => window.location.replace('./../index.html')}
                    >取消</div>
                </div>
            </div>,

            <TagComponent ref='tag'
                selectHandle={this.selectTagHandle.bind(this)}
            ></TagComponent>
        ]
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
