import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  // 多版本进度记录（每次更新只需新增一项）
  phases = [
    {
      version: 'v1.0.0',
      date: '2025-10-25',
      items: [
        '实现用户登录与注册功能',
        '实现笔记新增 / 编辑 / 删除功能',
        '完善界面美化与用户体验'
      ],
      message:
        '该版本完成了系统的基础功能与主要交互流程，' +
        '包括用户认证、笔记管理模块及核心界面布局。' +
        '整体功能已可稳定运行，为后续优化和扩展奠定基础。'
    },
    {
      version: 'v1.1.0',
      date: '2025-11-01',
      items: [
        '界面样式优化，统一按钮与表单风格',
        '新增关于”页面',
        '优化登录页与注册页逻辑',
        '修复登出后标题未刷新问题',
      ],
      message:
        '在这一版本中，主要关注用户界面的统一与体验优化。',
    }
    // 🔜 以后你只需在这里追加新版本记录即可
  ];

  features = [
    '✅ 账号注册与登录功能',
    '✅ 个人笔记管理（新增 / 编辑 / 删除）',
    '✅ 自动保存与即时更新',
    '✅ 响应式设计，支持手机访问',
    '🌱 持续改进与功能扩展中'
  ];

  contact: string =
    '欢迎一起交流与分享。如果你有建议或想法，欢迎留言或联系我。';
}
