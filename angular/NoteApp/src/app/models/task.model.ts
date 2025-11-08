export interface Task {
    id?: string;
    uid?: string;
    name: string;
    startTime: string;
    endTime: string;
    data: string;
    priority: '重要' | '紧急' | '不重要・不紧急';
    done: boolean;
    type: 'personal' | 'team'; // 类型（个人 / 团队）
    createdAt?: any;         // Firestore Timestamp
    updatedAt?: any;
    isShared?:boolean;
    teamMembers?: string[];  // 共享任务时的成员UID数组
    showActions?: boolean;   // UI用字段
}