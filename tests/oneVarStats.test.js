const {mean,sum,stddev,median,outliers} = require("../calculate/oneVarStats");

test("sum",()=>{
    expect(sum([1,2,3])).toEqual(6);
    expect(sum([60,71,38,5,9,23,48])).toEqual(254)
    expect(sum([56])).toEqual(56);
    expect(sum([12,4,1.82,6,43.651])).toEqual(67.471);
    expect(sum([])).toEqual(0);
})

test("mean",()=>{
    expect(mean([1,2,3,4])).toEqual(2.5)
    expect(mean([])).toEqual(0)
    expect(mean([47])).toEqual(47)
    expect(mean([12.3,45.8,12,90,66.782])).toBeCloseTo(45.3764,4)
})

test("median",()=>{
    expect(median([1,2,3])).toEqual(2);
    expect(median([1,2,3,4])).toEqual(2.5);
    expect(median([0.3,1.2,3,4,4.2,5,8,27])).toBeCloseTo(4.1,1)
})

test("stddev",()=>{
    expect(stddev([1,2,3,4,5,6,7,8],false)).toBeCloseTo(2.449,3);
    expect(stddev([1,2,3,4,5,6,7,8],true)).toBeCloseTo(2.291,3);
    expect(stddev([3.1,4.8,5.96,3,9.4,22,7.9,-3.6],false)).toBeCloseTo(7.364,3)
    expect(stddev([3.1,4.8,5.96,3,9.4,22,7.9,-3.6],true)).toBeCloseTo(6.888,3)
})

test("outliers",()=>{
    expect(outliers([-60,-1,-2,-.8,1.5,2,3.6,64],true)).toStrictEqual([64]);
    expect(outliers([-60,-1,-2,-.8,1.5,2,3.6,64],false)).toStrictEqual([]);
    expect(outliers([1,1.1,3,4.5,-2,5,8,5,0,0,0,0,120,123],true)).toStrictEqual([120,123]);
    expect(outliers([1,1.1,3,4.5,-2,5,8,5,0,0,0,0,120,123],false)).toStrictEqual([120,123]);
})