import login from './../../components/login.js';

import SearchComponent from './search.jsx';
import ListComponent from './list.jsx';
import DiaryEditComponent from './diary-edit.jsx';
import RecordEditComponent from './record-edit.jsx';
import CONST from './const.js';

class MainComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            pageStatus: CONST.PAGE_STATUS.DEFAULTS,
            searchInput: null
        }
    }

    async componentDidMount() {
        await login()
        await this.refs.list.init()
    }

    clearSearch() {
        this.setState({ searchInput: null, pageStatus: CONST.PAGE_STATUS.LIST })
    }

    async searchHandle({ target: { value } }) {
        if (!!!value) return this.clearSearch()
        const pageStatus = CONST.PAGE_STATUS.SEARCH
        const searchInput = value
        await this.refs.search.init(searchInput)
        this.setState({ searchInput, pageStatus })
    }

    selectedDiaryRecordHandle(data) {
        const { type } = data
        if (type === 'record') {
            this.setState({ pageStatus: CONST.PAGE_STATUS.RECORD_EDIT })
            this.refs.editRecord.init(data)
        }

        if (type === 'event') {
            this.setState({ pageStatus: CONST.PAGE_STATUS.DIARY_EDIT })
            this.refs.editDiary.init(data)
        }

        if (type === 'record-add') {
            this.setState({ pageStatus: CONST.PAGE_STATUS.RECORD_EDIT })
            this.refs.editRecord.init()
        }

        if (type === 'event-add') {
            this.setState({ pageStatus: CONST.PAGE_STATUS.DIARY_EDIT })
            this.refs.editDiary.init()
        }
    }

    editDiaryRecordCloseHandle({ isUpdate }) {
        this.setState({ pageStatus: CONST.PAGE_STATUS.LIST })
        !!isUpdate ? this.refs.list.init() : null
    }

    render() {
        const { pageStatus } = this.state

        return [
            <div className="headder flex-start-center noselect">
                <div className="headder-filter hover-item">过滤条件</div>

                <div className="search flex-rest">
                    <div className="search-container flex-start-center">
                        <svg className="search-icon" width="16" height="16" t="1583588302175" viewBox="0 0 1028 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1192">
                            <path d="M1007.548064 899.256487L801.043871 692.754294c-3.577986-3.577986-8.032969-5.329979-12.194952-8.032969C908.82345 515.091988 893.926508 279.233909 742.042101 127.349503c-169.701337-169.775337-444.918262-169.775337-614.692598 0-169.775337 169.701337-169.775337 444.845262 0 614.692598 153.5634 153.5644 392.635466 166.708349 562.701801 42.498834 2.701989 3.869985 4.380983 8.104968 7.73997 11.536955L904.296468 1002.582084c28.624888 28.551888 74.773708 28.551888 103.252596 0 28.477889-28.623888 28.477889-74.846708 0-103.324597zM655.074441 654.927442c-121.653525 121.654525-318.884754 121.654525-440.611279 0-121.653525-121.652525-121.653525-318.956754 0-440.610279s318.884754-121.653525 440.611279 0c121.726525 121.726525 121.726525 318.957754 0 440.611279z" p-id="1193"></path>
                        </svg>
                        <div className="search-input flex-rest">
                            <input type="text" placeholder="输入结论关键字搜索..."
                                onChange={this.searchHandle.bind(this)}
                            />
                        </div>
                        <svg className="cancel-icon" width="16" height="16" t="1583588453664" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2562"
                            onClick={this.clearSearch.bind(this)}
                        >
                            <path d="M512 992a484.4 484.4 0 0 1-191.856-39.824 36.32 36.32 0 0 1 28.96-66.608 409.248 409.248 0 1 0-173.024-143.344 36.448 36.448 0 0 1-60.096 41.264A480.112 480.112 0 1 1 512 992z" p-id="2563"></path>
                            <path d="M373.2 686.208a37.488 37.488 0 0 1-26.592-11.088 37.936 37.936 0 0 1 0-52.464l279.28-275.584a37.104 37.104 0 1 1 52.464 52.464L399.072 675.12a35.84 35.84 0 0 1-25.872 11.088z" p-id="2564"></path>
                            <path d="M662 686.192a34.656 34.656 0 0 1-25.856-11.088L360.56 399.52a37.104 37.104 0 0 1 52.464-52.464l275.584 275.584a36.576 36.576 0 0 1 0 52.464 37.488 37.488 0 0 1-26.608 11.088z" p-id="2565"></path>
                        </svg>
                    </div>
                </div>

                <div className="fast-operating flex-start-center">
                    <div className="operat-item hover-item"
                        onClick={() => this.selectedDiaryRecordHandle({ type: 'event-add' })}
                    >新增日记</div>
                    <div className="operat-item hover-item"
                        onClick={() => this.selectedDiaryRecordHandle({ type: 'record-add' })}
                    >新增记录</div>
                </div>
            </div >,

            <div className="content-container-area">
                <ListComponent
                    ref="list"
                    isShow={pageStatus === CONST.PAGE_STATUS.DEFAULTS || pageStatus === CONST.PAGE_STATUS.LIST}
                    selectedDiaryRecordHandle={this.selectedDiaryRecordHandle.bind(this)}
                ></ListComponent>
                <SearchComponent
                    ref="search"
                    isShow={pageStatus === CONST.PAGE_STATUS.SEARCH}
                    selectedDiaryRecordHandle={this.selectedDiaryRecordHandle.bind(this)}
                ></SearchComponent>
                <DiaryEditComponent
                    ref="editDiary"
                    isShow={pageStatus === CONST.PAGE_STATUS.DIARY_EDIT}
                    editDiaryRecordCloseHandle={this.editDiaryRecordCloseHandle.bind(this)}
                ></DiaryEditComponent>
                <RecordEditComponent
                    ref="editRecord"
                    isShow={pageStatus === CONST.PAGE_STATUS.RECORD_EDIT}
                    editDiaryRecordCloseHandle={this.editDiaryRecordCloseHandle.bind(this)}
                ></RecordEditComponent>
            </div>,

            <div class="copyright-component"><div class="copyright-describe">粤ICP备17119404号 Copyright © Rejiejay曾杰杰</div></div>
        ]
    }
}

window.onload = () => ReactDOM.render(<MainComponent />, document.body);
