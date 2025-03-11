const md = require('./parse/markdown/index'),
    parse = require('./parse/index')

module.exports = (str, type, option) => {
    option = option || {};
    
    // 确保str是字符串类型
    if (str === undefined || str === null) {
        str = '';
    } else if (typeof str !== 'string') {
        try {
            str = String(str);
        } catch (e) {
            str = JSON.stringify(str);
        }
    }
    
    let result;
    switch (type) {
        case 'markdown':
            result = parse(md(str), option);
        break;
        case 'html':
            result = parse(str, option);
        break;
        default:
            throw new Error('Invalid type, only markdown and html are supported');
        break;
    };
    return result;
};
