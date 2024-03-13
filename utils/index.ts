function isDate(value: Date): value is Date {
    return value instanceof Date
}

function formatDate2String<T extends { [x: string]: any }, K extends { [x in keyof T]: any }>(data: T): K {
    if (!data) return data ?? null as unknown as K
    const keys: (keyof T)[] = Object.keys(data)
    const result = keys.reduce<K>((res, key) => {
        const value = data[key]
        if (typeof value !== 'object' || value === null) {
            res[key] = value as unknown as K[keyof T]
        } else {
            if (isDate(value as Date)) {
                res[key] = (<Date>value).toLocaleString() as K[keyof T]
            } else {
                res[key] = formatDate2String(value)
            }
        }
        return res
    }, <K>{})
    return result
}

export {
    formatDate2String
}
