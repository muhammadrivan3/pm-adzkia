'use client';
import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Bell,
  Settings
} from 'lucide-react';
import DashboardCard from '@/components/ui/DashboardCard';

const DashboardPage = () => {
  const cards = [
    {
      title: 'Mahasiswa',
      description: 'Jumlah mahasiswa aktif & alumni.',
      icon: Users,
      statValue: 1245,
      statLabel: 'Total Mahasiswa',
      highlight: 'Aktif',
      color: 'blue',
    },
    {
      title: 'Dosen',
      description: 'Dosen pengajar & dosen tamu.',
      icon: GraduationCap,
      statValue: 85,
      statLabel: 'Total Dosen',
      highlight: 'Tetap',
      color: 'green',
    },
    {
      title: 'Mata Kuliah',
      description: 'Mata kuliah aktif semester ini.',
      icon: BookOpen,
      statValue: 42,
      statLabel: 'Mata Kuliah',
      highlight: 'Semester Genap',
      color: 'indigo',
    },
    {
      title: 'Laporan Akademik',
      description: 'Rekap laporan dan absensi.',
      icon: ClipboardList,
      statValue: 150,
      statLabel: 'Laporan Bulan Ini',
      highlight: 'Lengkap',
      color: 'yellow',
    },
    {
      title: 'Notifikasi',
      description: 'Broadcast ke civitas kampus.',
      icon: Bell,
      statValue: 6,
      statLabel: 'Notifikasi Baru',
      highlight: 'Urgent',
      color: 'red',
    },
    {
      title: 'Pengaturan Sistem',
      description: 'Hak akses & konfigurasi.',
      icon: Settings,
      statValue: '✓',
      statLabel: 'Terkonfigurasi',
      highlight: 'Stabil',
      color: 'blue',
    },
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl">
      <h1 className="text-3xl font-bold font-serif mb-8 border-b pb-2 border-gray-300 dark:border-gray-700">
        Dashboard Management
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
