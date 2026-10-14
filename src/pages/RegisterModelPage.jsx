import React, { useState, useEffect } from 'react';
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
import SkeletonTable from '../components/SkeletonTable';
import Toast from '../components/Toast';
import CustomDropdown from '../components/CustomDropdown';
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

export default function RegisterModelPage({
  registerModels,
  onUpdateRegisterModels,
  availableModels = [],
  availableParameters = []
}) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Add / Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formModel, setFormModel] = useState('');
  const [formAmpere, setFormAmpere] = useState('95 A');
  const [formWeldingTime, setFormWeldingTime] = useState('1000 s');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const modelOptions = availableModels.map((m) => (typeof m === 'object' ? m.model : m));

  const filteredItems = registerModels.filter((item) =>
    item.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEntries = filteredItems.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormModel(modelOptions[0] || 'HK1A1-001-002');
    setFormAmpere('95 A');
    setFormWeldingTime('1000 s');
    setShowAddModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormModel(item.model);
    setFormAmpere(item.thresholds[0] || '95 A');
    setFormWeldingTime(item.thresholds[1] || '1000 s');
    setShowAddModal(true);
  };

  const handleSaveRegisterModel = (e) => {
    e.preventDefault();
    if (!formModel.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Model is required.' });
      return;
    }

    const parametersList = ['Ampere', 'Welding Time'];
    const thresholdsList = [
      formAmpere.includes('A') ? formAmpere : `${formAmpere} A`,
      formWeldingTime.includes('s') ? formWeldingTime : `${formWeldingTime} s`
    ];

    if (editingItem) {
      const updated = registerModels.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              model: formModel,
              parameters: parametersList,
              thresholds: thresholdsList
            }
          : item
      );
      onUpdateRegisterModels(updated);
      setToast({
        type: 'success',
        title: 'Berhasil Diperbarui',
        message: `Register Model ${formModel} berhasil diperbarui.`
      });
    } else {
      const newItem = {
        id: Date.now(),
        model: formModel,
        parameters: parametersList,
        thresholds: thresholdsList,
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };
      onUpdateRegisterModels([...registerModels, newItem]);
      setToast({
        type: 'success',
        title: 'Berhasil Ditambahkan',
        message: `Register Model ${formModel} berhasil ditambahkan ke sistem.`
      });
    }

    setShowAddModal(false);
    setEditingItem(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onUpdateRegisterModels(registerModels.filter((item) => item.id !== deleteId));
      setToast({
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Register Model berhasil dihapus.'
      });
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Card */}
        <PageHeaderCard
          title="Model"
          subtitle="List parameter data"
        />

        {/* Table Card */}
        <div className="bg-white rounded-xl border border-[#E4E7EC] p-4 shadow-sm space-y-5">
          {/* Filters & Actions */}
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
            <SkeletonTable rows={4} cols={6} />
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#D0D5DD]">
              <table className="w-full text-left border-collapse text-sm font-sans">
                <thead className="bg-[#F2F2F7] border-b border-[#D0D5DD]">
                  <tr className="text-[#23262B] font-semibold">
                    <th className="py-3.5 px-4 w-16">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>No</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-48">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Model</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Parameter</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-48">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Threshold</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-44">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Datetime</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-gray-600 font-medium align-top leading-5">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-semibold align-top leading-5">
                        {item.model}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700 align-top leading-5">
                        <ul className="space-y-1.5 text-xs">
                          {item.parameters.map((p, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#00A854]" />
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-mono text-xs align-top leading-5">
                        <ul className="space-y-1.5">
                          {item.thresholds.map((t, i) => (
                            <li key={i} className="font-semibold text-gray-700">
                              {t}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 align-top leading-5">
                        {item.datetime}
                      </td>
                      <td className="py-3.5 px-4 text-center align-top leading-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 border border-amber-300 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Register Model"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Register Model"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
            <div>
              Showing <span className="font-semibold text-gray-700">1</span> to{' '}
              <span className="font-semibold text-gray-700">
                {Math.min(itemsPerPage, totalEntries)}
              </span>{' '}
              of <span className="font-semibold text-gray-700">{totalEntries}</span>{' '}
              entries
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="w-7 h-7 flex items-center justify-center border border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold rounded-lg text-xs">
                  {currentPage}
                </span>
                <span>/ {totalPages}</span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span>Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-200 rounded-lg bg-white text-gray-700 text-xs focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>entries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Register Model Modal */}
      <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {editingItem ? 'Edit Register Model' : 'Register Model'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Configure parameter thresholds for selected model
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveRegisterModel} className="space-y-4">
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-1.5">
                Model
              </label>
              <CustomDropdown
                value={formModel}
                onChange={(val) => setFormModel(val)}
                options={modelOptions.length ? modelOptions : ['HK1A1-001-002']}
                placeholder="Select Model"
                buttonClassName="h-11 rounded-xl"
              />
            </div>

            {/* Threshold Configurations */}
            <div className="space-y-3 pt-1 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Parameter Thresholds
              </p>

              {/* Ampere */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <span className="text-xs font-semibold text-gray-700">Ampere</span>
                  <p className="text-[11px] text-gray-400">Current limit (A)</p>
                </div>
                <input
                  type="text"
                  value={formAmpere}
                  onChange={(e) => setFormAmpere(e.target.value)}
                  placeholder="95 A"
                  className="h-10 px-3 bg-white border border-[#D0D5DD] rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#00A854]"
                  required
                />
              </div>

              {/* Welding Time */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <span className="text-xs font-semibold text-gray-700">Welding Time</span>
                  <p className="text-[11px] text-gray-400">Welding arc time (s)</p>
                </div>
                <input
                  type="text"
                  value={formWeldingTime}
                  onChange={(e) => setFormWeldingTime(e.target.value)}
                  placeholder="1000 s"
                  className="h-10 px-3 bg-white border border-[#D0D5DD] rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#00A854]"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-medium shadow-sm transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Delete Confirmation Modal */}
      <ModalPortal isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-center">
          <h3 className="text-base font-bold text-gray-900">Delete Register Model?</h3>
          <p className="text-xs text-gray-500">
            Are you sure you want to delete this registered model? This action cannot be undone.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
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

      {/* Toast Alert */}
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
