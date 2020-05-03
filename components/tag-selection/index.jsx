import fetch from './../async-fetch/fetch.js'
import { inputPopUp, inputPopUpDestroy } from './../input-popup.js';
import { confirmPopUp } from './../confirm-popup.js';

import CONST from './const.js';

class TagComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: CONST.TAG.DEFAULTS,
            isShow: false
        }
    }

    async componentDidMount() {
        await this.initList()
    }

    async initList() {
        const self = this

        await fetch.get({
            url: 'android/recordevent/tag/get/',
            query: {}
        }).then(
            ({ data: { list } }) => self.setState({ list }),
            error => { }
        )
    }

    show() {
        this.setState({ isShow: true })
        this.initList()
    }

    hide() {
        this.setState({ isShow: false })
    }

    selectTagHandle(tag) {
        const { selectHandle } = this.props

        selectHandle(tag)
        this.hide()
    }

    addHandle() {
        const self = this

        const inputHandle = tag => {
            fetch.get({
                url: 'android/recordevent/tag/add',
                query: { tag }
            }).then(res => {
                self.initList()
                inputPopUpDestroy()
            }, error => inputPopUpDestroy())
        }

        inputPopUp({ title: '请输入新增标签', inputHandle })
    }

    delHandle(id) {
        const self = this

        const handle = () => fetch.get({
            url: 'android/recordevent/tag/del',
            query: { id }
        }).then(
            res => self.initList(),
            error => { }
        )

        confirmPopUp({
            title: `你确认要删除吗?`,
            succeedHandle: handle
        })
    }

    render() {
        const { isShow, list } = this.state

        return isShow ? (
            <div className="tag-selection">
                <div className="tag-add">
                    <div className="tag-add-container flex-center"
                        onClick={this.addHandle.bind(this)}
                    >新建分类</div>
                </div>

                <div className="tag-list">
                    <div className="list-item">
                        <div className="list-item-container flex-center"
                            onClick={() => this.selectTagHandle('all')}
                        >所有</div>
                    </div>
                    {list.map(({ tagname, tagid }, key) => (
                        <div className="list-item" key={key}>
                            <div className="list-item-container flex-start-center">
                                <div className="list-item-name flex-rest"
                                    onClick={() => this.selectTagHandle(tagname)}
                                >{tagname}</div>
                                <div className="list-item-del"
                                    onClick={() => this.delHandle(tagid)}
                                >删除</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ) : ''
    }
}

export default TagComponent
