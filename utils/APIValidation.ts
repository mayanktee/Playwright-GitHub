// APIValidation.ts

import * as ApiData from '../utils/ApiData.json';
import { Page, expect } from '@playwright/test';

export class APIValidation {
  public static UserName = ApiData.user.userName;
  public static UserPassword = ApiData.user.password;
  private static random = Math.floor(Math.random() * 1000 + 1);
  public static randomName = APIValidation.UserName + APIValidation.random;

  private static reqData = {
    userName: APIValidation.randomName,
    password: APIValidation.UserPassword,
  };

  private static userId = '';
  private static token = '';

  public static async userRegister(page: Page) {
    await APIValidation.createUser(page, expect);
    await APIValidation.generateToken(page, expect);
    await APIValidation.authorizationWithToken(page, expect);
  }

  private static async createUser(page: Page, expect: any) {
    const response = await page.request.post(
      'https://demoqa.com/Account/v1/User',
      {
        data: APIValidation.reqData,
      }
    );
    console.log('Print create req: ' + APIValidation.reqData);
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    APIValidation.userId = responseBody.userID;
  }

  private static async generateToken(page: Page, expect: any) {
    const response = await page.request.post(
      'https://demoqa.com/Account/v1/GenerateToken',
      {
        data: APIValidation.reqData,
      }
    );
    expect(response.status()).toBe(200);
    APIValidation.token = await response.json().then((data: any) => data.token);

    console.log(await response.json());
  }

  private static async authorizationWithToken(page: Page, expect: any) {
    const response = await page.request.post(
      'https://demoqa.com/Account/v1/Authorized',
      {
        data: APIValidation.reqData,
        headers: {
          Authorization: `Bearer ${APIValidation.token}`,
        },
      }
    );
    console.log('Print auth req : ' + APIValidation.reqData);
    expect(response.status()).toBe(200);
    const text = await response.text();
    console.log(await response.json());
  }
}
export default APIValidation;