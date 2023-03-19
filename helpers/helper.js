exports.capFirstMay = function (str) {
   
    return str.charAt(0).toUpperCase() + str.slice(1)
}

exports.formatCL = function (num) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        useGrouping: true,
    }).format(num);
}