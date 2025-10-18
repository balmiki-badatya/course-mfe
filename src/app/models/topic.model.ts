export interface Topic {
  id: string;
  name: string;
  number: string;
  completed: boolean;
  expanded: boolean;
  subtopics: Topic[];
  parentId?: string;
}
