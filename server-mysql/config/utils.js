// server-mysql/config/utils.js
const orderby = (inputString, fieldName) => {
    const [field, order] = (fieldName || '').split('|');
    if (fieldName === undefined) return inputString
    const validOrder = order && ['asc', 'desc'].includes(order.toLowerCase()) ? order.toLowerCase() : 'asc';
    return `${inputString} ORDER BY ${field} ${validOrder}`;
};

const filterByDate = (qry, stDate, endDate, fieldName) => {
    if (qry.search('WHERE') === -1) {
        if (stDate !== undefined && endDate !== undefined) {
            qry += ` WHERE DATE(${fieldName}) >= '${stDate}' AND DATE(${fieldName}) <= '${endDate}'`;
        } else if (stDate !== undefined) {
            qry += ` WHERE DATE(${fieldName}) >= '${stDate}'`;
        } else if (endDate !== undefined) {
            qry += ` WHERE DATE(${fieldName}) <= '${endDate}'`;
        }
    } else {
        if (stDate !== undefined && endDate !== undefined) {
            qry += ` AND DATE(${fieldName}) >= '${stDate}' AND DATE(${fieldName}) <= '${endDate}'`;
        } else if (stDate !== undefined) {
            qry += ` AND DATE(${fieldName}) >= '${stDate}'`;
        } else if (endDate !== undefined) {
            qry += ` AND DATE(${fieldName}) <= '${endDate}'`;
        }
    }
    return qry;
}


module.exports = { orderby, filterByDate };
