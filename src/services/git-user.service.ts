import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/core'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class GitUserService {

  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit();
  }

  async searchUsers(username: string, page: number = 1): Promise<any> {
    const response = await this.octokit.request('GET /search/users', {
      q: username,
      per_page: 10,
      page: page
    });

    return response.data;
  }

  async getUserDetails(username: string): Promise<any> {
    const response = await this.octokit.request('GET /users/{username}', {
      username: username
    });

    return response.data;
  }

  async getUserRepos(username: string): Promise<any[]> {
    const response = await this.octokit.request('GET /users/{username}/repos', {
      username: username,
      per_page: 10 // Limit to 10 repositories per page
    });

    return response.data.map((repo: any) => {
      return {
        name: repo.name,
        description: repo.description
      };
    });
  }
}