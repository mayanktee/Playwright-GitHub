import {test,expect} from '@playwright/test'
import * as ApiData from '../utils/ApiData.json'
import APIValidation from '../utils/APIValidation';
 
var userName= ''
var password =''

// +++++++++++++++++++++++ Test Methods +++++++++++++++++++++++++++++++++++++++++++++++++++++++++=

test.beforeEach('Before All : A create user UID & Password by API ', async ({page}) => {
    await APIValidation.userRegister(page);
    userName = APIValidation.randomName
    password= APIValidation.UserPassword
    console.log("UserName :"+ userName)
    console.log("Password :"+ password)
})

test('Validate the landing on DemoQA HomePage',async({page}) => {
    await page.goto('https://demoqa.com/');
    await page.getByLabel('Consent', { exact: true }).click();
    await page.locator('div:nth-child(6) > div > .avatar').click();
    await page.locator('li').filter({ hasText: 'Login' }).click();
    await page.getByPlaceholder('UserName').fill(userName);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    const uIDAfterLogin = await page.locator('#userName-value').textContent();
    expect(uIDAfterLogin).toBe(userName);
    
})

