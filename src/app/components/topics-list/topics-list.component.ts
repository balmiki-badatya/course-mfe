import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopicsService } from '../../services/topics.service';
import { Topic } from '../../models/topic.model';

@Component({
  selector: 'app-topics-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './topics-list.component.html',
  styleUrls: ['../../../styles/topics-list.styles.css']
})
export class TopicsListComponent implements OnInit {
  private topicsService = inject(TopicsService);

  topics: Topic[] = [];
  paginatedTopics: Topic[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  isAddingTopic = false;
  newTopicName = '';
  editingSubtopics: Record<string, string> = {};
  addingSubtopicFor: string | null = null;
  newSubtopicName = '';

  ngOnInit(): void {
    this.topicsService.topics$.subscribe(topics => {
      this.topics = topics;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    if (!this.topics || !Array.isArray(this.topics)) {
      this.totalPages = 0;
      this.paginatedTopics = [];
      return;
    }
    this.totalPages = Math.ceil(this.topics.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTopics = this.topics.slice(startIndex, endIndex);
  }

  toggleComplete(topicId: string, isParent = false): void {
    if (isParent) {
      this.topicsService.toggleCompleteWithChildren(topicId);
    } else {
      this.topicsService.toggleComplete(topicId);
    }
  }

  toggleExpanded(topicId: string): void {
    this.topicsService.toggleExpanded(topicId);
  }

  startEditingSubtopic(subtopicId: string, currentName: string): void {
    this.editingSubtopics[subtopicId] = currentName;
  }

  saveSubtopicName(subtopicId: string): void {
    const newName = this.editingSubtopics[subtopicId];
    if (newName && newName.trim()) {
      this.topicsService.updateTopicName(subtopicId, newName.trim());
    }
    delete this.editingSubtopics[subtopicId];
  }

  cancelEditingSubtopic(subtopicId: string): void {
    delete this.editingSubtopics[subtopicId];
  }

  isEditingSubtopic(subtopicId: string): boolean {
    return subtopicId in this.editingSubtopics;
  }

  startAddingSubtopic(parentId: string): void {
    this.addingSubtopicFor = parentId;
    this.newSubtopicName = '';
    // Expand the parent topic to show the input form
    this.topicsService.toggleExpanded(parentId);
  }

  saveNewSubtopic(): void {
    if (this.addingSubtopicFor && this.newSubtopicName.trim()) {
      this.topicsService.addSubtopic(this.addingSubtopicFor, this.newSubtopicName.trim());
      this.addingSubtopicFor = null;
      this.newSubtopicName = '';
    }
  }

  cancelAddingSubtopic(): void {
    this.addingSubtopicFor = null;
    this.newSubtopicName = '';
  }

  isAddingSubtopicFor(parentId: string): boolean {
    return this.addingSubtopicFor === parentId;
  }

  deleteSubtopic(parentId: string, subtopicId: string): void {
    // This method is currently disabled by default
    // In the future, this will be enabled based on user role/permissions
    console.log(`Delete subtopic ${subtopicId} from parent ${parentId} - Permission required`);
    // this.topicsService.deleteSubtopic(parentId, subtopicId);
  }

  updateTopicName(topicId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input && input.value && input.value.trim()) {
      this.topicsService.updateTopicName(topicId, input.value.trim());
    }
  }

  startAddingTopic(): void {
    this.isAddingTopic = true;
  }

  cancelAddingTopic(): void {
    this.isAddingTopic = false;
    this.newTopicName = '';
  }

  addNewTopic(): void {
    if (this.newTopicName && this.newTopicName.trim()) {
      this.topicsService.addTopic(this.newTopicName.trim());
      this.newTopicName = '';
      this.isAddingTopic = false;
      this.goToLastPage();
    }
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number') {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.updatePagination();
  }

  getPageNumbers(): (number | string)[] {
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(this.totalPages, startPage + maxVisible - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  getCompletionPercentage(): number {
    if (!this.topics || this.topics.length === 0) return 0;
    const completed = this.countCompleted(this.topics);
    const total = this.countTotal(this.topics);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  private countCompleted(topics: Topic[]): number {
    if (!topics) return 0;
    let count = 0;
    for (const topic of topics) {
      if (topic.completed) count++;
      if (topic.subtopics && topic.subtopics.length > 0) {
        count += this.countCompleted(topic.subtopics);
      }
    }
    return count;
  }

  private countTotal(topics: Topic[]): number {
    if (!topics) return 0;
    let count = topics.length;
    for (const topic of topics) {
      if (topic.subtopics && topic.subtopics.length > 0) {
        count += this.countTotal(topic.subtopics);
      }
    }
    return count;
  }
}
