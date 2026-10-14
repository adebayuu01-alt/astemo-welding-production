import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import dayjs from 'dayjs';
import SkeletonTable from '../components/SkeletonTable';
import Toast from '../components/Toast';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

export default function SettingThresholdPage({
  thresholds = [],
  onUpdateThresholds,
  availableParameters = ['Ampere', 'Welding Time']
}) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Sorting
  const [sortField, setSortField] = useState('no');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

  // Add / Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formParameter, setFormParameter] = useState('Ampere');
  const [formMaxValue, setFormMaxValue] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredThresholds = useMemo(() => {
    return thresholds
      .filter((item) => {
        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchParam = item.parameter.toLowerCase().includes(query);
          const matchVal = String(item.maxValue).toLowerCase().includes(query);
          if (!matchParam && !matchVal) return false;
        }

        // Date range filter
        if (dateRange && dateRange[0] && dateRange[1]) {
          if (item.datetime) {
            const itemDate = dayjs(item.datetime, 'DD/MM/YYYY HH:mm');
            if (itemDate.isValid()) {
              if (
                itemDate.isBefore(dateRange[0], 'day') ||
                itemDate.isAfter(dateRange[1], 'day')
              ) {
                return false;
              }
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'no') {
          valA = a.id;
          valB = b.id;
        } else if (sortField === 'parameter') {
          valA = a.parameter || '';
          valB = b.parameter || '';
        } else if (sortField === 'maxValue') {
          valA = Number(a.maxValue) || 0;
          valB = Number(b.maxValue) || 0;
        } else if (sortField === 'datetime') {
          valA = a.datetime || '';
          valB = b.datetime || '';
        }

        if (typeof valA === 'string') {
          return sortDirection === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
  }, [thresholds, searchQuery, dateRange, sortField, sortDirection]);

  const totalEntries = filteredThresholds.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedThresholds = filteredThresholds.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormParameter(availableParameters[0] || 'Ampere');
    setFormMaxValue('');
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormParameter(item.parameter);
    setFormMaxValue(String(item.maxValue));
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formParameter.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Parameter is required.' });
      return;
    }
    if (formMaxValue === '' || isNaN(Number(formMaxValue))) {
      setToast({
        type: 'error',
        title: 'Error',
        message: 'Please enter a valid numeric Max Value.'
      });
      return;
    }

    const numericValue = Number(formMaxValue);

    if (editingItem) {
      const updated = thresholds.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              parameter: formParameter.trim(),
              maxValue: numericValue
            }
          : item
      );
      onUpdateThresholds(updated);
      setToast({
        type: 'success',
        title: 'Threshold Updated',
        message: `Threshold for ${formParameter} has been updated to ${numericValue}.`
      });
    } else {
      const newItem = {
        id: Date.now(),
        parameter: formParameter.trim(),
        maxValue: numericValue,
        datetime: dayjs().format('DD/MM/YYYY HH:mm')
      };
      onUpdateThresholds([newItem, ...thresholds]);
      setToast({
        type: 'success',
        title: 'Threshold Added',
        message: `Threshold for ${formParameter} has been created.`
      });
    }

    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onUpdateThresholds(thresholds.filter((item) => item.id !== deleteId));
      setToast({
        type: 'success',
        title: 'Threshold Deleted',
        message: 'Threshold data was deleted successfully.'
      });
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Card */}
        <PageHeaderCard
          title="Threshold"
          subtitle="List threshold data"
        />

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-5">
          {/* Action Bar: Search, DateRange, Add Data */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-9 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Ant Design DateRangePicker */}
              <AntDateRangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates)}
              />

              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Data</span>
              </button>
            </div>
          </div>

          {/* Table / Skeleton */}
          {loading ? (
            <SkeletonTable rows={5} cols={5} />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
              <table className="w-full text-left border-collapse text-sm font-sans">
                <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                  <tr className="text-[#23262B] font-semibold">
                    <th className="py-3.5 px-4 w-16">
                      <div
                        onClick={() => handleSort('no')}
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <span>No</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div
                        onClick={() => handleSort('parameter')}
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <span>Parameter</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div
                        onClick={() => handleSort('maxValue')}
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <span>Max Value</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-56">
                      <div
                        onClick={() => handleSort('datetime')}
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                      >
                        <span>Datetime</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedThresholds.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-gray-600 font-medium leading-5">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-semibold leading-5">
                        {item.parameter}
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-medium leading-5">
                        {item.maxValue}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 leading-5">
                        {item.datetime}
                      </td>
                      <td className="py-3.5 px-4 text-center leading-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 border border-amber-300 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Threshold"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Threshold"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedThresholds.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        Tidak ada data threshold ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer matching Figma */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-500 select-none">
            <div>
              Showing{' '}
              <span className="font-semibold text-gray-800">
                {totalEntries > 0 ? startIndex + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-800">
                {Math.min(startIndex + itemsPerPage, totalEntries)}
              </span>{' '}
              of <span className="font-semibold text-gray-800">{totalEntries}</span> entries
            </div>

            <div className="flex items-center gap-2">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safeCurrentPage === 1}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Box */}
              <span className="px-3 py-1 border border-gray-200 rounded-lg text-gray-800 font-semibold bg-gray-50">
                {safeCurrentPage}
              </span>
              <span className="text-gray-400">/ {totalPages}</span>

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safeCurrentPage === totalPages}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Items per page selector */}
              <div className="flex items-center gap-1.5 ml-3">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <ModalPortal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {editingItem ? 'Edit Threshold' : 'Add Threshold'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure maximum threshold limits for parameter
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Parameter <span className="text-red-500">*</span>
              </label>
              <select
                value={formParameter}
                onChange={(e) => setFormParameter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:border-emerald-500"
              >
                {availableParameters.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Max Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formMaxValue}
                onChange={(e) => setFormMaxValue(e.target.value)}
                placeholder="e.g. 20 or 1000"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
              >
                {editingItem ? 'Save Changes' : 'Add Threshold'}
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <ModalPortal isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Delete Threshold?</h3>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete this threshold entry? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-6 py-2.5 bg-[#F04438] hover:bg-[#D92D20] text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
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
