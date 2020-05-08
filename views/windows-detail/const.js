const CONST = {
    PAGE_STATUS: {
        DEFAULTS: 'add',
        ADD: 'add',
        EDIT: 'edit'
    },
    MIND: {
        DEFAULTS: {
            id: null,
            alias: null,
            parentid: null,
            title: '',
            content: '',
            timeSpan: '一周: \n一个月: \n一年: \n三年: \n十年: ',
            view: '自身理解需求: \n自身尊重: \n自身基本生活(性)需求: \nTa人(父母/好友/妻子)角度: \n国家角度: \n',
            nature: ''
        },
        DEMO: {
            id: 2,
            alias: 1,
            parentid: 1,
            title: '标题',
            content: '内容',
            timeSpan: '时间跨度',
            view: '角度',
            nature: '深度'
        }
    }
}

export default CONST