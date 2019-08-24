const { fahrenheitToCelsius, celsiusToFahrenheit, add } = require('../src/math')

test('test fahrenheitToCelsius', () => {
    const temp = fahrenheitToCelsius(32);
    expect(temp).toBe(0)
})

test('test celsiusToFahrenheit', () => {
    const temp = celsiusToFahrenheit(0);
    expect(temp).toBe(32)
})

test('Async test demo', (done) => {
    setTimeout(() => {
        expect(2).toBe(2)
        done()
    }, 2000)
})

test('Async add function test', (done) => {
    add(2, 3).then((sum)=>{
        expect(sum).toBe(5)
        done()
    })
})


test('Async add function test using async', async () => {
    const sum = await add(2, 3)
    expect(5).toBe(5)
})

