"use strict";

/**
 * Get unique error field name
 */
const uniqueMessage = error => {
    let output;
    try {
        let name = error.message.substring(
            error.message.lastIndexOf(".$") + 2,
            error.message.lastIndexOf("_1")
        );
        output = `Ce champ existe déjà`;
    } catch (ex) {
        output = "Le champ unique existe déjà";
    }

    return output;
};

/**
 * Get the erroror message from error object
 */
exports.errorHandler = error => {
    let message = "";

    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Something went wrong";
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message)
                message = error.errorors[errorName].message;
        }
    }

    return message;
};