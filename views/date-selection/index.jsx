import fetch from '../../components/async-fetch/fetch.js'

import CONST from './const.jsx';

class DateSelection extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            list: CONST.DATA.DEFAULTS
        }
    }

    async componentDidMount() {
        await this.initList()
    }

    async initList() {
        const self = this

        await fetch.get({
            url: 'android/recordevent/date/get',
            query: {}
        }).then(
            ({ data: { statistic } }) => self.setState({ list: statistic }),
            error => { }
        )
    }

    renderList() {
        const self = this
        const { list } = this.state

        const switchChildrenHandle = key => {
            let myList = JSON.parse(JSON.stringify(list))

            if (list[key].hasOwnProperty('isShowChildren') && list[key].isShowChildren) {
                myList[key].isShowChildren = false
            } else {
                myList[key].isShowChildren = true
            }

            self.setState({ list: myList })
        }

        return list.map(({ count, data, maxTimestamp, minTimestamp, name, isShowChildren }, key) => [
            <div className="date-item flex-start-center" key={key}>
                <div className="item-name flex-rest"
                    onClick={() => self.selectHandle(maxTimestamp, minTimestamp)}
                >{name}</div>
                <div className="item-count">{count}</div>
                {!!data &&
                    <div className="item-icon flex-center"
                        onClick={() => switchChildrenHandle(key)}
                    >{!!isShowChildren ? CONST.ICON.MINIFY : CONST.ICON.BLOW_UP}
                    </div>
                }
            </div>,

            !!data && !!isShowChildren && self.renderListChildren(data, `${key}`)
        ])
    }

    renderListChildren(upLevelList, upLevelKey) {
        const self = this
        const { list } = this.state

        const getTargetItem = originData => {
            const depth = upLevelKey.split(',')
            const depthList = []

            const firstKey = depth[0]
            const firstData = originData[firstKey]
            depthList.push(firstData)

            for (let i = 1; i < depth.length; i++) {
                const thisDepthData = depthList[depthList.length - 1]
                const thisDepthKey = depth[i]
                depthList.push(thisDepthData.data[thisDepthKey])
            }

            const finallyDepthData = depthList[depthList.length - 1]

            return finallyDepthData.data
        }

        const switchChildrenHandle = key => {
            let myList = JSON.parse(JSON.stringify(list))

            const item = getTargetItem(list)

            if (item[key].hasOwnProperty('isShowChildren') && item[key].isShowChildren) {
                getTargetItem(myList)[key].isShowChildren = false
            } else {
                getTargetItem(myList)[key].isShowChildren = true
            }

            self.setState({ list: myList })
        }

        return upLevelList.map(({ count, data, maxTimestamp, minTimestamp, name, isShowChildren }, key) => [
            <div className="date-item flex-start-center" key={key}>
                <div className="item-name flex-rest"
                    onClick={() => self.selectHandle(maxTimestamp, minTimestamp)}
                >{name}</div>
                <div className="item-count">{count}</div>
                {!!data &&
                    <div className="item-icon flex-center"
                        onClick={() => switchChildrenHandle(key)}
                    >{!!isShowChildren ? CONST.ICON.MINIFY : CONST.ICON.BLOW_UP}
                    </div>
                }
            </div>,

            !!data && !!isShowChildren && self.renderListChildren(data, `${upLevelKey},${key}`)
        ])
    }

    selectHandle(maxTimestamp, minTimestamp) {
        window.sessionStorage['rejiejay-diary-system-date-selection-maxTimestamp'] = maxTimestamp
        window.sessionStorage['rejiejay-diary-system-date-selection-minTimestamp'] = minTimestamp
        window.location.replace('../index.html')
    }

    render() {

        return [
            <div className="close">
                <div className="close-container flex-center"
                    onClick={() => selectHandle('', '')}
                >关闭</div>
            </div>,

            <div className="date">{this.renderList.call(this)}</div>
        ]
    }
}

window.onload = () => ReactDOM.render(<DateSelection />, document.body);
