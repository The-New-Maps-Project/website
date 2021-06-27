const writeNum = require("./../services/writeNum").default;

test("writeNum",()=>{
    expect(writeNum(3991.41)).toEqual("3,991.4")
    expect(writeNum(50128012)).toEqual("50,128,012")
    expect(writeNum(3991.8990)).toEqual("3,991.9")
    expect(writeNum(541)).toBe("541")
})