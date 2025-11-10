export interface Task {
    id?: string;
    uid?: string;
    name: string;
    startTime: string;
    endTime: string;
    date: string;
    priority: '重要' | '紧急' | '不重要・不紧急';
    done: boolean;
    type: 'personal' | 'team'; // 类型（个人 / 团队）
    createdAt?: any;         // Firestore Timestamp
    updatedAt?: any;
    isShared?: boolean;
    teamMembers?: string[];  // 共享任务时的成员UID数组
    showActions?: boolean;   // UI用字段
    // ✅ 下面这两个是前端专用的临时属性，不会存到数据库
    editing?: boolean;
    backup?: Partial<Task>;

}