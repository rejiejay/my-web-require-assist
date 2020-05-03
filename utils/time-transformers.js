const timeTransformers = {
    /**
     * Date 转换 xxxx-xx-xx 字符串
     * @param {Date} myDate 要转换的日期
     * @return {string} 日期字符串 2018-05-08
     */
    dateToFormat: function dateToFormat(myDate) {
        var yyyy = myDate.getFullYear();

        var mm = myDate.getMonth() + 1;
        var mmstring = mm < 10 ? '0' + mm : mm;

        var dd = myDate.getDate();
        var ddstring = dd < 10 ? '0' + dd : dd;

        return `${yyyy}-${mmstring}-${ddstring}`;
    },

    /**
     * Date 转换 20180102 字符串
     * @param {Date} myDate 要转换的日期
     * @return {string} 日期字符串 20180102
     */
    dateToYYYYmmNumber: function dateToYYYYmmNumber(myDate) {
        var yyyy = myDate.getFullYear();

        var mm = myDate.getMonth() + 1;
        var mmstring = mm < 10 ? '0' + mm : mm;

        var dd = myDate.getDate();
        var ddstring = dd < 10 ? '0' + dd : dd;

        return `${yyyy}${mmstring}${ddstring}`;
    },

    /**
     * Date 转换 xxxx-xx-xx xx:00 字符串
     * @param {Date} myDate 要转换的日期
     * @return {string} 日期字符串 2018-05-08 09:00
     */
    dateToYYYYmmDDhhMM00: function dateToYYYYmmDDhhMM00(myDate) {
        var yyyy = myDate.getFullYear();

        var mm = myDate.getMonth() + 1;
        var mmstring = mm < 10 ? '0' + mm : mm;

        var dd = myDate.getDate();
        var ddstring = dd < 10 ? '0' + dd : dd;

        var hh = myDate.getHours();
        var hhstring = hh < 10 ? '0' + hh : hh;

        return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:00`;
    },

    /**
     * Date 转换 xxxx-xx-xx xx:xx 字符串
     * @param {Date} myDate 要转换的日期
     * @return {string} 日期字符串 2018-05-08 09:15
     */
    dateToYYYYmmDDhhMM: function dateToYYYYmmDDhhMM(myDate) {
        var yyyy = myDate.getFullYear();

        var mm = myDate.getMonth() + 1;
        var mmstring = mm < 10 ? '0' + mm : mm;

        var dd = myDate.getDate();
        var ddstring = dd < 10 ? '0' + dd : dd;

        var hh = myDate.getHours();
        var hhstring = hh < 10 ? '0' + hh : hh;

        var Min = myDate.getMinutes();
        var Minstring = Min < 10 ? '0' + Min : Min;

        return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:${Minstring}`;
    },

    /**
     * Date 转换 xxxx-xx-xx xx:xx:xx 字符串
     * @param {Date} myDate 要转换的日期
     * @return {string} 日期字符串 2018-05-08 09:15:30
     */
    dateToYYYYmmDDhhMMss: function dateToYYYYmmDDhhMMss(myDate) {
        var yyyy = myDate.getFullYear();

        var mm = myDate.getMonth() + 1;
        var mmstring = mm < 10 ? '0' + mm : mm;

        var dd = myDate.getDate();
        var ddstring = dd < 10 ? '0' + dd : dd;

        var hh = myDate.getHours();
        var hhstring = hh < 10 ? '0' + hh : hh;

        var Min = myDate.getMinutes();
        var Minstring = Min < 10 ? '0' + Min : Min;

        var ss = myDate.getSeconds();
        var ssstring = ss < 10 ? '0' + ss : ss;

        return `${yyyy}-${mmstring}-${ddstring} ${hhstring}:${Minstring}:${ssstring}`;
    },

    /**
     * xxxx-xx-xx xx:xx:xx 字符串 转换 为时间戳
     * @param {string} YYYYmmDDhhMMss xxxx-xx-xx xx:xx:xx 字符串
     * @return {number} 为时间戳 1539051630549
     */
    YYYYmmDDhhMMssToTimestamp: function YYYYmmDDhhMMssToTimestamp(YYYYmmDDhhMMss) {
        var YDArray = YYYYmmDDhhMMss.split(' ');
        var YYYYmmDDarray = YDArray[0].split('-');
        var hhMMssArray = YDArray[1].split(':');
        return new Date(YYYYmmDDarray[0], (YYYYmmDDarray[1] - 1), YYYYmmDDarray[2], hhMMssArray[0], hhMMssArray[1], hhMMssArray[2]).getTime();
    },

    /**
     * xxxx-xx-xx xx:xx 字符串 转换 为时间戳
     * @param {string} YYYYmmDDhhMM xxxx-xx-xx xx:xx 字符串
     * @return {number} 为时间戳 1539051630549
     */
    YYYYmmDDhhMMToTimestamp: function YYYYmmDDhhMMToTimestamp(YYYYmmDDhhMM) {
        var YDArray = YYYYmmDDhhMM.split(' ');
        var YYYYmmDDarray = YDArray[0].split('-');
        var hhMMssArray = YDArray[1].split(':');
        return new Date(YYYYmmDDarray[0], (YYYYmmDDarray[1] - 1), YYYYmmDDarray[2], hhMMssArray[0], hhMMssArray[1]).getTime();
    },

    /**
     * xxxx-xx-xx字符串 转换 为时间戳
     * @param {string} YYYYmmDD xxxx-xx-xx 字符串
     * @return {number} 为时间戳 1539051630549
     */
    YYYYmmDDToTimestamp: function YYYYmmDDToTimestamp(YYYYmmDD) {
        var YDArray = YYYYmmDD.split(' ');
        var YYYYmmDDarray = YDArray[0].split('-');

        return new Date(YYYYmmDDarray[0], (YYYYmmDDarray[1] - 1), YYYYmmDDarray[2]).getTime();
    }
}

export default timeTransformers