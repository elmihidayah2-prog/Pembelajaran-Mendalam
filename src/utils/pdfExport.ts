import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentData } from '../types/assessment';
import { ExportPart } from './docxExport';

export function generatePdfBlob(data: AssessmentData, part: ExportPart): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const meta = data.metadata;

  const bagianTitleMap: Record<ExportPart, string> = {
    all: 'PERANGKAT LENGKAP ASESMEN',
    kisi: 'KISI-KISI SOAL ASESMEN',
    soal: 'NASKAH SOAL ASESMEN (PESERTA DIDIK)',
    kunci: 'KUNCI JAWABAN & PEMBAHASAN',
    rubrik: 'RUBRIK & PEDOMAN PENSKORAN',
  };

  const drawKopSurat = (titleBagian: string) => {
    // Header Kop
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 37, 64); // Navy
    doc.text('KEMENTERIAN KELAUTAN DAN PERIKANAN', pageWidth / 2, 13, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text('BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN', pageWidth / 2, 18, { align: 'center' });

    doc.setFontSize(13);
    doc.setTextColor(10, 37, 64);
    doc.text('SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) NEGERI TEGAL', pageWidth / 2, 24, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Jl. Martoloyo PO BOX 22 Tegal 52121 - Jawa Tengah | Telp/Fax: (0283) 356246', pageWidth / 2, 28, { align: 'center' });

    // Double line divider
    doc.setDrawColor(10, 37, 64);
    doc.setLineWidth(0.8);
    doc.line(14, 30.5, pageWidth - 14, 30.5);
    doc.setLineWidth(0.2);
    doc.line(14, 31.5, pageWidth - 14, 31.5);

    // Subtitle
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(10, 37, 64);
    doc.text(titleBagian, pageWidth / 2, 36, { align: 'center' });
  };

  const drawMetadataTable = (startY: number): number => {
    autoTable(doc, {
      startY: startY,
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 1, textColor: [30, 41, 59] },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 32 },
        1: { cellWidth: 60 },
        2: { fontStyle: 'bold', cellWidth: 32 },
        3: { cellWidth: 58 },
      },
      body: [
        ['Mata Pelajaran', `: ${meta.mataPelajaran}`, 'Jenis Asesmen', `: ${meta.jenisAsesmen}`],
        ['Tingkat / Kelas', `: Kelas ${meta.kelas} (SMK)`, 'Bentuk Instrumen', `: ${meta.bentukInstrumen}`],
        ['Jurusan / Keahlian', `: ${meta.jurusan} - ${meta.jurusanNamaLengkap}`, 'Jumlah Soal', `: ${meta.jumlahSoal} Butir`],
        ['Guru Pengampu', `: ${meta.namaGuru || 'Guru Mata Pelajaran'}`, 'Kerangka SOLO', `: ${meta.tingkatKognitif}`],
        ['Materi Pokok', `: ${meta.materiTopik}`, 'Tanggal Dibuat', `: ${meta.tanggalDibuat}`],
      ],
      margin: { left: 14, right: 14 },
    });

    // @ts-ignore
    return doc.lastAutoTable.finalY + 4;
  };

  // Section renders
  const renderKisiKisi = (startY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(10, 37, 64);
    doc.text('A. KISI-KISI PENULISAN SOAL / INSTRUMEN ASESMEN', 14, startY);

    const rows = data.kisiKisi.map((k) => [
      k.no,
      k.tujuanPembelajaran,
      k.materi,
      k.indikatorSoal,
      k.levelSolo,
      k.nomorButir,
      k.bobotSkor,
    ]);

    autoTable(doc, {
      startY: startY + 2,
      head: [['No', 'Tujuan Pembelajaran', 'Materi', 'Indikator Soal', 'Level SOLO', 'No. Butir', 'Skor']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255], fontSize: 7, fontStyle: 'bold', halign: 'center' },
      styles: { fontSize: 7, cellPadding: 1.5, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 42 },
        2: { cellWidth: 32 },
        3: { cellWidth: 44 },
        4: { cellWidth: 26, halign: 'center' },
        5: { cellWidth: 14, halign: 'center' },
        6: { cellWidth: 12, halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });
  };

  const renderNaskahSoal = (startY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(10, 37, 64);
    doc.text('B. NASKAH SOAL ASESMEN (LEMBAR PESERTA DIDIK)', 14, startY);

    // Student identity box
    autoTable(doc, {
      startY: startY + 2,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2, textColor: [51, 65, 85] },
      columnStyles: {
        0: { cellWidth: 91 },
        1: { cellWidth: 91 },
      },
      body: [
        [
          'Nama Peserta Didik : .................................................\nNIS / NISN               : .................................................',
          `Kelas / Jurusan       : Kelas ${meta.kelas} / ${meta.jurusan}\nHari / Tanggal        : .................................................`,
        ],
      ],
      margin: { left: 14, right: 14 },
    });

    // @ts-ignore
    let currentY = doc.lastAutoTable.finalY + 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Petunjuk Pengerjaan:', 14, currentY);
    currentY += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    data.naskahSoal.petunjukUmum.forEach((p, idx) => {
      const pText = `${idx + 1}. ${p}`;
      const splitP = doc.splitTextToSize(pText, pageWidth - 28);
      doc.text(splitP, 16, currentY);
      currentY += splitP.length * 3.5;
    });

    currentY += 2;
    doc.setDrawColor(203, 213, 225);
    doc.line(14, currentY, pageWidth - 14, currentY);
    currentY += 5;

    // Render questions
    data.naskahSoal.butirSoal.forEach((soal) => {
      // Check page break
      if (currentY > pageHeight - 35) {
        doc.addPage();
        drawKopSurat('NASKAH SOAL ASESMEN (LANJUTAN)');
        currentY = 44;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);

      const qHeader = `${soal.nomor}. `;
      doc.text(qHeader, 14, currentY);

      doc.setFont('helvetica', 'normal');
      const qText = soal.pertanyaan;
      const splitQ = doc.splitTextToSize(qText, pageWidth - 36);
      doc.text(splitQ, 20, currentY);
      currentY += splitQ.length * 4;

      if (soal.konteksMaritim) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(2, 132, 199);
        const splitCtx = doc.splitTextToSize(`[Konteks Maritim: ${soal.konteksMaritim}]`, pageWidth - 36);
        doc.text(splitCtx, 20, currentY);
        currentY += splitCtx.length * 3.5;
      }

      if (soal.opsi && soal.opsi.length > 0) {
        soal.opsi.forEach((opt) => {
          if (currentY > pageHeight - 20) {
            doc.addPage();
            drawKopSurat('NASKAH SOAL ASESMEN (LANJUTAN)');
            currentY = 44;
          }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(30, 41, 59);
          doc.text(`${opt.key}. `, 22, currentY);

          doc.setFont('helvetica', 'normal');
          const optText = doc.splitTextToSize(opt.text, pageWidth - 42);
          doc.text(optText, 27, currentY);
          currentY += Math.max(optText.length * 3.6, 4.2);
        });
      }

      if (soal.petunjukPengerjaan) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        const splitInstr = doc.splitTextToSize(`Petunjuk: ${soal.petunjukPengerjaan}`, pageWidth - 36);
        doc.text(splitInstr, 20, currentY);
        currentY += splitInstr.length * 3.5;
      }

      currentY += 3;
    });
  };

  const renderKunciJawaban = (startY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(10, 37, 64);
    doc.text('C. KUNCI JAWABAN & PEMBAHASAN TERPISAH (PEDOMAN GURU)', 14, startY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(185, 28, 28);
    doc.text('DOKUMEN RAHASIA - HANYA UNTUK GURU PENGAMPU DAN TIM EVALUASI SUPM TEGAL', 14, startY + 4);

    const rows = data.kunciJawaban.map((k) => [
      k.nomor,
      k.bentuk,
      k.kunci,
      k.pembahasan + (k.kriteriaJawaban && k.kriteriaJawaban.length ? `\n• Kriteria: ${k.kriteriaJawaban.join('; ')}` : ''),
      k.skorMaksimal,
    ]);

    autoTable(doc, {
      startY: startY + 6,
      head: [['No', 'Bentuk', 'Kunci / Pedoman', 'Pembahasan Ilmiah & Unsur Jawaban', 'Skor']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold', halign: 'center' },
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 20 },
        2: { cellWidth: 28, fontStyle: 'bold' },
        3: { cellWidth: 114 },
        4: { cellWidth: 12, halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });
  };

  const renderRubrik = (startY: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(10, 37, 64);
    doc.text('D. RUBRIK & PEDOMAN PENSKORAN SERTA QUALITY ASSURANCE', 14, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(`Deskripsi: ${data.rubrik.deskripsiRubrik}`, pageWidth - 28);
    doc.text(splitDesc, 14, startY + 4);

    const critRows = data.rubrik.kriteria.map((c) => {
      let perf = c.deskripsi;
      if (c.indikatorKinerja) {
        perf += `\n• SB (90-100%): ${c.indikatorKinerja.sangatBaik}\n• B (75-89%): ${c.indikatorKinerja.baik}\n• C (60-74%): ${c.indikatorKinerja.cukup}\n• K (<60%): ${c.indikatorKinerja.kurang}`;
      }
      return [c.komponen, perf, c.skorMaks];
    });

    autoTable(doc, {
      startY: startY + 4 + splitDesc.length * 3.5,
      head: [['Komponen Penilaian', 'Deskripsi Kriteria & Indikator Kinerja', 'Skor Maks']],
      body: critRows,
      theme: 'grid',
      headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255], fontSize: 7.5, fontStyle: 'bold' },
      styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 126 },
        2: { cellWidth: 16, halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });

    // @ts-ignore
    let currentY = doc.lastAutoTable.finalY + 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(`Rumus Nilai: ${data.rubrik.rumusNilai} (Skor Maks Total: ${data.rubrik.skorMaksimalTotal})`, 14, currentY);
    currentY += 4;

    // Follow up table
    const tindakRows = data.rubrik.interpretasiDanTindakLanjut.map((t) => [
      t.kategori,
      t.rentangSkor,
      t.tindakLanjut,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Kategori Ketercapaian', 'Rentang Skor', 'Tindak Lanjut Pembelajaran']],
      body: tindakRows,
      theme: 'grid',
      headStyles: { fillColor: [10, 37, 64], textColor: [255, 255, 255], fontSize: 7.5 },
      styles: { fontSize: 7, cellPadding: 1.8 },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 26, halign: 'center' },
        2: { cellWidth: 111 },
      },
      margin: { left: 14, right: 14 },
    });

    // @ts-ignore
    currentY = doc.lastAutoTable.finalY + 5;

    // Signature
    if (currentY > pageHeight - 35) {
      doc.addPage();
      drawKopSurat('LEMBAR PENGESAHAN');
      currentY = 44;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(`Catatan Verifikasi: ${data.pemeriksaanMutu.catatanVerifikasi}`, 14, currentY);
    currentY += 7;

    // Two signatures
    const col1 = 20;
    const col2 = 125;
    doc.text('Mengetahui,', col1, currentY);
    doc.text(`Tegal, ${meta.tanggalDibuat}`, col2, currentY);
    currentY += 4;
    doc.text('Ketua Program Keahlian SUPM Tegal', col1, currentY);
    doc.text('Guru Pengampu Mata Pelajaran,', col2, currentY);
    currentY += 16;
    doc.setFont('helvetica', 'bold');
    doc.text('( .................................................... )', col1, currentY);
    doc.text(`( ${meta.namaGuru || '....................................................'} )`, col2, currentY);
    currentY += 4;
    doc.setFont('helvetica', 'normal');
    doc.text('NIP. ................................................', col1, currentY);
    doc.text('NIP. ................................................', col2, currentY);
  };

  // Execution based on part
  if (part === 'all') {
    // Page 1: Kisi-kisi
    drawKopSurat(bagianTitleMap['kisi']);
    let y = drawMetadataTable(40);
    renderKisiKisi(y);

    // Page 2: Naskah Soal
    doc.addPage();
    drawKopSurat(bagianTitleMap['soal']);
    y = drawMetadataTable(40);
    renderNaskahSoal(y);

    // Page 3: Kunci Jawaban
    doc.addPage();
    drawKopSurat(bagianTitleMap['kunci']);
    y = drawMetadataTable(40);
    renderKunciJawaban(y);

    // Page 4: Rubrik
    doc.addPage();
    drawKopSurat(bagianTitleMap['rubrik']);
    y = drawMetadataTable(40);
    renderRubrik(y);
  } else if (part === 'kisi') {
    drawKopSurat(bagianTitleMap['kisi']);
    const y = drawMetadataTable(40);
    renderKisiKisi(y);
  } else if (part === 'soal') {
    drawKopSurat(bagianTitleMap['soal']);
    const y = drawMetadataTable(40);
    renderNaskahSoal(y);
  } else if (part === 'kunci') {
    drawKopSurat(bagianTitleMap['kunci']);
    const y = drawMetadataTable(40);
    renderKunciJawaban(y);
  } else if (part === 'rubrik') {
    drawKopSurat(bagianTitleMap['rubrik']);
    const y = drawMetadataTable(40);
    renderRubrik(y);
  }

  // Add Page Numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `SUPM NEGERI TEGAL - Halaman ${i} dari ${totalPages} | Dokumen Asesmen Pembelajaran Kejuruan`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  return doc.output('blob');
}
