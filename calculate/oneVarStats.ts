export function mean(nums:number[]):number{
    nums = handleNaNs(nums);
    if(nums.length==0) return 0;
    return sum(nums)/nums.length;
}

export function sum(nums:number[]):number{
    nums = handleNaNs(nums);
    if(nums.length==0) return 0;
    var res:number = 0;
    nums.forEach(n=>res+=n);
    return res;
}

export function median(nums:number[]):number{
    nums = handleNaNs(nums);
    if(nums.length==0) return 0;
    nums.sort((a,b)=>a-b);
    const mid:number = Math.floor(nums.length/2);
    if(nums.length%2==0) return (nums[mid]+nums[mid-1])/2;
    return nums[mid];
}

//isPop: true, population stddev; false, sample stddev
export function stddev(nums:number[],isPop:boolean):number{
    nums = handleNaNs(nums);
    if(nums.length==0) return 0;
    
    const u:number = mean(nums);
    var res:number = 0;
    nums.forEach(n=>res+=Math.pow(n-u,2));
    res /= (nums.length - (isPop?0:1));
    res = Math.sqrt(res);
    return res;
}

export function outliers(nums:number[],isPop:boolean):number[]{
    nums = handleNaNs(nums);
    if(nums.length==0) return [];
    const u:number = mean(nums);
    const std:number = stddev(nums,isPop);
    var res = nums.filter(n=>(n<=u-2*std||n>=u+2*std));
    res.sort((a,b)=>a-b);
    return res;
}

function handleNaNs(nums: number[]):number[]{
    return nums.filter(n=>!Number.isNaN(n));
}