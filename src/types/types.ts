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
  name: string;
  email: string;
  role: string;
  status: string;
  department: string;
  subjects: string[];
  phone?: string;
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
