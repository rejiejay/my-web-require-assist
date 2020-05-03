import consequencer from './../utils/consequencer.js';

export const confirmPopUpDestroy = () => {
    const confirm = document.getElementById('rejiejay-confirm-popup')
    if (confirm) document.body.removeChild(confirm);
}

export const confirmPopUp = ({title, succeedHandle}) => new Promise(function (resolve, reject) {
    /** 目标: 防止重复调用 */
    if (document.getElementById('rejiejay-confirm-popup')) return false;

    const node = document.createElement("div");

    const node_content = `
        <div id='ejiejay-confirm-popup-mask'></div>
        <div class='confirm-container'>
            <div class='confirm-title'>${title || 'please confirm operation'}</div>
            <div class='confirm-operating'>
                <div id='rejiejay-confirm-popup-operate-yes'>确认</div>
                <div id='rejiejay-confirm-popup-operate-no'>取消</div>
            </div>
        </div>
    `;

    node.setAttribute('class', 'rejiejay-confirm-popup');
    node.setAttribute('id', 'rejiejay-confirm-popup');
    node.innerHTML = node_content;
    document.body.appendChild(node);

    document.getElementById('rejiejay-confirm-popup-operate-yes').onclick = function () {
        succeedHandle ? succeedHandle() : null;
        confirmPopUpDestroy()
        resolve()
    }

    document.getElementById('rejiejay-confirm-popup-operate-no').onclick = function () {
        confirmPopUpDestroy()
        reject()
    }

    document.getElementById('ejiejay-confirm-popup-mask').onclick = function () {
        confirmPopUpDestroy()
        reject()
    }
}).then(
    () => consequencer.success(),
    error => consequencer.error(error)
)