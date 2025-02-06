const {test, describe} = require("node:test")
const equals = require("assert").strictEqual
const listHelper = require("../utils/list_helper")

test('dummy returns one', () => {
    equals(listHelper.dummy([]), 1);

})