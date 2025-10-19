import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TopicsListComponent } from './topics-list.component';
import { TopicsService } from '../../services/topics.service';
import { Topic } from '../../models/topic.model';
import { BehaviorSubject } from 'rxjs';

describe('TopicsListComponent', () => {
  let component: TopicsListComponent;
  let fixture: ComponentFixture<TopicsListComponent>;
  let topicsService: jasmine.SpyObj<TopicsService>;
  let topicsSubject: BehaviorSubject<Topic[]>;

  const mockTopics: Topic[] = [
    { id: '1', name: 'Topic 1', number: '1', completed: false, expanded: false, subtopics: [] },
    { id: '2', name: 'Topic 2', number: '2', completed: true, expanded: false, subtopics: [] },
    { id: '3', name: 'Topic 3', number: '3', completed: false, expanded: true, subtopics: [
      { id: '3-1', name: 'Subtopic 3.1', number: '3.1', completed: false, expanded: false, subtopics: [], parentId: '3' }
    ]},
    { id: '4', name: 'Topic 4', number: '4', completed: false, expanded: false, subtopics: [] },
    { id: '5', name: 'Topic 5', number: '5', completed: false, expanded: false, subtopics: [] },
    { id: '6', name: 'Topic 6', number: '6', completed: false, expanded: false, subtopics: [] },
  ];

  beforeEach(async () => {
    topicsSubject = new BehaviorSubject<Topic[]>(mockTopics);

    const topicsServiceSpy = jasmine.createSpyObj('TopicsService', [
      'toggleComplete',
      'toggleCompleteWithChildren',
      'toggleExpanded',
      'updateTopicName',
      'addTopic',
      'addSubtopic'
    ]);
    topicsServiceSpy.topics$ = topicsSubject.asObservable();

    await TestBed.configureTestingModule({
      imports: [TopicsListComponent, FormsModule],
      providers: [
        { provide: TopicsService, useValue: topicsServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TopicsListComponent);
    component = fixture.componentInstance;
    topicsService = TestBed.inject(TopicsService) as jasmine.SpyObj<TopicsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with default values', () => {
      expect(component.currentPage).toBe(1);
      expect(component.itemsPerPage).toBe(5);
      expect(component.isAddingTopic).toBe(false);
      expect(component.newTopicName).toBe('');
      expect(component.addingSubtopicFor).toBeNull();
      expect(component.newSubtopicName).toBe('');
    });

    it('should subscribe to topics$ on init', () => {
      expect(component.topics).toEqual(mockTopics);
    });

    it('should update pagination on init', () => {
      expect(component.paginatedTopics.length).toBe(5);
      expect(component.totalPages).toBe(2);
    });
  });

  describe('updatePagination', () => {
    it('should calculate correct total pages', () => {
      component.topics = mockTopics;
      component.itemsPerPage = 5;

      component.updatePagination();

      expect(component.totalPages).toBe(2);
    });

    it('should paginate topics correctly for first page', () => {
      component.topics = mockTopics;
      component.currentPage = 1;
      component.itemsPerPage = 3;

      component.updatePagination();

      expect(component.paginatedTopics.length).toBe(3);
      expect(component.paginatedTopics[0].id).toBe('1');
      expect(component.paginatedTopics[2].id).toBe('3');
    });

    it('should paginate topics correctly for second page', () => {
      component.topics = mockTopics;
      component.currentPage = 2;
      component.itemsPerPage = 3;

      component.updatePagination();

      expect(component.paginatedTopics.length).toBe(3);
      expect(component.paginatedTopics[0].id).toBe('4');
    });

    it('should handle empty topics array', () => {
      component.topics = [];

      component.updatePagination();

      expect(component.totalPages).toBe(0);
      expect(component.paginatedTopics.length).toBe(0);
    });
  });

  describe('toggleComplete', () => {
    it('should call toggleComplete on service when isParent is false', () => {
      component.toggleComplete('1', false);

      expect(topicsService.toggleComplete).toHaveBeenCalledWith('1');
      expect(topicsService.toggleCompleteWithChildren).not.toHaveBeenCalled();
    });

    it('should call toggleCompleteWithChildren on service when isParent is true', () => {
      component.toggleComplete('1', true);

      expect(topicsService.toggleCompleteWithChildren).toHaveBeenCalledWith('1');
      expect(topicsService.toggleComplete).not.toHaveBeenCalled();
    });
  });

  describe('toggleExpanded', () => {
    it('should call toggleExpanded on service', () => {
      component.toggleExpanded('3');

      expect(topicsService.toggleExpanded).toHaveBeenCalledWith('3');
    });
  });

  describe('subtopic editing', () => {
    it('should start editing subtopic', () => {
      component.startEditingSubtopic('3-1', 'Subtopic 3.1');

      expect(component.editingSubtopics['3-1']).toBe('Subtopic 3.1');
    });

    it('should save subtopic name with trimmed value', () => {
      component.editingSubtopics['3-1'] = '  New Name  ';

      component.saveSubtopicName('3-1');

      expect(topicsService.updateTopicName).toHaveBeenCalledWith('3-1', 'New Name');
      expect(component.editingSubtopics['3-1']).toBeUndefined();
    });

    it('should not save empty subtopic name', () => {
      component.editingSubtopics['3-1'] = '   ';

      component.saveSubtopicName('3-1');

      expect(topicsService.updateTopicName).not.toHaveBeenCalled();
      expect(component.editingSubtopics['3-1']).toBeUndefined();
    });

    it('should cancel editing subtopic', () => {
      component.editingSubtopics['3-1'] = 'Test';

      component.cancelEditingSubtopic('3-1');

      expect(component.editingSubtopics['3-1']).toBeUndefined();
    });

    it('should check if subtopic is being edited', () => {
      component.editingSubtopics['3-1'] = 'Test';

      expect(component.isEditingSubtopic('3-1')).toBe(true);
      expect(component.isEditingSubtopic('3-2')).toBe(false);
    });
  });

  describe('adding subtopic', () => {
    it('should start adding subtopic and expand parent', () => {
      component.startAddingSubtopic('3');

      expect(component.addingSubtopicFor).toBe('3');
      expect(component.newSubtopicName).toBe('');
      expect(topicsService.toggleExpanded).toHaveBeenCalledWith('3');
    });

    it('should save new subtopic with trimmed name', () => {
      component.addingSubtopicFor = '3';
      component.newSubtopicName = '  New Subtopic  ';

      component.saveNewSubtopic();

      expect(topicsService.addSubtopic).toHaveBeenCalledWith('3', 'New Subtopic');
      expect(component.addingSubtopicFor).toBeNull();
      expect(component.newSubtopicName).toBe('');
    });

    it('should not save empty subtopic name', () => {
      component.addingSubtopicFor = '3';
      component.newSubtopicName = '   ';

      component.saveNewSubtopic();

      expect(topicsService.addSubtopic).not.toHaveBeenCalled();
    });

    it('should cancel adding subtopic', () => {
      component.addingSubtopicFor = '3';
      component.newSubtopicName = 'Test';

      component.cancelAddingSubtopic();

      expect(component.addingSubtopicFor).toBeNull();
      expect(component.newSubtopicName).toBe('');
    });

    it('should check if adding subtopic for parent', () => {
      component.addingSubtopicFor = '3';

      expect(component.isAddingSubtopicFor('3')).toBe(true);
      expect(component.isAddingSubtopicFor('1')).toBe(false);
    });
  });

  describe('updateTopicName', () => {
    it('should update topic name with trimmed value', () => {
      const mockEvent = {
        target: { value: '  Updated Name  ' }
      } as unknown as Event;

      component.updateTopicName('1', mockEvent);

      expect(topicsService.updateTopicName).toHaveBeenCalledWith('1', 'Updated Name');
    });

    it('should not update with empty name', () => {
      const mockEvent = {
        target: { value: '   ' }
      } as unknown as Event;

      component.updateTopicName('1', mockEvent);

      expect(topicsService.updateTopicName).not.toHaveBeenCalled();
    });
  });

  describe('adding topic', () => {
    it('should start adding topic', () => {
      component.startAddingTopic();

      expect(component.isAddingTopic).toBe(true);
    });

    it('should cancel adding topic', () => {
      component.isAddingTopic = true;
      component.newTopicName = 'Test';

      component.cancelAddingTopic();

      expect(component.isAddingTopic).toBe(false);
      expect(component.newTopicName).toBe('');
    });

    it('should add new topic with trimmed name', () => {
      component.newTopicName = '  New Topic  ';
      spyOn(component, 'goToLastPage');

      component.addNewTopic();

      expect(topicsService.addTopic).toHaveBeenCalledWith('New Topic');
      expect(component.newTopicName).toBe('');
      expect(component.isAddingTopic).toBe(false);
      expect(component.goToLastPage).toHaveBeenCalled();
    });

    it('should not add topic with empty name', () => {
      component.newTopicName = '   ';

      component.addNewTopic();

      expect(topicsService.addTopic).not.toHaveBeenCalled();
    });
  });

  describe('pagination controls', () => {
    beforeEach(() => {
      component.topics = mockTopics;
      component.itemsPerPage = 3;
      component.updatePagination();
    });

    it('should go to specific page', () => {
      component.goToPage(2);

      expect(component.currentPage).toBe(2);
    });

    it('should go to previous page', () => {
      component.currentPage = 2;

      component.previousPage();

      expect(component.currentPage).toBe(1);
    });

    it('should not go to previous page when on first page', () => {
      component.currentPage = 1;

      component.previousPage();

      expect(component.currentPage).toBe(1);
    });

    it('should go to next page', () => {
      component.currentPage = 1;

      component.nextPage();

      expect(component.currentPage).toBe(2);
    });

    it('should not go to next page when on last page', () => {
      component.currentPage = 2;
      component.totalPages = 2;

      component.nextPage();

      expect(component.currentPage).toBe(2);
    });

    it('should go to last page', () => {
      component.currentPage = 1;
      component.totalPages = 2;

      component.goToLastPage();

      expect(component.currentPage).toBe(2);
    });

    it('should get correct page numbers array', () => {
      component.totalPages = 3;

      const pageNumbers = component.getPageNumbers();

      expect(pageNumbers).toEqual([1, 2, 3]);
    });
  });

  describe('completion percentage', () => {
    it('should calculate completion percentage correctly', () => {
      const topics: Topic[] = [
        { id: '1', name: 'Topic 1', number: '1', completed: true, expanded: false, subtopics: [] },
        { id: '2', name: 'Topic 2', number: '2', completed: false, expanded: false, subtopics: [] },
        { id: '3', name: 'Topic 3', number: '3', completed: true, expanded: false, subtopics: [] },
      ];
      component.topics = topics;

      const percentage = component.getCompletionPercentage();

      expect(percentage).toBe(67);
    });

    it('should return 0 for empty topics', () => {
      component.topics = [];

      const percentage = component.getCompletionPercentage();

      expect(percentage).toBe(0);
    });

    it('should include subtopics in calculation', () => {
      const topics: Topic[] = [
        {
          id: '1',
          name: 'Topic 1',
          number: '1',
          completed: true,
          expanded: false,
          subtopics: [
            { id: '1-1', name: 'Subtopic 1.1', number: '1.1', completed: true, expanded: false, subtopics: [], parentId: '1' },
            { id: '1-2', name: 'Subtopic 1.2', number: '1.2', completed: false, expanded: false, subtopics: [], parentId: '1' },
          ]
        },
        { id: '2', name: 'Topic 2', number: '2', completed: false, expanded: false, subtopics: [] },
      ];
      component.topics = topics;

      const percentage = component.getCompletionPercentage();

      // 2 completed out of 4 total (1 parent + 2 subtopics + 1 parent) = 50%
      expect(percentage).toBe(50);
    });

    it('should handle nested subtopics', () => {
      const topics: Topic[] = [
        {
          id: '1',
          name: 'Topic 1',
          number: '1',
          completed: true,
          expanded: false,
          subtopics: [
            {
              id: '1-1',
              name: 'Subtopic 1.1',
              number: '1.1',
              completed: true,
              expanded: false,
              subtopics: [
                { id: '1-1-1', name: 'Sub-subtopic 1.1.1', number: '1.1.1', completed: true, expanded: false, subtopics: [], parentId: '1-1' }
              ],
              parentId: '1'
            }
          ]
        }
      ];
      component.topics = topics;

      const percentage = component.getCompletionPercentage();

      // All 3 completed = 100%
      expect(percentage).toBe(100);
    });
  });

  describe('reactive updates', () => {
    it('should update topics when topics$ emits new value', () => {
      const newTopics: Topic[] = [
        { id: '10', name: 'New Topic', number: '10', completed: false, expanded: false, subtopics: [] }
      ];

      topicsSubject.next(newTopics);

      expect(component.topics).toEqual(newTopics);
      expect(component.totalPages).toBe(1);
    });
  });

  describe('deleteSubtopic', () => {
    it('should log message when delete is called (permission required)', () => {
      const consoleSpy = spyOn(console, 'log');

      component.deleteSubtopic('3', '3-1');

      expect(consoleSpy).toHaveBeenCalledWith('Delete subtopic 3-1 from parent 3 - Permission required');
    });

    it('should handle delete for different subtopic IDs', () => {
      const consoleSpy = spyOn(console, 'log');

      component.deleteSubtopic('1', '1-1');

      expect(consoleSpy).toHaveBeenCalledWith('Delete subtopic 1-1 from parent 1 - Permission required');
    });
  });
});
