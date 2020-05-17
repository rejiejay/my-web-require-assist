import jsonHandle from './../../utils/json-handle.js';
import { inputPopUp, inputPopUpDestroy } from './../../components/input-popup.js';
import { dropDownSelectPopup, dropDownSelectPopupDestroy } from './../../components/drop-down-select-popup.js';
import { confirmPopUp } from './../../components/confirm-popup.js';

import CONST from './const.js';

const renderConclusion = self => {
    const { content, isShowMultifunction } = self.state
    const verifyJSOresult = jsonHandle.verifyJSONString({ jsonString: content })
    const isMultifunction = () => {
        if (!verifyJSOresult.isCorrect) return false
        if (!isShowMultifunction) return false
        if (!!verifyJSOresult.data && !!verifyJSOresult.data.content) return true
        return false
    }

    if (isMultifunction() === false) return [
        <div className="edit-mind-description multi-function flex-start">
            <div className="flex-rest">策略结论</div>
            {verifyJSOresult.isCorrect && <div className="multi-function-add"
                onClick={() => self.setState({ isShowMultifunction: true })}
            >展示JSON</div>}
            {!verifyJSOresult.isCorrect && <div className="multi-function-add"
                onClick={() => self.setState({ content: `{"content": "${content}"}` })}
            >展示JSON</div>}
        </div>,
        <div className="content-input">
            <textarea className="content-textarea fiex-rest" type="text"
                placeholder="请输入结论"
                value={content}
                style={{ height: 180 }}
                onChange={({ target: { value } }) => self.setState({ content: value })}
            ></textarea>
        </div>
    ]

    const contentObj = verifyJSOresult.data
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

    const jumpMultiItem = index => window.location.replace(contentObj.child[index].bindUrl)

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

    const onChangeMultiHandle = value => {
        contentObj.content = value
        self.setState({ content: JSON.stringify(contentObj) })
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
                onChange={({ target: { value } }) => onChangeMultiHandle(value)}
            ></textarea>
        </div>
    ]
}

export default renderConclusion