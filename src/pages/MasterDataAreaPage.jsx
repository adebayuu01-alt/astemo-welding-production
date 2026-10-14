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
import AntDateRangePicker from '../components/AntDateRangePicker';
import ModalPortal from '../components/ModalPortal';
import PageHeaderCard from '../components/PageHeaderCard';

export default function MasterDataAreaPage({ areas = [], onUpdateAreas }) {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState(null);

  // Add / Edit Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [formAreaName, setFormAreaName] = useState('');

  // Delete State
  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const filteredAreas = areas.filter((item) =>
    item.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEntries = filteredAreas.length;
  const totalPages = Math.ceil(totalEntries / itemsPerPage) || 1;
  const paginatedAreas = filteredAreas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenAdd = () => {
    setEditingArea(null);
    setFormAreaName('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingArea(item);
    setFormAreaName(item.area);
    setShowAddModal(true);
  };

  const handleSaveArea = (e) => {
    e.preventDefault();
    if (!formAreaName.trim()) {
      setToast({ type: 'error', title: 'Error', message: 'Area name is required.' });
      return;
    }

    if (editingArea) {
      const updated = areas.map((item) =>
        item.id === editingArea.id
          ? { ...item, area: formAreaName.trim() }
          : item
      );
      onUpdateAreas(updated);
      setToast({
        type: 'success',
        title: 'Berhasil Diperbarui',
        message: `Area ${formAreaName} berhasil diperbarui.`
      });
    } else {
      const newArea = {
        id: Date.now(),
        area: formAreaName.trim(),
        datetime: new Date().toLocaleDateString('en-GB') + ' 12:00'
      };
      onUpdateAreas([...areas, newArea]);
      setToast({
        type: 'success',
        title: 'Berhasil Ditambahkan',
        message: `Area ${formAreaName} berhasil ditambahkan.`
      });
    }

    setShowAddModal(false);
    setEditingArea(null);
    setFormAreaName('');
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onUpdateAreas(areas.filter((item) => item.id !== deleteId));
      setToast({
        type: 'success',
        title: 'Berhasil Dihapus',
        message: 'Area berhasil dihapus.'
      });
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Header Card */}
        <PageHeaderCard
          title="Area"
          subtitle="List welding area data"
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
                placeholder="Search area..."
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
            <SkeletonTable rows={5} cols={4} />
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
                    <th className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Area</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 w-56">
                      <div className="flex items-center gap-1.5 cursor-pointer select-none">
                        <span>Datetime</span>
                        <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-center w-28">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC] bg-white">
                  {paginatedAreas.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 text-gray-600 font-medium leading-5">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3.5 px-4 text-gray-800 font-semibold leading-5">
                        {item.area}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 leading-5">
                        {item.datetime}
                      </td>
                      <td className="py-3.5 px-4 text-center leading-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 border border-amber-300 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Area"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(item.id)}
                            className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Area"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedAreas.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400">
                        Tidak ada data area ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-500 select-none">
            <div>
              Showing{' '}
              <span className="font-semibold text-gray-800">
                {totalEntries > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-gray-800">
                {Math.min(currentPage * itemsPerPage, totalEntries)}
              </span>{' '}
              of <span className="font-semibold text-gray-800">{totalEntries}</span> entries
            </div>

            <div className="flex items-center gap-2">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page Number Box */}
              <span className="px-3 py-1 border border-gray-200 rounded-lg text-gray-800 font-semibold bg-gray-50">
                {currentPage}
              </span>
              <span className="text-gray-400">/ {totalPages}</span>

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
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
      <ModalPortal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {editingArea ? 'Edit Area' : 'Add Area'}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {editingArea ? 'Update area welding name' : 'Enter new welding area name'}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveArea} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Area Name
              </label>
              <input
                type="text"
                value={formAreaName}
                onChange={(e) => setFormAreaName(e.target.value)}
                placeholder="e.g. Projection Weld"
                className="w-full h-11 px-3.5 bg-white border border-[#D0D5DD] rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#00A854]"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#00A854] hover:bg-[#008C45] text-white rounded-lg text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </ModalPortal>

      {/* Delete Confirmation Modal */}
      <ModalPortal isOpen={!!deleteId} onClose={() => setDeleteId(null)}>
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Konfirmasi Hapus</h3>
            <p className="text-xs text-gray-500 mt-1">
              Apakah Anda yakin ingin menghapus data area ini? Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              Hapus
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
