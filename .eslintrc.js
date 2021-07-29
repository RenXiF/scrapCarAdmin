module.exports = {
  root: true,
  env: {
    node: true
  },
  // "eslint:recommended"
  extends: ["plugin:vue/essential", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "on" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "on" : "off"
  }
};
