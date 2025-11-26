export interface Product {
    id: string;                 // Firestore Document ID (auto)
    code: string;               // P00001 格式

    name: string;               // 商品名称
    description?: string;

    janId: string;
    // 描述（可选）

    // -----------------------------
    // 🔥 分类引用（未来 SKU / 分析会用到）
    // -----------------------------
    categoryId: string;         // categories 集合的 ID
    categoryName?: string;      // 缓存展示文本（不控制逻辑，可选）

    // -----------------------------
    // 🔥 颜色引用（多选）
    // -----------------------------
    colorId: string;         // colors 集合的 ID 列表
    colorName?: string;


    costPrice?: number;
    salePrice?: number;
    // 缓存展示文本（可选）
    stock?: number;           // 总库存（可选）
    // -----------------------------
    // 🔥 SKU 结构支持（未来扩展库存 / 销售）


    // 未来你可以添加：
    // variants?: { colorId: string; stock: number; price?: number }[];

    // -----------------------------
    // 图片
    // -----------------------------
    imageUrl?: string;
    imagePath?: string;

    //型号
    modleId?: string;
    modleName?: string;

    // -----------------------------
    // 系统字段
    // -----------------------------
    createdAt: any;
    updatedAt: any;
    createdBy?: string;
    updatedBy?: string;

    available?: boolean;         // 是否隐藏商品
    tags?: string[];            // 搜索加速标签 (可选)
}
