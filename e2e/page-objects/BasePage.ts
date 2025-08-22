import { type Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/');
    await this.waitForPageReady();
  }

  async waitForPageReady() {
    await this.page.waitForSelector('h1:has-text("Scrabble Points Calculator")');
  }
}
