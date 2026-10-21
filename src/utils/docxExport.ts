import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  PageBreak,
  Packer,
  ShadingType,
} from 'docx';
import { AssessmentData } from '../types/assessment';

export type ExportPart = 'all' | 'kisi' | 'soal' | 'kunci' | 'rubrik';

function createHeaderTable(data: AssessmentData, bagianTitle: string): Table {
  const meta = data.metadata;
  const navyBorder = { style: BorderStyle.SINGLE, size: 2, color: '0A2540' };
  const lightBorders = {
    top: { style: BorderStyle.NONE },
    bottom: navyBorder,
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: lightBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'KEMENTERIAN KELAUTAN DAN PERIKANAN',
                    font: 'Arial',
                    size: 20,
                    bold: true,
                    color: '0A2540',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'BADAN PENYULUHAN DAN PENGEMBANGAN SDM KELAUTAN DAN PERIKANAN',
                    font: 'Arial',
                    size: 18,
                    bold: true,
                    color: '0A2540',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'SEKOLAH USAHA PERIKANAN MENENGAH (SUPM) NEGERI TEGAL',
                    font: 'Arial',
                    size: 24,
                    bold: true,
                    color: '0A2540',
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Jl. Martoloyo PO BOX 22 Tegal 52121 - Jawa Tengah',
                    font: 'Arial',
                    size: 16,
                    italics: true,
                    color: '555555',
                  }),
                ],
              }),
              new Paragraph({
                spacing: { before: 120, after: 120 },
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: `PERANGKAT ASESMEN: ${bagianTitle.toUpperCase()}`,
                    font: 'Arial',
                    size: 22,
                    bold: true,
                    color: '0A2540',
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function createMetaIdentityTable(data: AssessmentData): Table {
  const meta = data.metadata;
  const noBorder = {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
  };

  const createRow = (label1: string, val1: string, label2: string, val2: string) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: noBorder,
          children: [new Paragraph({ children: [new TextRun({ text: label1, bold: true, size: 18 })] })],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          borders: noBorder,
          children: [new Paragraph({ children: [new TextRun({ text: `: ${val1}`, size: 18 })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: noBorder,
          children: [new Paragraph({ children: [new TextRun({ text: label2, bold: true, size: 18 })] })],
        }),
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          borders: noBorder,
          children: [new Paragraph({ children: [new TextRun({ text: `: ${val2}`, size: 18 })] })],
        }),
      ],
    });
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      createRow('Mata Pelajaran', meta.mataPelajaran, 'Jenis Asesmen', meta.jenisAsesmen),
      createRow('Tingkat / Kelas', `Kelas ${meta.kelas} (SMK)`, 'Bentuk Instrumen', meta.bentukInstrumen),
      createRow('Jurusan / Keahlian', `${meta.jurusan} - ${meta.jurusanNamaLengkap}`, 'Jumlah Soal', `${meta.jumlahSoal} Butir`),
      createRow('Guru Pengampu', meta.namaGuru || 'Guru Mata Pelajaran', 'Kerangka SOLO', meta.tingkatKognitif),
      createRow('Tanggal Pembuatan', meta.tanggalDibuat, 'Materi / Topik', meta.materiTopik),
    ],
  });
}

function buildKisiKisiSection(data: AssessmentData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'A. KISI-KISI PENULISAN SOAL / INSTRUMEN ASESMEN',
          bold: true,
          color: '0A2540',
          size: 20,
        }),
      ],
    })
  );

  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 24, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tujuan Pembelajaran (TP)', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Materi Pokok', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 24, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Indikator Soal / Kinerja', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 14, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Level SOLO', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No. Soal', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Skor', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
    ],
  });

  const bodyRows = data.kisiKisi.map((item, idx) => {
    const isEven = idx % 2 === 0;
    const bgFill = isEven ? 'F8FAFC' : 'FFFFFF';
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          borders: allBorders,
          shading: { type: ShadingType.CLEAR, fill: bgFill },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.no}`, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: allBorders,
          shading: { type: ShadingType.CLEAR, fill: bgFill },
          children: [new Paragraph({ children: [new TextRun({ text: item.tujuanPembelajaran, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          borders: allBorders,
          shading: { type: ShadingType.CLEAR, fill: bgFill },
          children: [new Paragraph({ children: [new TextRun({ text: item.materi, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          borders: allBorders,
          shading: { type: ShadingType.CLEAR, fill: bgFill },
          children: [new Paragraph({ children: [new TextRun({ text: item.indikatorSoal, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 14, type: WidthType.PERCENTAGE },
          borders: allBorders,
          shading: { type: ShadingType.CLEAR, fill: bgFill },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: item.levelSolo, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 8, type: WidthType.PERCENTAGE },
          borders: allBorders,
          shading: { type: ShadingType.CLEAR, fill: bgFill },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.nomorButir}`, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          borders: allBorders,
          shading: { type: ShadingType.CLEAR, fill: bgFill },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.bobotSkor}`, size: 16 })] })],
        }),
      ],
    });
  });

  elements.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: allBorders,
      rows: [headerRow, ...bodyRows],
    })
  );

  return elements;
}

function buildNaskahSoalSection(data: AssessmentData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'B. NASKAH SOAL ASESMEN (LEMBAR PESERTA DIDIK)',
          bold: true,
          color: '0A2540',
          size: 20,
        }),
      ],
    })
  );

  // Student header form
  const noBorder = {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
  };

  const studentTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: noBorder,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Nama Peserta Didik : .................................................', size: 16 })] }),
              new Paragraph({ children: [new TextRun({ text: 'Nomor Induk Siswa : .................................................', size: 16 })] }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: noBorder,
            children: [
              new Paragraph({ children: [new TextRun({ text: `Kelas / Program : Kelas ${data.metadata.kelas} / ${data.metadata.jurusan}`, size: 16 })] }),
              new Paragraph({ children: [new TextRun({ text: 'Hari / Tanggal  : .................................................', size: 16 })] }),
            ],
          }),
        ],
      }),
    ],
  });
  elements.push(studentTable);

  // Petunjuk Umum
  elements.push(
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [new TextRun({ text: 'Petunjuk Pengerjaan:', bold: true, size: 18 })],
    })
  );

  data.naskahSoal.petunjukUmum.forEach((p, idx) => {
    elements.push(
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: [new TextRun({ text: `${idx + 1}. ${p}`, size: 16 })],
      })
    );
  });

  elements.push(
    new Paragraph({
      spacing: { before: 140, after: 120 },
      children: [new TextRun({ text: '-----------------------------------------------------------------------------------------------------------------', color: 'AAAAAA' })],
    })
  );

  // Questions
  data.naskahSoal.butirSoal.forEach((soal) => {
    elements.push(
      new Paragraph({
        spacing: { before: 140, after: 60 },
        children: [
          new TextRun({ text: `${soal.nomor}. `, bold: true, size: 18 }),
          new TextRun({ text: soal.pertanyaan, size: 18 }),
        ],
      })
    );

    if (soal.konteksMaritim) {
      elements.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { before: 40, after: 60 },
          children: [
            new TextRun({ text: `[Konteks Maritim/Kejuruan: ${soal.konteksMaritim}]`, italics: true, color: '0284C7', size: 16 }),
          ],
        })
      );
    }

    if (soal.opsi && soal.opsi.length > 0) {
      soal.opsi.forEach((opt) => {
        elements.push(
          new Paragraph({
            indent: { left: 400 },
            spacing: { before: 30, after: 30 },
            children: [
              new TextRun({ text: `${opt.key}. `, bold: true, size: 16 }),
              new TextRun({ text: opt.text, size: 16 }),
            ],
          })
        );
      });
    }

    if (soal.petunjukPengerjaan) {
      elements.push(
        new Paragraph({
          indent: { left: 400 },
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: `Petunjuk Khusus: ${soal.petunjukPengerjaan}`, italics: true, color: '64748B', size: 16 }),
          ],
        })
      );
    }
  });

  return elements;
}

function buildKunciJawabanSection(data: AssessmentData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'C. KUNCI JAWABAN & PEMBAHASAN TERPISAH (PEDOMAN GURU)',
          bold: true,
          color: '0A2540',
          size: 20,
        }),
      ],
    })
  );

  elements.push(
    new Paragraph({
      spacing: { before: 40, after: 120 },
      children: [
        new TextRun({
          text: 'Perhatian: Bagian ini merupakan dokumen rahasia pedoman guru pengampu dan pemeriksa asesmen.',
          italics: true,
          color: 'B91C1C',
          size: 16,
        }),
      ],
    })
  );

  data.kunciJawaban.forEach((item) => {
    elements.push(
      new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: `Nomor ${item.nomor} [${item.bentuk} - Skor Maks: ${item.skorMaksimal}]`, bold: true, color: '0A2540', size: 18 }),
        ],
      })
    );

    elements.push(
      new Paragraph({
        indent: { left: 300 },
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: 'Kunci / Pedoman Jawaban: ', bold: true, size: 16 }),
          new TextRun({ text: item.kunci, bold: true, color: '0369A1', size: 16 }),
        ],
      })
    );

    elements.push(
      new Paragraph({
        indent: { left: 300 },
        spacing: { before: 40, after: 40 },
        children: [
          new TextRun({ text: 'Pembahasan Rasional Ilmiah: ', bold: true, size: 16 }),
          new TextRun({ text: item.pembahasan, size: 16 }),
        ],
      })
    );

    if (item.kriteriaJawaban && item.kriteriaJawaban.length > 0) {
      elements.push(
        new Paragraph({
          indent: { left: 300 },
          spacing: { before: 40, after: 20 },
          children: [new TextRun({ text: 'Kriteria / Indikator Unsur Jawaban yang Diharapkan:', bold: true, size: 16 })],
        })
      );
      item.kriteriaJawaban.forEach((krit) => {
        elements.push(
          new Paragraph({
            indent: { left: 600 },
            spacing: { before: 20, after: 20 },
            children: [new TextRun({ text: `• ${krit}`, size: 16 })],
          })
        );
      });
    }
  });

  return elements;
}

function buildRubrikSection(data: AssessmentData): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [];

  elements.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: 'D. RUBRIK & PEDOMAN PENSKORAN SERTA QUALITY ASSURANCE',
          bold: true,
          color: '0A2540',
          size: 20,
        }),
      ],
    })
  );

  elements.push(
    new Paragraph({
      spacing: { before: 40, after: 100 },
      children: [
        new TextRun({ text: 'Deskripsi Rubrik: ', bold: true, size: 16 }),
        new TextRun({ text: data.rubrik.deskripsiRubrik, size: 16 }),
      ],
    })
  );

  // Criteria Table
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

  const tableHeader = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Komponen Penilaian', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 65, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Deskripsi & Indikator Pencapaian Kinerja', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Skor Maks', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
    ],
  });

  const tableRows = data.rubrik.kriteria.map((k) => {
    const descParts: Paragraph[] = [
      new Paragraph({ children: [new TextRun({ text: k.deskripsi, size: 16 })] }),
    ];
    if (k.indikatorKinerja) {
      descParts.push(
        new Paragraph({
          spacing: { before: 40 },
          children: [
            new TextRun({ text: '• Sangat Baik (90-100%): ', bold: true, size: 14 }),
            new TextRun({ text: k.indikatorKinerja.sangatBaik, size: 14 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '• Baik (75-89%): ', bold: true, size: 14 }),
            new TextRun({ text: k.indikatorKinerja.baik, size: 14 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '• Cukup (60-74%): ', bold: true, size: 14 }),
            new TextRun({ text: k.indikatorKinerja.cukup, size: 14 }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({ text: '• Kurang (< 60%): ', bold: true, size: 14 }),
            new TextRun({ text: k.indikatorKinerja.kurang, size: 14 }),
          ],
        })
      );
    }
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: allBorders,
          children: [new Paragraph({ children: [new TextRun({ text: k.komponen, bold: true, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 65, type: WidthType.PERCENTAGE },
          borders: allBorders,
          children: descParts,
        }),
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          borders: allBorders,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${k.skorMaks}`, size: 16 })] })],
        }),
      ],
    });
  });

  elements.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: allBorders, rows: [tableHeader, ...tableRows] }));

  // Formula & Action table
  elements.push(
    new Paragraph({
      spacing: { before: 140, after: 60 },
      children: [
        new TextRun({ text: 'Rumus Perhitungan Nilai Akhir:', bold: true, size: 16 }),
      ],
    }),
    new Paragraph({
      spacing: { before: 20, after: 120 },
      children: [
        new TextRun({ text: data.rubrik.rumusNilai, bold: true, color: '0A2540', size: 16 }),
        new TextRun({ text: ` (Skor Maksimal Total: ${data.rubrik.skorMaksimalTotal})`, size: 16 }),
      ],
    })
  );

  // Interpretation table
  elements.push(
    new Paragraph({
      spacing: { before: 60, after: 60 },
      children: [new TextRun({ text: 'Interpretasi & Tindak Lanjut Pembelajaran:', bold: true, size: 16 })],
    })
  );

  const tindakHeader = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Kategori Ketercapaian', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Rentang Nilai', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
      new TableCell({
        width: { size: 55, type: WidthType.PERCENTAGE },
        borders: allBorders,
        shading: { type: ShadingType.CLEAR, fill: '0A2540' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Tindak Lanjut / Intervensi Guru', bold: true, color: 'FFFFFF', size: 16 })] })],
      }),
    ],
  });

  const tindakRows = data.rubrik.interpretasiDanTindakLanjut.map((t) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          borders: allBorders,
          children: [new Paragraph({ children: [new TextRun({ text: t.kategori, bold: true, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 20, type: WidthType.PERCENTAGE },
          borders: allBorders,
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: t.rentangSkor, size: 16 })] })],
        }),
        new TableCell({
          width: { size: 55, type: WidthType.PERCENTAGE },
          borders: allBorders,
          children: [new Paragraph({ children: [new TextRun({ text: t.tindakLanjut, size: 16 })] })],
        }),
      ],
    });
  });

  elements.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: allBorders, rows: [tindakHeader, ...tindakRows] }));

  // Verification & Signature
  elements.push(
    new Paragraph({
      spacing: { before: 200, after: 60 },
      children: [
        new TextRun({ text: 'Lembar Pengesahan & Verifikasi Kualitas Perangkat Asesmen', bold: true, size: 16 }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: `Catatan Verifikasi: ${data.pemeriksaanMutu.catatanVerifikasi}`, italics: true, size: 14, color: '475569' }),
      ],
    })
  );

  const signTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [
              new Paragraph({ children: [new TextRun({ text: 'Mengetahui,', size: 16 })] }),
              new Paragraph({ children: [new TextRun({ text: 'Ketua Program Keahlian SUPM Tegal', size: 16 })] }),
              new Paragraph({ spacing: { before: 700 }, children: [new TextRun({ text: '( ................................................. )', size: 16 })] }),
              new Paragraph({ children: [new TextRun({ text: 'NIP. .................................................', size: 16 })] }),
            ],
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [
              new Paragraph({ children: [new TextRun({ text: `Tegal, ${data.metadata.tanggalDibuat}`, size: 16 })] }),
              new Paragraph({ children: [new TextRun({ text: 'Guru Pengampu Mata Pelajaran,', size: 16 })] }),
              new Paragraph({ spacing: { before: 700 }, children: [new TextRun({ text: `( ${data.metadata.namaGuru || '.................................................'} )`, bold: true, size: 16 })] }),
              new Paragraph({ children: [new TextRun({ text: 'NIP. .................................................', size: 16 })] }),
            ],
          }),
        ],
      }),
    ],
  });

  elements.push(signTable);

  return elements;
}

export async function generateDocxBlob(data: AssessmentData, part: ExportPart): Promise<Blob> {
  let docElements: (Paragraph | Table)[] = [];

  const bagianTitleMap: Record<ExportPart, string> = {
    all: 'Perangkat Lengkap Asesmen',
    kisi: 'Kisi-Kisi Soal Asesmen',
    soal: 'Naskah Soal Asesmen (Peserta Didik)',
    kunci: 'Kunci Jawaban & Pembahasan',
    rubrik: 'Rubrik & Pedoman Penskoran',
  };

  const header = createHeaderTable(data, bagianTitleMap[part]);
  const metaTable = createMetaIdentityTable(data);
  const divider = new Paragraph({ spacing: { before: 100, after: 100 }, children: [new TextRun({ text: '' })] });

  if (part === 'all') {
    docElements = [
      header,
      divider,
      metaTable,
      divider,
      ...buildKisiKisiSection(data),
      new Paragraph({ children: [new PageBreak()] }),
      header,
      divider,
      ...buildNaskahSoalSection(data),
      new Paragraph({ children: [new PageBreak()] }),
      header,
      divider,
      ...buildKunciJawabanSection(data),
      new Paragraph({ children: [new PageBreak()] }),
      header,
      divider,
      ...buildRubrikSection(data),
    ];
  } else if (part === 'kisi') {
    docElements = [header, divider, metaTable, divider, ...buildKisiKisiSection(data)];
  } else if (part === 'soal') {
    docElements = [header, divider, metaTable, divider, ...buildNaskahSoalSection(data)];
  } else if (part === 'kunci') {
    docElements = [header, divider, metaTable, divider, ...buildKunciJawabanSection(data)];
  } else if (part === 'rubrik') {
    docElements = [header, divider, metaTable, divider, ...buildRubrikSection(data)];
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 720, right: 720 }, // 0.5 inch
          },
        },
        children: docElements,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
