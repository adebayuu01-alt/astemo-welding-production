import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  Upload,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown
} from 'lucide-react';
import dayjs from 'dayjs';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import Toast from '../components/Toast';
import PlanningProductionForm from '../components/PlanningProductionForm';
import { INITIAL_PLANNING } from '../data/mockData';

export default function PlanningProductionPage() {
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'add'
  const [plans, setPlans] = useState(INITIAL_PLANNING);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);
  const [sortField, setSortField] = useState('no');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [toast, setToast] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchPeriod = p.period.toLowerCase().includes(query);
        const matchS1 = p.shift1Items.some((i) => i.part.toLowerCase().includes(query) || i.qty.toLowerCase().includes(query));
        const matchS2 = p.shift2Items.some((i) => i.part.toLowerCase().includes(query) || i.qty.toLowerCase().includes(query));
        const matchS3 = p.shift3Items.some((i) => i.part.toLowerCase().includes(query) || i.qty.toLowerCase().includes(query));
        if (!matchPeriod && !matchS1 && !matchS2 && !matchS3) return false;
      }

      // Date range filter
      if (dateRange && dateRange[0] && dateRange[1]) {
        if (p.datetime) {
          const itemDate = dayjs(p.datetime, 'DD/MM/YYYY HH:mm');
          if (itemDate.isValid()) {
            if (itemDate.isBefore(dateRange[0], 'day') || itemDate.isAfter(dateRange[1], 'day')) {
              return false;
            }
          }
        }
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'no') {
        valA = a.id;
        valB = b.id;
      } else if (sortField === 'shift1') {
        valA = a.shift1Items[0]?.part || '';
        valB = b.shift1Items[0]?.part || '';
      } else if (sortField === 'qty1') {
        valA = parseInt(a.shift1Items[0]?.qty || '0', 10);
        valB = parseInt(b.shift1Items[0]?.qty || '0', 10);
      } else if (sortField === 'shift2') {
        valA = a.shift2Items[0]?.part || '';
        valB = b.shift2Items[0]?.part || '';
      } else if (sortField === 'qty2') {
        valA = parseInt(a.shift2Items[0]?.qty || '0', 10);
        valB = parseInt(b.shift2Items[0]?.qty || '0', 10);
      } else if (sortField === 'shift3') {
        valA = a.shift3Items[0]?.part || '';
        valB = b.shift3Items[0]?.part || '';
      } else if (sortField === 'qty3') {
        valA = parseInt(a.shift3Items[0]?.qty || '0', 10);
        valB = parseInt(b.shift3Items[0]?.qty || '0', 10);
      }

      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });
  }, [plans, searchQuery, dateRange, sortField, sortDirection]);

  const totalEntries = filteredPlans.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);
  const endIndex = Math.min(startIndex + itemsPerPage, totalEntries);

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setCurrentView('add');
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setCurrentView('add');
  };

  const handleSavePlan = (planData) => {
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((p) => (p.id === editingPlan.id ? { ...p, ...planData } : p))
      );
      setToast({
        type: 'success',
        title: 'Plan Updated',
        message: `Production plan for ${planData.period} successfully updated.`
      });
    } else {
      setPlans((prev) => [planData, ...prev]);
      setToast({
        type: 'success',
        title: 'Plan Added',
        message: `New production plan for ${planData.period} added successfully.`
      });
    }

    setCurrentView('list');
    setEditingPlan(null);
  };

  const handleDeleteConfirm = () => {
    setPlans(plans.filter((p) => p.id !== deletePlanId));
    setDeletePlanId(null);
    setToast({
      type: 'success',
      title: 'Plan Deleted',
      message: 'Production plan was removed successfully.'
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setToast({
        type: 'error',
        title: 'File Required',
        message: 'Please select or drop an Excel/CSV file first.'
      });
      return;
    }

    const newPlan = {
      id: Date.now(),
      period: `Schedule Import (${selectedFile.name.replace(/\.[^/.]+$/, '')})`,
      shift1Items: [
        { part: 'HK1A1-011-01-01', qty: '200pcs' },
        { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '250pcs' },
        { part: 'S4271-011-01-IN', qty: '450pcs' }
      ],
      shift2Items: [
        { part: 'HK1A1-011-01-01', qty: '150pcs' },
        { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '200pcs' },
        { part: 'S4271-011-01-IN', qty: '300pcs' }
      ],
      shift3Items: [
        { part: 'HK1A1-011-01-01', qty: '100pcs' },
        { part: 'HK1A1-011-01-01-EXP-PHPH', qty: '150pcs' },
        { part: 'S4271-011-01-IN', qty: '250pcs' }
      ],
      datetime: dayjs().format('DD/MM/YYYY HH:mm')
    };

    setPlans((prev) => [newPlan, ...prev]);
    setShowUploadModal(false);
    const uploadedName = selectedFile.name;
    setSelectedFile(null);
    setToast({
      type: 'success',
      title: 'Data Uploaded Successfully',
      message: `Production schedule from "${uploadedName}" has been imported.`
    });
  };

  if (currentView === 'add') {
    return (
      <>
        <PlanningProductionForm
          initialData={editingPlan}
          onSave={handleSavePlan}
          onCancel={() => {
            setCurrentView('list');
            setEditingPlan(null);
          }}
        />
        {toast && (
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="space-y-4 font-sans">
        {/* Top Header Card matching reference screenshot */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[#1E232F]">Planning Production</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              View and manage your production planning data
            </p>
          </div>
        </div>

        {/* Main Content Card matching reference screenshot */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-5">
          {/* Action Toolbar matching reference screenshot */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Search Input on the left */}
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full pl-10 pr-9 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Date Range, Upload Data, Add Data */}
            <div className="flex items-center gap-3">
              <AntDateRangePicker
                value={dateRange}
                onChange={(dates) => {
                  setDateRange(dates);
                  setCurrentPage(1);
                }}
              />

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors shadow-xs"
              >
                <Upload className="w-4 h-4 text-gray-500" />
                <span>Upload Data</span>
              </button>

              <button
                type="button"
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-white" />
                <span>Add Data</span>
              </button>
            </div>
          </div>

          {/* Table matching reference screenshot */}
          <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
            <table className="w-full text-left border-collapse text-sm font-sans">
              <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                <tr className="text-[#23262B] font-semibold text-sm select-none">
                  <th
                    onClick={() => handleSort('no')}
                    className="py-3.5 px-4 w-12 cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>No</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('period')}
                    className="py-3.5 px-4 min-w-[170px] cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Period</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('shift1')}
                    className="py-3.5 px-4 min-w-[210px] cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Shift 1</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('qty1')}
                    className="py-3.5 px-4 w-24 cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Qty</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('shift2')}
                    className="py-3.5 px-4 min-w-[210px] cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Shift 2</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('qty2')}
                    className="py-3.5 px-4 w-24 cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Qty</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('shift3')}
                    className="py-3.5 px-4 min-w-[210px] cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Shift 3</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('qty3')}
                    className="py-3.5 px-4 w-24 cursor-pointer hover:bg-gray-200/50 transition-colors"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Qty</span>
                      <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC] bg-white text-gray-800">
                {paginatedPlans.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
                      No planning production data found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedPlans.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-gray-600 align-middle leading-5">
                        {startIndex + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-gray-800 align-middle leading-5 max-w-[170px]">
                        {item.period}
                      </td>

                      {/* Shift 1 */}
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift1Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.part}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift1Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.qty}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Shift 2 */}
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift2Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.part}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift2Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.qty}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Shift 3 */}
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift3Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.part}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle leading-5">
                        <div className="space-y-1.5">
                          {item.shift3Items.map((s, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full bg-gray-900 flex-shrink-0"></span>
                              <span className="font-normal text-gray-800">{s.qty}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 align-middle text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 border border-amber-300 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Plan"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletePlanId(item.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination matching reference screenshot */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs select-none">
            {/* Entries Count Text */}
            <div className="text-gray-500 font-medium">
              Showing <span className="font-semibold text-gray-700">{totalEntries > 0 ? startIndex + 1 : 0}</span> to{' '}
              <span className="font-semibold text-gray-700">{endIndex}</span> of{' '}
              <span className="font-semibold text-gray-700">{totalEntries}</span> entries
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage <= 1}
                className={`w-8 h-8 rounded-lg border border-[#D0D5DD] flex items-center justify-center transition-colors ${
                  safeCurrentPage <= 1
                    ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-gray-700 font-semibold px-1">
                {safeCurrentPage} <span className="text-gray-400 font-normal">/</span> {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage >= totalPages}
                className={`w-8 h-8 rounded-lg border border-[#D0D5DD] flex items-center justify-center transition-colors ${
                  safeCurrentPage >= totalPages
                    ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 ml-2 text-gray-600">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="py-1 px-2 border border-[#D0D5DD] rounded-lg bg-white text-xs font-medium text-gray-700 focus:outline-none focus:border-[#00A854]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deletePlanId && (
        <ModalPortal isOpen={!!deletePlanId} onClose={() => setDeletePlanId(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-gray-900">Delete Production Plan?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this schedule period? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletePlanId(null)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-[#F04438] hover:bg-[#D92D20] text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Upload Data Modal */}
      {showUploadModal && (
        <ModalPortal isOpen={showUploadModal} onClose={() => { setShowUploadModal(false); setSelectedFile(null); }}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Upload Production Schedule</h3>
                <p className="text-xs text-gray-400 mt-0.5">Upload Excel (.xlsx, .xls) or CSV schedule file</p>
              </div>
              <button
                onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Dropzone Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer select-none ${
                  isDragging
                    ? 'border-[#00A854] bg-[#EAF8F1] scale-[1.01]'
                    : selectedFile
                    ? 'border-[#00A854] bg-[#F4FBF7]'
                    : 'border-[#A6E1C4] hover:border-[#00A854] bg-[#F8FDFB] hover:bg-[#F2FBF6]'
                }`}
              >
                {selectedFile ? (
                  <div className="flex flex-col items-center justify-center">
                    {/* Green File Icon matching Image 1 */}
                    <div className="w-12 h-12 mb-2 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#00A854]" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 2H8C5.79086 2 4 3.79086 4 6V42C4 44.2091 5.79086 46 8 46H32C34.2091 46 36 44.2091 36 42V14L24 2Z" stroke="#00A854" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24 2V14H36" stroke="#00A854" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="11" y="22" width="6" height="4" rx="1" fill="#00A854"/>
                        <rect x="23" y="22" width="6" height="4" rx="1" fill="#00A854"/>
                        <rect x="11" y="30" width="6" height="4" rx="1" fill="#00A854"/>
                        <rect x="23" y="30" width="6" height="4" rx="1" fill="#00A854"/>
                      </svg>
                    </div>

                    <p className="text-sm font-semibold text-[#1E293B] max-w-xs truncate" title={selectedFile.name}>
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-[#00A854] font-medium mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready to import
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="mt-2.5 inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium py-1 px-2.5 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Remove file</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    {/* Green File Icon matching Image 1 */}
                    <div className="w-12 h-12 mb-2.5 flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#00A854]" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 2H8C5.79086 2 4 3.79086 4 6V42C4 44.2091 5.79086 46 8 46H32C34.2091 46 36 44.2091 36 42V14L24 2Z" stroke="#00A854" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24 2V14H36" stroke="#00A854" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="11" y="22" width="6" height="4" rx="1" fill="#00A854"/>
                        <rect x="23" y="22" width="6" height="4" rx="1" fill="#00A854"/>
                        <rect x="11" y="30" width="6" height="4" rx="1" fill="#00A854"/>
                        <rect x="23" y="30" width="6" height="4" rx="1" fill="#00A854"/>
                      </svg>
                    </div>

                    <p className="text-sm font-semibold text-[#1E293B]">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      XLSX, XLS or CSV (max. 10MB)
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowUploadModal(false); setSelectedFile(null); }}
                  className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile}
                  className={`px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all ${
                    selectedFile
                      ? 'bg-[#00A854] hover:bg-[#008C45] text-white cursor-pointer'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Import Data
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* Toast Feedback */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
