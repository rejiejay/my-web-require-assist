const constHandle = {
    /**
     * 作用: 通过CONST值找到值
     */
    findValueByValue: ({
        CONST,
        supportKey,
        supportValue,
        targetKey
    }) => {
        let targetValue = null

        Object.keys(CONST).forEach(function (thisKey) {
            const obj = CONST[thisKey]

            if (obj[supportKey] === supportValue) {
                targetValue = obj[targetKey]
            }
        })

        return targetValue
    }
}

export default constHandle