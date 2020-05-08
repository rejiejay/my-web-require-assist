import toast from './toast.js';
import { createRandomStr } from './../utils/string-handle.js';

class PaginationComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = { jumpPredictPageNo: null }
    }

    pageNoChangeHandle(newPageNo) {
        const { handle } = this.props
        handle && handle(newPageNo)
    }

    previousPageHandle() {
        const { pageNo } = this.props
        if (pageNo <= 1) return false

        this.pageNoChangeHandle(pageNo - 1)
    }

    nextPageHandle() {
        const { pageNo, pageTotal } = this.props
        if (pageNo >= pageTotal) return false

        this.pageNoChangeHandle(pageNo + 1)
    }

    renderPaginationSelected() {
        const self = this
        const { pageNo, pageTotal } = this.props

        const renderByArray = pages => pages.map(thisNo => <div key={`pageNo${thisNo}${createRandomStr({ length: 4 })}`}
            className={`list-pagination-item ${pageNo === thisNo ? 'pagination-item-selected' : ''}`}
            onClick={() => self.pageNoChangeHandle(thisNo)}
        >{thisNo}</div>)

        if (pageTotal < 9) return renderByArray(Array.from({ length: pageTotal }).map((item, index) => (index + 1)))

        /** 含义: 这以下的情况 是 页码大于9的情况 */
        const back5PageCount = pageTotal - 5

        const firstPage = <div className="list-pagination-item" key={`${createRandomStr({ length: 16 })}`}
            onClick={() => self.pageNoChangeHandle(1)}
        >1</div>

        const lastPage = <div className="list-pagination-item" key={`${createRandomStr({ length: 16 })}`}
            onClick={() => self.pageNoChangeHandle(pageTotal)}
        >{pageTotal}</div>

        const pointIcon = key => <div className="list-pagination-point" key={key ? `point${key}` : 'point'}>...</div>

        if (pageNo < 5) {
            /** 含义: 页码小于5 显示1~5/.../最后一页 */
            let pagination = renderByArray(Array.from({ length: 5 }).map((item, index) => (index + 1)))

            pagination.push(pointIcon())
            pagination.push(lastPage)

            return pagination
        } else if (pageNo > back5PageCount) {
            /** 含义: 页码倒数6页 显示1页/.../最后5页 */
            let pagination = [firstPage]
            pagination.push(pointIcon())

            const back6PageCount = back5PageCount - 1
            pagination = pagination.concat(renderByArray(Array.from({ length: 6 }).map((item, index) => (back6PageCount + index + 1))))

            return pagination
        } else {
            /** 含义: 显示当前页码5前后5页码的数据 */
            let pagination = [firstPage]
            pagination.push(pointIcon(1))

            pagination = pagination.concat(renderByArray(Array.from({ length: 5 }).map((item, index) => (pageNo - 2 + index))))

            pagination.push(pointIcon(2))
            pagination.push(lastPage)

            return pagination
        }
    }

    jumpPageNoInputHandle({ target: { value } }) {
        if (/^[1-9]\d*$/.test(value)) { /** 含义: 正整数(不包括0) */
            this.setState({ jumpPredictPageNo: value })
        } else {
            this.setState({ jumpPredictPageNo: 1 })
        }
    }

    jumpPageNoInputConfirm() {
        const { jumpPredictPageNo } = this.state
        if (/^[1-9]\d*$/.test(jumpPredictPageNo)) {
            this.pageNoChangeHandle(jumpPredictPageNo)
        } else {
            toast.show('你输入的数字不合法')
            this.setState({ jumpPredictPageNo: 1 })
        }
    }

    render() {
        const { jumpPredictPageNo } = this.state

        return <div class="rejiejay-pagination flex-start-center">

            <div className="list-pagination-item list-pagination-left flex-center"
                onClick={this.previousPageHandle.bind(this)/** 上一页 */}
            >
                <svg viewBox="64 64 896 896" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
            </div>

            {this.renderPaginationSelected.call(this)/** 渲染所有页码 */}

            <div className="list-pagination-item list-pagination-right flex-center"
                onClick={this.nextPageHandle.bind(this)/** 下一页 */}
            >
                <svg viewBox="64 64 896 896" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
            </div>

            <div className="list-pagination-input flex-start-center">
                <div className="pagination-input-container">
                    <input
                        value={jumpPredictPageNo}
                        onChange={this.jumpPageNoInputHandle.bind(this)}
                    />
                </div>
                <div className="pagination-input-submit" onClick={this.jumpPageNoInputConfirm.bind(this)}>跳转</div>
            </div>
        </div>
    }
}

export default PaginationComponent
