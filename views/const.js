const CONST = {
    SORT: {
        DEFAULTS: {
            value: 'time',
            label: '默认排序'
        },
        TIME: {
            value: 'time',
            label: '时间排序'
        },
        RANDOM: {
            value: 'random',
            label: '随机排序'
        }
    },
    DATA_TYPE: {
        DEFAULTS: {
            value: 'all',
            label: '数据类型'
        },
        RECORD: {
            value: 'record',
            label: '记录类型'
        },
        EVENT: {
            value: 'event',
            label: '日记类型'
        }
    },
    DATA: {
        DEFAULTS: [],
        DEMO: [{
            androidid: 58,
            eventaction: '',
            eventcause: '',
            eventconclusion: '',
            eventprocess: '',
            eventresult: '',
            eventsituation: '',
            eventtarget: '',
            eventtitle: '',
            fullyear: 2018,
            imageidentity: '',
            imageurl: '',
            month: 8,
            recordcontent: 'recordcontentrecordcontent',
            recordmaterial: 'recordmaterialrecordmaterial',
            recordtitle: 'recordtitlerecordtitle',
            tag: 'tag',
            timestamp: 1566658090235,
            type: 'record',
            week: 2
        }]
    },
    TAG: {
        DEFAULTS: [],
        DEMO: [{
            tagid: 58,
            tagname: '标签名称',
        }]
    }
}

export default CONST