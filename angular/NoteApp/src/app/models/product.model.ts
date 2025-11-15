export interface Product {
    id: string;              // Firestore Document ID（可能是 P00001 也可能随机）
    code: string;            // 商品编号：用于展示、打印、管理，例如 P00001
    name: string;            // 商品名称
    category: string;        // 分类，例如：鞋类、化妆品、电子产品等
    description?: string;    // 商品描述（可选）

    imageUrl?: string;       // 商品主图（存 Storage URL）
    imagePath?: string;      // 用于删除或更新 Storage 图片时使用

    hasVariants: boolean;    // 是否有多个变体（颜色/尺码等）

    createdAt: any;          // Firestore Timestamp
    updatedAt: any;          // Firestore Timestamp
    createdBy?: string;      // 创建这个商品的用户 UID
    updatedBy?: string;      // 最后修改用户 UID

    // 可扩展字段（保留未来业务用，不破坏结构）
    tags?: string[];         // 搜索标签 或 可用于未来筛选
    archived?: boolean;      // 是否隐藏商品（软删除）
}