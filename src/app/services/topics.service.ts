import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Topic } from '../models/topic.model';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {
  private platformId = inject(PLATFORM_ID);
  private topicsSubject = new BehaviorSubject<Topic[]>(this.getInitialTopics());
  public topics$: Observable<Topic[]> = this.topicsSubject.asObservable();

  private getInitialTopics(): Topic[] {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedTopics = localStorage.getItem('devops-topics');
        if (savedTopics) {
          const parsed = JSON.parse(savedTopics);
          // Validate that parsed data is an array
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch (error) {
        // If there's an error reading/parsing localStorage, fall through to default topics
        console.error('Error loading topics from localStorage:', error);
      }
    }

    return [
      { id: '1', name: 'Linux', number: '1', completed: false, expanded: false, subtopics: [] },
      { id: '2', name: 'Networking', number: '2', completed: false, expanded: false, subtopics: [] },
      { id: '3', name: 'Docker', number: '3', completed: false, expanded: false, subtopics: [] },
      { id: '4', name: 'AWS Basics', number: '4', completed: false, expanded: false, subtopics: [] },
      { id: '5', name: 'ECR', number: '5', completed: false, expanded: false, subtopics: [] },
      { id: '6', name: 'RDS', number: '6', completed: false, expanded: false, subtopics: [] },
      { id: '7', name: 'ECS', number: '7', completed: false, expanded: false, subtopics: [] },
      { id: '8', name: 'Terraform', number: '8', completed: false, expanded: false, subtopics: [] },
      { id: '9', name: 'Github Actions', number: '9', completed: false, expanded: false, subtopics: [] },
      { id: '10', name: 'Kubernetes', number: '10', completed: false, expanded: false, subtopics: [] }
    ];
  }

  getTopics(): Topic[] {
    return this.topicsSubject.value;
  }

  addTopic(name: string): void {
    const topics = this.getTopics();
    const newTopic: Topic = {
      id: Date.now().toString(),
      name,
      number: (topics.length + 1).toString(),
      completed: false,
      expanded: false,
      subtopics: []
    };
    topics.push(newTopic);
    this.updateTopics(topics);
  }

  addSubtopic(parentId: string, name: string): void {
    const topics = this.getTopics();
    const parent = this.findTopicById(topics, parentId);

    if (parent) {
      const subtopicNumber = parent.subtopics.length + 1;
      const newSubtopic: Topic = {
        id: `${parentId}-${Date.now()}`,
        name: name,
        number: `${parent.number}.${subtopicNumber}`,
        completed: false,
        expanded: false,
        subtopics: [],
        parentId
      };
      parent.subtopics.push(newSubtopic);
      parent.expanded = true;
      this.updateTopics(topics);
    }
  }

  toggleComplete(topicId: string): void {
    const topics = this.getTopics();
    const topic = this.findTopicById(topics, topicId);

    if (topic) {
      topic.completed = !topic.completed;
      this.updateTopics(topics);
    }
  }

  toggleCompleteWithChildren(topicId: string): void {
    const topics = this.getTopics();
    const topic = this.findTopicById(topics, topicId);

    if (topic) {
      const newCompletedState = !topic.completed;
      topic.completed = newCompletedState;

      // Toggle all children to match parent
      this.setChildrenCompleteState(topic, newCompletedState);

      this.updateTopics(topics);
    }
  }

  private setChildrenCompleteState(topic: Topic, completed: boolean): void {
    if (topic.subtopics && topic.subtopics.length > 0) {
      for (const subtopic of topic.subtopics) {
        subtopic.completed = completed;
        this.setChildrenCompleteState(subtopic, completed);
      }
    }
  }

  toggleExpanded(topicId: string): void {
    const topics = this.getTopics();
    const topic = this.findTopicById(topics, topicId);

    if (topic) {
      topic.expanded = !topic.expanded;
      this.updateTopics(topics);
    }
  }

  updateTopicName(topicId: string, newName: string): void {
    const topics = this.getTopics();
    const topic = this.findTopicById(topics, topicId);

    if (topic) {
      topic.name = newName;
      this.updateTopics(topics);
    }
  }

  private findTopicById(topics: Topic[], id: string): Topic | null {
    for (const topic of topics) {
      if (topic && topic.id === id) {
        return topic;
      }
      if (topic && topic.subtopics && topic.subtopics.length > 0) {
        const found = this.findTopicById(topic.subtopics, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  private updateTopics(topics: Topic[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('devops-topics', JSON.stringify(topics));
    }
    this.topicsSubject.next(topics);
  }
}
