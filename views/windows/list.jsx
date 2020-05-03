import fetch from './../../components/async-fetch/fetch.js';
import PaginationComponent from './../../components/pagination.jsx';

import CONST from './const.js';

class ListComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [
                /** CONST.TASK.DEMO */
            ],
            pageNo: 1,
            pageSize: 10,
            count: 1,

            selectedTaskId: null
        }

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    async init() {
        await this.initList()
    }

    async initList() {
        const self = this
        const { pageNo } = this.state

        await fetch.get({
            url: 'android/recordevent/list',
            query: {
                sort: 'time',
                type: 'all',
                pageNo
            }
        }).then(
            ({ data: { list, total } }) => self.setState({
                list,
                count: total
            }),
            error => { }
        )
    }

    pageNoChangeHandle(newPageNo) {
        this.setState(
            { pageNo: newPageNo },
            this.initList
        )
    }

    selectedTaskHandle(data) {
        const { androidid } = data
        const { selectedTaskId } = this.state
        if (androidid !== selectedTaskId) return this.setState({ selectedTaskId: androidid });
        this.props.selectedDiaryRecordHandle(data)
    }

    render() {
        const self = this
        const { list, pageNo, pageSize, count, selectedTaskId } = this.state
        const { isShow } = this.props
        const { clientHeight } = this
        let style = { minHeight: (clientHeight - 46 - 26 - 52) }
        !!!isShow ? style.display = 'none' : '';

        const renderDescription = ({ androidid, type, recordtitle, eventtitle, recordcontent, eventresult }) => {
            if (type === 'record') {
                if (selectedTaskId === androidid) return recordcontent
                return recordtitle
            }

            if (type === 'event') {
                if (selectedTaskId === androidid) return eventresult
                return eventtitle
            }
        }

        return [
            <div className="list flex-column-center" style={style} >
                <div className="task-container flex-rest flex-column-center">
                    <div className="task-float noselect">{list.map((data, key) => <div className={`task-item ${selectedTaskId === data.androidid ? 'task-item-selected' : ''}`} key={key}>
                        <div className="task-item-container"
                            onClick={() => self.selectedTaskHandle(data)}
                        >{renderDescription(data)}</div>
                    </div>
                    )}</div>
                </div>
                <div className="pagination flex-center">
                    <PaginationComponent
                        pageNo={pageNo}
                        pageTotal={Math.ceil(count / pageSize)}
                        handle={this.pageNoChangeHandle.bind(this)}
                    ></PaginationComponent>
                </div>
            </div>
        ]
    }
}

export default ListComponent
