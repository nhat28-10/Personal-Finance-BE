type Handle = () => Promise<string>
const fullname: string = 'Nguyễn Thanh Minh Nhật'
const person: { name: string } = { name: fullname }

const handle: Handle = () => Promise.resolve(fullname)
// console.log(name)

handle().then(console.log)
