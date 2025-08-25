import { type APIRequestContext, type Page } from '@playwright/test';
import { API_BASE_URL } from '../config/environments';

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

  async cleanupAllScores(request: APIRequestContext) {
    let hasScores = true;
    while (hasScores) {
      const response = await request.get(`${API_BASE_URL}/scores`, {
        params: {
          size: 10,
          sort: 'createdAt,desc'
        }
      });

      if (!response.ok()) {
        break;
      }

      const scores = await response.json();

      if (scores.length === 0) {
        hasScores = false;
        break;
      }

      const scoreIds = scores.map((score: any) => score.id);
      await request.delete(`${API_BASE_URL}/scores`, {
        data: scoreIds
      });
    }
  }
}
