import fetch from './../../components/async-fetch/fetch.js';
import toast from './../../components/toast.js'
import { confirmPopUp } from './../../components/confirm-popup.js';
import TagComponent from './../../components/tag-selection/index.jsx';
import timeTransformers from './../../utils/time-transformers.js';

import CONST from './const.js';

class RecordEditComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            title: '',
            material: '',
            record: '',
            tag: ''
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
                material: '',
                record: '',
                tag: ''
            })
        }

        this.id = data.androidid
        this.data = JSON.parse(JSON.stringify({
            title: data.recordtitle,
            material: data.recordmaterial,
            record: data.recordcontent,
            tag: data.tag
        }))
        this.status = CONST.PAGE_EDIT_STATUS.EDIT
        this.setState({
            title: data.recordtitle,
            material: data.recordmaterial,
            record: data.recordcontent,
            tag: data.tag
        })
    }

    verifyEditDiff() {
        const { status } = this
        if (status !== CONST.PAGE_EDIT_STATUS.EDIT) return false

        const { title, material, record, tag } = this.state
        const data = this.data

        let isDiff = false
        if (title !== data.title) isDiff = true
        if (material !== data.material) isDiff = true
        if (record !== data.record) isDiff = true
        if (tag !== data.tag) isDiff = true
        return isDiff
    }

    closeHandle() {
        const { title, material, record, tag } = this.state
        const { status } = this
        const { editDiaryRecordCloseHandle } = this.props

        if (status === CONST.PAGE_EDIT_STATUS.ADD && !!!title && !!!record) return editDiaryRecordCloseHandle({ isUpdate: false });
        if (this.verifyEditDiff() === false) return editDiaryRecordCloseHandle({ isUpdate: false });

        confirmPopUp({
            title: '你确认要退出吗?',
            succeedHandle: () => editDiaryRecordCloseHandle({ isUpdate: true })
        })
    }

    addHandle() {
        const { editDiaryRecordCloseHandle } = this.props
        let { title, material, record, tag } = this.state

        if (!title) title = timeTransformers.dateToYYYYmmDDhhMM(new Date())
        if (!record) return toast.show('内容不能为空');


        const nowDate = new Date()

        const timestamp = nowDate.getTime()
        const fullyear = nowDate.getFullYear()
        const month = nowDate.getMonth() + 1
        const week = timeTransformers.getWeekInMonth(nowDate)

        fetch.post({
            url: 'android/record/add',
            body: {
                recordtitle: title,
                recordmaterial: material,
                recordcontent: record,
                tag,
                timestamp,
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
        let { title, material, record, tag } = this.state

        if (!title) title = timeTransformers.dateToYYYYmmDDhhMM(new Date())
        if (!record) return toast.show('内容不能为空');

        fetch.post({
            url: 'android/record/edit',
            body: {
                androidid: id,
                recordtitle: title,
                recordmaterial: material,
                recordcontent: record,
                tag
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

    selectTagHandle(tag) {
        this.setState({ tag })
    }

    render() {
        const self = this
        const { isShow } = this.props
        const { title, material, record, tag } = this.state

        const { clientHeight, status } = this
        const minHeight = clientHeight - 46 - 26 - 52

        return [
            <div className="edit flex-center" style={!!!isShow ? { display: 'none' } : {}}>
                <div className="edit-container flex-start-top">
                    <div className="edit-operating flex-rest"
                        style={{ minHeight }}
                    >
                        <div className="title-input flex-center">
                            <input type="text" placeholder="简单描述/提问"
                                value={title}
                                onChange={({ target: { value } }) => this.setState({ title: value })}
                            />
                        </div>
                        <div className="content-input">
                            <textarea className="content-textarea fiex-rest" type="text"
                                placeholder="详细描述与记录是什么"
                                style={{ height: minHeight - 63 - 32 }}
                                value={record}
                                onChange={({ target: { value } }) => this.setState({ record: value })}
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
                                <div class="edit-title">灵感是什么?</div>
                                <div class="edit-input flex-start-center">
                                    <textarea className="content-textarea fiex-rest" type="text"
                                        placeholder="灵感是什么"
                                        style={{ height: 240 }}
                                        value={material}
                                        onChange={({ target: { value } }) => this.setState({ material: value })}
                                    ></textarea>
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
            </div>,

            <TagComponent ref='tag'
                selectHandle={this.selectTagHandle.bind(this)}
            ></TagComponent>
        ]
    }
}

export default RecordEditComponent
