import CONST from './const.js'
import jsonHandle from './../../utils/json-handle.js'
import consequencer from './../../utils/consequencer.js'

export const getProcess = () => {
    const processStr = window.localStorage.getItem('task-target-process')

    if (!processStr || processStr === 'null') return consequencer.error('未缓存正在执行的目标')

    const verify = jsonHandle.verifyJSONString({ jsonString: processStr })

    if (verify.isCorrect === false) return consequencer.error('正在执行目标数据有误')

    process = verify.data
    return consequencer.success(process)
}

export const setProcess = ({ id, name }) => window.localStorage.setItem('task-target-process', JSON.stringify({ id, name }));

export const clearProcess = () => window.localStorage.setItem('task-target-process', '');

export class ProcessTask extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            process: CONST.PROCESS.DEFAULTS
        }
    }

    componentDidMount() {
        this.initProcess()
    }

    initProcess() {
        const processInstance = getProcess()
        if (processInstance.result === 1) this.setState({ process: processInstance.data })
    }

    unlockHandle() {
        const { callbackHandle } = this.props;
        window.localStorage.setItem('task-target-process', '');
        const process = CONST.PROCESS.DEFAULTS;
        this.setState({ process });
        callbackHandle ? callbackHandle() : null;
    }

    selectTarget() {
        const { reSelectTarget } = this.props
        if (reSelectTarget) window.location.replace(reSelectTarget) 
    }

    render() {
        const { isHide } = this.props
        const { process } = this.state

        return (
            <div className="process-task">
                {!isHide && <div className="process-container flex-start">
                    <div className="task-item flex-rest flex-center"
                        onClick={this.selectTarget.bind(this)}
                    >范围: {process ? process.name : '全部'}</div>
                    {!!process && <div className="task-unlock flex-center"
                        onClick={this.unlockHandle.bind(this)}
                    >unlock</div>}
                </div>}
            </div>
        )
    }
}
