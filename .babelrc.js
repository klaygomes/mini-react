module.exports = {
    "presets": [
        ["@babel/preset-env", {
            "useBuiltIns": false,
            "modules": false
        }]
    ],
    "env": {
        "test":{
            "presets": [
                ["@babel/preset-env", {
                    "modules": "commonjs"
                                }]
            ]
        }
    }
}