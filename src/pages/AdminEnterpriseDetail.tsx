import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Building2, Download, FileText, CheckCircle2, XCircle, History, X } from 'lucide-react';
import { api } from '../lib/api';
import { Task } from '../types';

export default function AdminEnterpriseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enterprise, setEnterprise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await api.admin.getEnterpriseDetail(Number(id));
      setEnterprise(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const res = await api.admin.getAuditLogs(Number(id));
      setAuditLogs(res);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleOpenAuditModal = () => {
    setShowAuditModal(true);
    fetchAuditLogs();
  };

  if (loading) return <div className="py-12 text-center text-slate-400">加载中...</div>;
  if (error) return <div className="py-12 text-center text-red-500 font-bold">{error}</div>;
  if (!enterprise) return <div className="py-12 text-center text-slate-400">未找到企业信息</div>;

  const calculateProgress = (task: Task) => {
    if (!task.actual_value) return 0;
    if (task.target_type === 'number') {
      const actual = parseFloat(task.actual_value);
      const target = parseFloat(task.target_value);
      if (target === 0) return 0;
      return Math.min(Math.round((actual / target) * 100), 100);
    } else if (task.target_type === 'boolean') {
      return task.actual_value === task.target_value ? 100 : 0;
    } else {
      return task.actual_value.trim() ? 100 : 0;
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getFieldName = (field: string) => {
    const map: Record<string, string> = {
      actual_value: '实际值',
      remarks: '备注说明'
    };
    return map[field] || field;
  };

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/admin/accounts?tab=enterprises')}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        返回企业列表
      </button>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-xl text-white">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{enterprise.enterprise_name}</h2>
            <p className="text-slate-500 text-sm">账号：{enterprise.username}</p>
          </div>
        </div>
        
        <button
          onClick={handleOpenAuditModal}
          className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors font-medium"
        >
          <History className="w-5 h-5" />
          <span>审计日志</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-900">考核任务填报详情</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4">任务名称</th>
                <th className="px-6 py-4">任务描述</th>
                <th className="px-6 py-4">目标值</th>
                <th className="px-6 py-4">实际值</th>
                <th className="px-6 py-4">佐证附件</th>
                <th className="px-6 py-4">备注说明</th>
                <th className="px-6 py-4 w-48">进度</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enterprise.tasks.map((task: Task) => {
                const progress = calculateProgress(task);
                return (
                  <tr key={task.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{task.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] break-words" title={task.description || ''}>
                      {task.description || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {task.target_type === 'number' ? task.target_value : task.target_type === 'boolean' ? (task.target_value === '是' ? '是' : '否') : '无'}
                    </td>
                    <td className="px-6 py-4">
                      {task.actual_value ? (
                        task.target_type === 'text' ? (
                          <div className="text-slate-900 font-semibold max-w-[250px] break-words" title={task.actual_value}>
                            {task.actual_value}
                          </div>
                        ) : (
                          <span className="text-slate-900 font-semibold">
                            {task.target_type === 'number' ? task.actual_value : (task.actual_value === '是' ? '是' : '否')}
                          </span>
                        )
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {task.attachments && task.attachments.length > 0 ? (
                        <div className="flex flex-col gap-1.5">
                          {task.attachments.map(att => (
                            <a 
                              key={att.id}
                              href={`/api/download/${att.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-medium text-xs group"
                            >
                              <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                              <span className="max-w-[120px] truncate">{att.name}</span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-300 text-sm">未上传</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {task.remarks ? (
                        <div className="text-sm text-slate-600 max-w-[200px] break-words" title={task.remarks}>
                          {task.remarks}
                        </div>
                      ) : (
                        <span className="text-slate-300 text-sm">无备注</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                          <span className={progress === 100 ? 'text-emerald-600' : 'text-slate-400'}>{progress}%</span>
                          {progress === 100 ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : null}
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAuditModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-lg text-slate-900">审计日志</h3>
              </div>
              <button onClick={() => setShowAuditModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-100px)]">
              {auditLoading ? (
                <div className="py-8 text-center text-slate-400">加载中...</div>
              ) : auditLogs.length === 0 ? (
                <div className="py-8 text-center text-slate-400">暂无审计日志</div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                            {log.task_name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {getFieldName(log.field_name)}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">
                          {formatTime(log.created_at)}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-400 w-16">变更前：</span>
                          <span className="text-red-600 font-medium">
                            {log.old_value || '-'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-400 w-16">变更后：</span>
                          <span className="text-emerald-600 font-medium">
                            {log.new_value || '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
