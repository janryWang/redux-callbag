const { NODE_ENV, BABEL_ENV } = process.env
const cjs = BABEL_ENV === 'cjs' || NODE_ENV === 'test'
const loose = true

module.exports = {
    presets: [["@babel/env", { modules: false, loose }]],
    plugins: [
        "@babel/plugin-proposal-pipeline-operator",
        cjs && "@babel/plugin-transform-modules-commonjs",
    ].filter(Boolean),
}
