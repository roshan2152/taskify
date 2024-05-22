export type ProjectId = string;

export type ProjectType = {
  id: string,
  projectName: string,
  members: string[],        
  boards: string[],
  userId: string
}