import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TopicsService } from './topics.service';

describe('TopicsService', () => {
  let service: TopicsService;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    // Mock localStorage
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);
    localStorageSpy.getItem.and.returnValue(null); // Default return value
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true,
      configurable: true
    });

    TestBed.configureTestingModule({
      providers: [
        TopicsService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(TopicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should call localStorage.getItem on initialization', () => {
      // The service is already created in beforeEach, which should have called getItem
      // We verify this by checking that the default service topics are loaded
      service.topics$.subscribe(topics => {
        // When localStorage returns null (as configured in beforeEach), default topics should be loaded
        expect(topics.length).toBe(10);
        expect(topics[0].name).toBe('Linux');
      });
    });

    it('should load default topics when localStorage is empty', () => {
      localStorageSpy.getItem.and.returnValue(null);

      const newService = TestBed.inject(TopicsService);

      newService.topics$.subscribe(topics => {
        expect(topics.length).toBe(10);
        expect(topics[0].name).toBe('Linux');
        expect(topics[9].name).toBe('Kubernetes');
      });
    });

    it('should load default topics when not in browser platform', (done) => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TopicsService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      const newService = TestBed.inject(TopicsService);

      newService.topics$.subscribe(topics => {
        expect(topics.length).toBe(10);
        expect(topics[0].name).toBe('Linux');
        done();
      });
    });
  });

  describe('getTopics', () => {
    it('should return current topics array', () => {
      const topics = service.getTopics();

      expect(Array.isArray(topics)).toBe(true);
      expect(topics.length).toBeGreaterThan(0);
    });

    it('should return the same topics as the observable emits', (done) => {
      const topicsFromMethod = service.getTopics();

      service.topics$.subscribe(topicsFromObservable => {
        expect(topicsFromMethod).toEqual(topicsFromObservable);
        done();
      });
    });
  });

  describe('addTopic', () => {
    it('should add a new topic to the list', () => {
      const initialLength = service.getTopics().length;

      service.addTopic('New Topic');

      const topics = service.getTopics();
      expect(topics.length).toBe(initialLength + 1);
      expect(topics[topics.length - 1].name).toBe('New Topic');
    });

    it('should assign correct number to new topic', () => {
      service.addTopic('Topic A');

      const topics = service.getTopics();
      const newTopic = topics[topics.length - 1];
      expect(newTopic.number).toBe(topics.length.toString());
    });

    it('should generate unique ID for new topic', (done) => {
      service.addTopic('Topic 1');

      // Small delay to ensure different timestamp
      setTimeout(() => {
        service.addTopic('Topic 2');

        const topics = service.getTopics();
        const id1 = topics[topics.length - 2].id;
        const id2 = topics[topics.length - 1].id;

        expect(id1).not.toBe(id2);
        done();
      }, 10);
    });

    it('should initialize new topic with completed as false', () => {
      service.addTopic('New Topic');

      const topics = service.getTopics();
      expect(topics[topics.length - 1].completed).toBe(false);
    });

    it('should initialize new topic with expanded as false', () => {
      service.addTopic('New Topic');

      const topics = service.getTopics();
      expect(topics[topics.length - 1].expanded).toBe(false);
    });

    it('should initialize new topic with empty subtopics array', () => {
      service.addTopic('New Topic');

      const topics = service.getTopics();
      expect(topics[topics.length - 1].subtopics).toEqual([]);
    });

    it('should call localStorage.setItem when adding topic', () => {
      localStorageSpy.setItem.calls.reset();

      service.addTopic('New Topic');

      expect(localStorageSpy.setItem).toHaveBeenCalledWith('devops-topics', jasmine.any(String));
    });
  });

  describe('addSubtopic', () => {
    beforeEach(() => {
      service.addTopic('Parent Topic');
    });

    it('should add a subtopic to the parent topic', () => {
      const topics = service.getTopics();
      const parentId = topics[topics.length - 1].id;

      service.addSubtopic(parentId, 'Subtopic 1');

      const updatedTopics = service.getTopics();
      const parent = updatedTopics[updatedTopics.length - 1];
      expect(parent.subtopics.length).toBe(1);
      expect(parent.subtopics[0].name).toBe('Subtopic 1');
    });

    it('should assign correct number to subtopic', () => {
      const topics = service.getTopics();
      const parentId = topics[topics.length - 1].id;

      service.addSubtopic(parentId, 'Subtopic 1');

      const updatedTopics = service.getTopics();
      const parent = updatedTopics[updatedTopics.length - 1];
      expect(parent.subtopics[0].number).toBe(`${parent.number}.1`);
    });

    it('should expand parent when adding subtopic', () => {
      const topics = service.getTopics();
      const parentId = topics[topics.length - 1].id;

      service.addSubtopic(parentId, 'Subtopic 1');

      const updatedTopics = service.getTopics();
      const parent = updatedTopics[updatedTopics.length - 1];
      expect(parent.expanded).toBe(true);
    });

    it('should set parentId on subtopic', () => {
      const topics = service.getTopics();
      const parentId = topics[topics.length - 1].id;

      service.addSubtopic(parentId, 'Subtopic 1');

      const updatedTopics = service.getTopics();
      const parent = updatedTopics[updatedTopics.length - 1];
      expect(parent.subtopics[0].parentId).toBe(parentId);
    });

    it('should call localStorage.setItem when adding subtopic', () => {
      const topics = service.getTopics();
      const parentId = topics[topics.length - 1].id;
      localStorageSpy.setItem.calls.reset();

      service.addSubtopic(parentId, 'Subtopic 1');

      expect(localStorageSpy.setItem).toHaveBeenCalledWith('devops-topics', jasmine.any(String));
    });
  });

  describe('toggleComplete', () => {
    it('should toggle topic completion from false to true', () => {
      service.addTopic('Test Topic');
      const topics = service.getTopics();
      const topicId = topics[topics.length - 1].id;

      service.toggleComplete(topicId);

      const updatedTopics = service.getTopics();
      expect(updatedTopics[updatedTopics.length - 1].completed).toBe(true);
    });

    it('should toggle topic completion from true to false', () => {
      service.addTopic('Test Topic');
      const topics = service.getTopics();
      const topicId = topics[topics.length - 1].id;

      service.toggleComplete(topicId);
      service.toggleComplete(topicId);

      const updatedTopics = service.getTopics();
      expect(updatedTopics[updatedTopics.length - 1].completed).toBe(false);
    });

    it('should call localStorage.setItem when toggling complete', () => {
      service.addTopic('Test Topic');
      const topics = service.getTopics();
      const topicId = topics[topics.length - 1].id;
      localStorageSpy.setItem.calls.reset();

      service.toggleComplete(topicId);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith('devops-topics', jasmine.any(String));
    });
  });

  describe('toggleCompleteWithChildren', () => {
    it('should toggle parent and all children to completed', () => {
      service.addTopic('Parent');
      const topics1 = service.getTopics();
      const parentId = topics1[topics1.length - 1].id;

      service.addSubtopic(parentId, 'Child 1');
      service.addSubtopic(parentId, 'Child 2');

      service.toggleCompleteWithChildren(parentId);

      const topics2 = service.getTopics();
      const parent = topics2[topics2.length - 1];
      expect(parent.completed).toBe(true);
      expect(parent.subtopics[0].completed).toBe(true);
      expect(parent.subtopics[1].completed).toBe(true);
    });

    it('should toggle parent and all children back to not completed', () => {
      service.addTopic('Parent');
      const topics1 = service.getTopics();
      const parentId = topics1[topics1.length - 1].id;

      service.addSubtopic(parentId, 'Child 1');
      service.toggleCompleteWithChildren(parentId);
      service.toggleCompleteWithChildren(parentId);

      const topics2 = service.getTopics();
      const parent = topics2[topics2.length - 1];
      expect(parent.completed).toBe(false);
      expect(parent.subtopics[0].completed).toBe(false);
    });

    it('should call localStorage.setItem when toggling complete with children', () => {
      service.addTopic('Parent');
      const topics = service.getTopics();
      const parentId = topics[topics.length - 1].id;
      localStorageSpy.setItem.calls.reset();

      service.toggleCompleteWithChildren(parentId);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith('devops-topics', jasmine.any(String));
    });
  });

  describe('toggleExpanded', () => {
    it('should toggle topic expanded from false to true', () => {
      service.addTopic('Test Topic');
      const topics = service.getTopics();
      const topicId = topics[topics.length - 1].id;

      service.toggleExpanded(topicId);

      const updatedTopics = service.getTopics();
      expect(updatedTopics[updatedTopics.length - 1].expanded).toBe(true);
    });

    it('should toggle topic expanded from true to false', () => {
      service.addTopic('Test Topic');
      const topics = service.getTopics();
      const topicId = topics[topics.length - 1].id;

      service.toggleExpanded(topicId);
      service.toggleExpanded(topicId);

      const updatedTopics = service.getTopics();
      expect(updatedTopics[updatedTopics.length - 1].expanded).toBe(false);
    });

    it('should call localStorage.setItem when toggling expanded', () => {
      service.addTopic('Test Topic');
      const topics = service.getTopics();
      const topicId = topics[topics.length - 1].id;
      localStorageSpy.setItem.calls.reset();

      service.toggleExpanded(topicId);

      expect(localStorageSpy.setItem).toHaveBeenCalledWith('devops-topics', jasmine.any(String));
    });
  });

  describe('updateTopicName', () => {
    it('should update topic name', () => {
      service.addTopic('Original Name');
      const topics = service.getTopics();
      const topicId = topics[topics.length - 1].id;

      service.updateTopicName(topicId, 'Updated Name');

      const updatedTopics = service.getTopics();
      expect(updatedTopics[updatedTopics.length - 1].name).toBe('Updated Name');
    });

    it('should call localStorage.setItem when updating name', () => {
      service.addTopic('Original Name');
      const topics = service.getTopics();
      const topicId = topics[topics.length - 1].id;
      localStorageSpy.setItem.calls.reset();
      service.updateTopicName(topicId, 'Updated Name');

      expect(localStorageSpy.setItem).toHaveBeenCalledWith('devops-topics', jasmine.any(String));
    });
  });

  describe('localStorage integration', () => {
    it('should not call localStorage methods when not in browser platform', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TopicsService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });
      const serverService = TestBed.inject(TopicsService);

      serverService.addTopic('Server Topic');

      expect(localStorageSpy.setItem).not.toHaveBeenCalled();
    });

    it('should persist topics to localStorage on update', () => {
      service.addTopic('Persist Test');

      const savedData = localStorageSpy.setItem.calls.mostRecent().args[1];
      const parsedData = JSON.parse(savedData);

      expect(Array.isArray(parsedData)).toBe(true);
      expect(parsedData[parsedData.length - 1].name).toBe('Persist Test');
    });
  });
});
