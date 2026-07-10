import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, ChevronRight } from 'lucide-react';

export default function AdminHome() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: '账号管理',
      description: '管理企业账号、配置考核任务、重置密码等',
      icon: Users,
      color: 'bg-blue-500',
      path: '/admin/accounts'
    },
    {
      title: '企业管理',
      description: '查看所有企业的填报进度、数据详情及佐证附件',
      icon: Building2,
      color: 'bg-emerald-500',
      path: '/admin/accounts?tab=enterprises'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">管理端主页</h2>
        <p className="text-slate-500">欢迎回来，管理员。请选择您要执行的操作。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <button
            key={item.title}
            onClick={() => navigate(item.path)}
            className="group relative bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all text-left overflow-hidden"
          >
            <div className={`inline-flex p-4 rounded-2xl ${item.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
            <p className="text-slate-500 leading-relaxed mb-6">{item.description}</p>
            
            <div className="flex items-center text-indigo-600 font-semibold">
              <span>立即进入</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>

            <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-[0.03] -mr-8 -mt-8 rounded-full`} />
          </button>
        ))}
      </div>
    </div>
  );
}
