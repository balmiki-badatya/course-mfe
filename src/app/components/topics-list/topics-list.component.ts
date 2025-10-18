import { Component, OnInit } from '@angular/core';
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
  topics: Topic[] = [];
  paginatedTopics: Topic[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
  isAddingTopic = false;
  newTopicName = '';
  editingSubtopics: { [key: string]: string } = {};
  addingSubtopicFor: string | null = null;
  newSubtopicName = '';

  constructor(private topicsService: TopicsService) {}

  ngOnInit(): void {
    this.topicsService.topics$.subscribe(topics => {
      this.topics = topics;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.topics.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTopics = this.topics.slice(startIndex, endIndex);
  }

  toggleComplete(topicId: string, isParent: boolean = false): void {
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

  updateTopicName(topicId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.trim()) {
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
    if (this.newTopicName.trim()) {
      this.topicsService.addTopic(this.newTopicName.trim());
      this.newTopicName = '';
      this.isAddingTopic = false;
      this.goToLastPage();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
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

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  getCompletionPercentage(): number {
    if (this.topics.length === 0) return 0;
    const completed = this.countCompleted(this.topics);
    const total = this.countTotal(this.topics);
    return Math.round((completed / total) * 100);
  }

  private countCompleted(topics: Topic[]): number {
    let count = 0;
    for (const topic of topics) {
      if (topic.completed) count++;
      if (topic.subtopics.length > 0) {
        count += this.countCompleted(topic.subtopics);
      }
    }
    return count;
  }

  private countTotal(topics: Topic[]): number {
    let count = topics.length;
    for (const topic of topics) {
      if (topic.subtopics.length > 0) {
        count += this.countTotal(topic.subtopics);
      }
    }
    return count;
  }
}
