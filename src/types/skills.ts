export type SkillCategory = {
  id: string;
  title: string;
  items: string[];
};

export type SkillsFile = {
  /** Show the Stack section on the home page */
  enabled: boolean;
  sectionLabel: string;
  sectionTitle: string;
  categories: SkillCategory[];
};
