sap.ui.define([], function () {
    "use strict";

    return {
        formatDate: function (date) {
            date = new Date(date);
            const year = date.getUTCFullYear();
            const month = ("0" + (date.getMonth() + 1)).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);

            return `${day}/${month}/${year}`;
        },
        formatBool: function (bool) {
            if (bool) {
                return "Evet";
            } else {
                return "Hayır";
            }
        },
        capitalizeText: function (text) {
            let splitStr = text.toLowerCase().split(" ");
            for (let i = 0; i < splitStr.length; i++) {
                // handling "i" letter
                if (splitStr[i][0] == "i") {
                    splitStr[i] = "İ" + splitStr[i].substring(1);
                } else {
                    splitStr[i] =
                        splitStr[i].charAt(0).toUpperCase() +
                        splitStr[i].substring(1);
                }
            }

            return splitStr.join(" ");
        },
    };
});
