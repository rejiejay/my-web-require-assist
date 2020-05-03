import fetch from './../../components/async-fetch/fetch.js';

import CONST from './const.js';

class SearchComponent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: [
                /** CONST.TASK.DEMO */
            ],
            selectedTaskId: null
        }

        this.clientHeight = document.body.offsetHeight || document.documentElement.clientHeight || window.innerHeight
        this.clientWidth = document.body.offsetWidth || document.documentElement.clientWidth || window.innerWidth
    }

    selectedTaskHandle(data) {
        const { androidid } = data
        const { selectedTaskId } = this.state
        if (androidid !== selectedTaskId) return this.setState({ selectedTaskId: androidid });
        this.props.selectedDiaryRecordHandle(data)
    }

    async init(searchString) {
        const self = this
        let query = { search: searchString }

        await fetch.get({ url: 'null', query }).then(
            ({ data }) => self.setState({ list: data }),
            error => { }
        )
    }

    render() {
        const self = this
        const { list, selectedTaskId } = this.state
        const { isShow } = this.props
        const { clientHeight } = this
        let style = { minHeight: (clientHeight - 46 - 26 - 52) }
        !!!isShow ? style.display = 'none' : '';

        return [
            <div className="search flex-column-center" style={style}>
                <div className="task-container flex-rest flex-column-center">
                    <div className="task-float noselect">{list.map((data, key) => <div className={`task-item ${selectedTaskId === data.androidid ? 'task-item-selected' : ''}`} key={key}>
                        <div className="task-item-container"
                            onClick={() => self.selectedTaskHandle(data)}
                        >{renderDescription(data)}</div>
                    </div>
                    )}</div>
                </div>
            </div>
        ]
    }
}

export default SearchComponent
