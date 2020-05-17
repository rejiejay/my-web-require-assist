export const dropDownSelectPopupDestroy = function inputPopUpDestroy() {
    var popup = document.getElementById('rejiejay-drop-down-select-popup')
    if (popup) document.body.removeChild(popup);
}

export const dropDownSelectPopup = ({
    /** { value, label } */
    list,
    handle,
    mustInput
}) => {
    /** 目标: 防止重复调用 */
    if (document.getElementById('rejiejay-drop-down-select-popup')) return false;
    const node = document.createElement("div");

    const renderItem = ({
        value,
        label
    }) => `<div class='select-item'>${label}</div>`

    const node_content = `
        ${!!mustInput ? '' : "<div id='rejiejay-drop-down-select-popup-mask'></div>"}
        <div class='select-container'>${
            list.map(item => renderItem(item)).join('')
        }</div>
    `;

    node.setAttribute('class', 'rejiejay-drop-down-select-popup');
    node.setAttribute('id', 'rejiejay-drop-down-select-popup');
    node.innerHTML = node_content;
    document.body.appendChild(node);

    const children_dom = node.querySelectorAll('.select-item')
    for (let index = 0; index < children_dom.length; index++) {
        const element = children_dom[index];
        const targetItem = list[index];
        element.onclick = () => {
            handle && handle(targetItem);
            dropDownSelectPopupDestroy()
        }
    }

    if (!mustInput) document.getElementById('rejiejay-drop-down-select-popup-mask').onclick = function() {
        dropDownSelectPopupDestroy()
    }
}