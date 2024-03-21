import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { GitUserService } from '../../services/git-user.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor,CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {


  username: string = '';
  searchResults: any[] = [];
  selectedUser: any;
  repos: any[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  visiblePages: number[] = [];

  constructor(private githubService: GitUserService) { }

  async search(page: number = 1) {
    const searchResults = await this.githubService.searchUsers(this.username, page);
    this.searchResults = searchResults.items;
    this.totalPages = Math.ceil(searchResults.total_count / 10);
    this.currentPage = page;
    this.updateVisiblePages();
  }

  async getUserDetails(username: string) {
    this.selectedUser = await this.githubService.getUserDetails(username);
    this.repos = [];
  }

  async getUserRepos(username: string) {
    this.repos = await this.githubService.getUserRepos(username);
  }

  updateVisiblePages() {
    const maxVisiblePages = 5; // Maximum number of visible page links
    const startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    this.visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
      this.visiblePages.push(i);
    }

    if (startPage > 1) {
      this.visiblePages.unshift(-1); // Add ellipsis before first page if needed
    }

    if (endPage < this.totalPages) {
      this.visiblePages.push(-1); // Add ellipsis after last page if needed
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.search();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.search();
    }
  }
}