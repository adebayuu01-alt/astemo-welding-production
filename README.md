# ASTEMO - WELDING PRODUCTION (Concept Prototype)

Prototipe interaktif sistem monitoring welding production Hitachi Astemo berdasarkan desain Figma resmi **ASTEMO - WELDING PRODUCTION** dengan standard layout dan komponen dari project **ASTEMO - OEE MACHINE STATUS**.

## Lokasi Project
```
D:\ADE\KERJAAN\PT. Electrindo Inti Dinamika\UIUX PROJECT\ASTEMO - WELDING PRODUCTION\Concept Project
```

---

## Akun Login Default
* **Username**: `suep_astemo`
* **Password**: `suep12345` (atau `password123`)
* **Role**: `SPV` (Supervisor)
* Akun Affan telah dihapus, digantikan oleh Suep sebagai SPV.
* Fitur User Management dan Role Management telah dihilangkan sesuai permintaan.

---

## Layout & Komponen
Mengikuti struktur layout dan komponen standard dari `ASTEMO - OEE MACHINE STATUS`:
1. **Top Navbar**:
   - Logo Hitachi Astemo (clickable untuk kembali ke Dashboard).
   - Tombol toggle sidebar (PanelLeft / PanelLeftClose).
   - Jam dan tanggal realtime (`Day, DD Month YYYY | HH:mm:ss`) di sisi kanan.
2. **Sidebar**:
   - **APPLICATION**:
     - Dashboard (`LayoutDashboard`)
     - Planning Production (`CalendarDays`)
     - Notification (`Bell`)
   - **DATABASE**:
     - Master Data: Parameter, Model
     - Register: Model
   - Tombol **Logout** merah di bagian bawah sidebar.
3. **Footer**:
   - Copyright © 2026 PT. Electrindo Inti Dinamika.

---

## Halaman & Data (Sesuai Figma)

### 1. Dashboard
- **Top Header**: Pilihan Shift (`Shift 1`, `Shift 2`, `Shift 3`) dan Ant Design Date Range Picker.
- **4 Top KPI Metric Cards**:
  - `Current OEE`: 50%
  - `Production Target`: 1.284 pcs
  - `Counting Product`: 1.284 pcs
  - `Rasio Product OK`: 90%
- **Parameter Trend**:
  - Tab switcher: Ampere, Voltage, Cycle Time, Welding Time.
  - Grafik garis kurva actual (biru halus dengan fill gradient) vs batas safety threshold (garis merah).
- **Production Graph**:
  - Grouped bar chart (Senin s/d Jumat) Actual (biru) vs Plan (hijau) lengkap dengan label vertikal angka di dalam bar.
- **OEE Breakdown**:
  - Tombol modal Setting Target OEE (`Setting Target OEE.png`).
  - Bar progress: Actual OEE (50%), Target OEE (100%), Avaibility (50%), Performance (80%), Quality (20%).
- **Product Realtime Status**:
  - Donut chart dengan total 1.284 pcs di tengah dan rasio OK 90% (1.284 pcs) vs Rework 10% (128 pcs).

### 2. Planning Production
- Filter pencarian, date range picker, tombol `Upload Data`, dan `+ Add Data`.
- Data tabel multi-shift lengkap dengan modal form tambah/edit data planning produksi.

### 3. Notification
- Tab filter: `All Notification` dan `Unread Notification`.
- Filter pencarian, date range, dan tombol `Mark As Read`.
- List peringatan parameter (Ampere over limit, dsb.).

### 4. Master Data
- **Parameter**: Manajemen nama parameter, datetime, dan aksi edit/delete.
- **Model**: Manajemen master model parts dan aksi edit/delete.

### 5. Register
- **Model**: Pendaftaran model parts beserta batas threshold parameter (Ampere, Cycle Time, Voltage, Welding Time).

---

## Cara Menjalankan Aplikasi
```bash
npm run dev
```
Buka browser di alamat `http://localhost:3003`.
