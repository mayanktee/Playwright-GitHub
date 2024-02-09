import { test, expect } from '@playwright/test'
import * as ApiData from '../utils/ApiData.json'


const UserName = ApiData.user.userName
const UserPassword = ApiData.user.password
var userId='';
var token = '';
var isbn = '';
const random = Math.floor((Math.random() * 1000) + 1);

const randomName = UserName+random

console.log('My username : '+randomName)
const basicAuthHeader = 'Basic '+ btoa(randomName+':'+UserPassword)

console.log('My basic token  : '+basicAuthHeader)

export const reqData = {
  "userName": randomName,
  "password": UserPassword
}

test.describe.configure({ mode: 'serial' });


test('TC01: A create user', async ({request}) => {
    const response = await request.post('https://demoqa.com/Account/v1/User', {
        data: reqData
    })
    console.log("Print create req: "+reqData)
    expect(response.status()).toBe(201)
    const responseBody = await response.json();
    userId = await responseBody.userID;
    console.log(await response.json())
})
test('TC02: B Generate Auth token', async ({request}) => {
    const response = await request.post('https://demoqa.com/Account/v1/GenerateToken',{
        data: reqData
    })
    expect(response.status()).toBe(200)
   
    token =  await response.json().then(data => data.token);
    
    console.log(await response.json())
})
test('TC03: C Authorised user',async ({request}) => {
    console.log('my Token ::: '+token)
    const response = await request.post("https://demoqa.com/Account/v1/Authorized", {
        data: reqData,
        headers:{
          'Authorization':`Bearer ${token}`
        }
    })
    console.log("Print auth req : "+reqData)
    expect(response.status()).toBe(200)
    const text = await response.text()
    console.log(await response.json())
})
test("TC04: D Get Books", async ({request}) => {
    const response = await request.get("https://demoqa.com/BookStore/v1/Books")
    expect(response.status()).toBe(200)
    const text = await response.text()

    isbn = await response.json().then(data => data.books[1].isbn)
    console.log("my ISBN ::: "+isbn)
    console.log(await response.json())
})


test("TC05: E Post the books to user", async ({request}) => {

    const response = await request.post("https://demoqa.com/BookStore/v1/Books", {
        data: {
            "userId": userId,
            "collectionOfIsbns": [
              {
                "isbn":isbn
              }
            ]
          },
          headers:{
            'Authorization': token,
            'Content-Type': "application/json",
            'authorization': basicAuthHeader,
          }
    })
  
    const text = await response.text()
    console.log(await response.json())
    expect(response.status()).toBe(201)
})



