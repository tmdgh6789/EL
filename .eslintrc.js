module.exports = {
    "extends": "eslint-config-airbnb-es5",
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "space-before-function-paren": "off",
        "func-names": "off",
        "no-alert": "off",
        "no-console": "off"
    }
};