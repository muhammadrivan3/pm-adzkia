/* eslint-disable */


interface IUser {
  id: string;
  email: string;
  password: string;
  name?: string;
  role?: string;
  status?: string;
}
interface IUserCreate {
  email: string;
  password: string;
  name?: string;
  role?: string;
  status?: string;
}

interface IDosen {
  id: string;
  nama: string;
  email: string;
  // role: string;
  status: string;
  phone?: string;
   // Periode Jabatan
  jabatan: IJabatanPeriode[];
}

interface IJabatanPeriode {
  nama:string;
  departemen: string;
  mataDiampu: string[];
  periode: string;           // contoh: "2024-2025"
  mulai: string;             // format ISO: "2024-08-01"
  akhir: string;             // format ISO: "2025-07-31"
}

interface IKriteria {
  id: string;
  kode: string;
  kriteria: string;
  persentaseCore: number;
  persentaseSecondary: number;
}
interface IKriteriaCreate {
  kode: string;
  kriteria: string;
  persentaseCore: number;
  persentaseSecondary: number;
}

interface ISubKriteria {
  id: string;
  kriteriaId: string;
  kriteriaKode: string;
  subkriteria: string;
  nilaiTarget: number;
  kode: string;
  tipe: "Core" | "Secondary";
}

interface ISubKriteriaCreate {
  kriteriaId: string;
  kriteriaKode: string;
  subkriteria: string;
  nilaiTarget: number;
  kode: string;
  tipe: "Core" | "Secondary";
}
interface IPenilaian {
  id?: string;
  dosenId: string;
  subkriteriaId: string;
  nilai: number;
}
interface IPenilaianCreate {
  id: string;
  dosenId: string;
  subkriteriaId: string;
  nilai: number;
}

interface IPenilaianAuditTrail {
  id?: string; // <-- opsional, akan di-generate Firestore
  dosen: string; // nama dosen
  penilaian: string; // stringified JSON hasil penilaian (total, nilai, gap, bobot)
  periode: string;
}

interface IPenilaianAuditTrailCreate {
  dosen: string;
  penilaian: string;
  periode: string;  
}
