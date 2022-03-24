module.exports = {
    OK_RESPONSE: {
        message: 'Operation completed successfully'
    },
    ERROR_RESPONSE: (msg) => {
        return {
            message: `Error: ${msg}`
        }
    }
};
