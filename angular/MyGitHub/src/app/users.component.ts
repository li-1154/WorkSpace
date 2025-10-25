// ===============================
//  UsersComponent.ts（带完整注释版）
// ===============================

import { Component } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { Router } from "@angular/router";
import { map, startWith } from "rxjs/operators";
import { combineLatest, Observable } from "rxjs";
import { FormControl } from "@angular/forms";

// -------------------------------
// ① 定义 Firestore 集合的接口结构
// -------------------------------
// Firestore 中每个文档（Document）都有 name 和 email 两个字段
interface User {
    name: string;
    email: string;
}

// -------------------------------
// ② 定义 Angular 组件的基本信息
// -------------------------------
@Component({
    selector: 'app-users',                 // 组件选择器，用于模板调用 <app-users>
    templateUrl: './users.component.html', // 模板路径
})
export class UsersComponent {

    // -------------------------------
    // ③ 声明组件内变量
    // -------------------------------

    // userCol：对应 Firestore 中的 "users" 集合
    userCol: AngularFirestoreCollection<User>;

    // users：从 Firestore 获取的“原始”用户数据流（Observable）
    users: Observable<any[]>;

    // filteredUsers：经过搜索过滤后的用户数据流（Observable）
    filteredUsers: Observable<any[]>;

    // searchControl：与 HTML 输入框双向绑定的表单控制器
    // 每当输入框文字变化时，都会触发新的值（valueChanges）
    searchControl = new FormControl('');

    // -------------------------------
    // ④ 构造函数：注入依赖
    // -------------------------------
    constructor(
        private afs: AngularFirestore, // 注入 Firestore 服务
        private _router: Router        // 注入路由对象，用于跳转
    ) { }

    // -------------------------------
    // ⑤ 生命周期钩子 ngOnInit
    // -------------------------------
    ngOnInit() {

        // (1) 从 Firestore 取得 "users" 集合的引用
        this.userCol = this.afs.collection('users');

        // (2) 使用 snapshotChanges() 获取带 ID 的实时数据流
        //     snapshotChanges() 会在：
        //        - 集合新增/删除文档
        //        - 文档内容被更新
        //     时自动触发更新
        this.users = this.userCol.snapshotChanges().pipe(
            map(actions =>
                // actions 是一个数组，包含集合内每个文档的元数据
                actions.map(a => {
                    // a.payload.doc.data() 拿到文档内容
                    const data = a.payload.doc.data() as User;
                    // a.payload.doc.id 拿到文档 ID
                    const id = a.payload.doc.id;
                    // 返回 { id, data } 对象（方便后续操作）
                    return { id, data };
                })
            )
        );

        // (3) 建立过滤逻辑 filteredUsers（响应式组合）
        //     combineLatest() 用于组合多个 Observable：
        //       - users（数据库数据流）
        //       - searchControl.valueChanges（搜索框输入流）
        //
        //     每当任意一个变化时，都会重新计算新的 filteredUsers。
        this.filteredUsers = combineLatest([
            this.users,                                   // 数据流①：来自 Firestore 的用户数据
            this.searchControl.valueChanges.pipe(
                startWith('')                             // 初始值为空字符串 → 页面初始时显示全部
            )
        ]).pipe(
            // (4) map 对组合后的两个值（users, searchText）进行处理
            map(([users, searchText]) =>
                // 遍历 users，根据输入框关键字过滤结果
                users.filter(user =>
                    user.data.name.toLowerCase().includes(searchText.toLowerCase()) || // 按名字匹配
                    user.data.email.toLowerCase().includes(searchText.toLowerCase())   // 按邮箱匹配
                )
            )
        );

        // (5) 控制台输出，用于调试（可以看到原始的 users$ 流）
        console.log('user', this.users);
    }

    // -------------------------------
    // ⑥ 新增按钮事件：跳转到新增页面
    // -------------------------------
    add() {
        // 通过 Angular 路由跳转到 /add 页面
        this._router.navigate(['/add']);
    }

    // -------------------------------
    // ⑦ 删除按钮事件
    // -------------------------------
    delete(id: string, name: string) {
        // 弹出确认框
        if (confirm("Are you sure to delete user: " + name + " ?")) {
            // 删除指定文档（users/{id}）
            this.afs.doc('users/' + id).delete();
        }
    }
}
