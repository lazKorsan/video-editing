import { Given, When, Then } from '@cucumber/cucumber';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import assert from 'assert';

if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath);
}

const ASSETS_DIR = path.join(process.cwd(), 'assets');

let inputFile: string;
let outputFile: string;
let folderPath: string;
let videoFilesToMerge: string[] = [];
// ==========================================
// 1. ORTAK GIVEN ADIMI
// ==========================================
Given('{string} adında bir test videosu mevcut', function (fileName: string) {
    inputFile = path.join(ASSETS_DIR, fileName);
    const exists = fs.existsSync(inputFile);
    assert.strictEqual(exists, true, `Assets klasöründe video bulunamadı: ${inputFile}`);
});

// Belirtilen klasördeki tüm video dosyalarının varlığını teyit eder
// ve videoFilesToMerge dizisini doldurur (birleştirme adımlarında kullanılır).
const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

Given('{string} klasoru icindeki tum videolarin mevcut oldugu teyit edildiginde', function (folderName: string) {
    folderPath = path.join(ASSETS_DIR, folderName);
    console.log(`Klasör kontrol ediliyor: ${folderPath}`);

    const folderExists = fs.existsSync(folderPath);
    assert.strictEqual(folderExists, true, `Klasör bulunamadı: ${folderPath}`);

    const isDirectory = fs.statSync(folderPath).isDirectory();
    assert.strictEqual(isDirectory, true, `Belirtilen yol bir klasör değil: ${folderPath}`);

    // Tüm dosyaları al ve video dosyalarını filtrele
    const allFiles = fs.readdirSync(folderPath);
    console.log(`Klasördeki tüm dosyalar: ${allFiles.join(', ')}`);

    videoFilesToMerge = allFiles
        .filter((file) => {
            const ext = path.extname(file).toLowerCase();
            return VIDEO_EXTENSIONS.includes(ext);
        })
        .sort() // İsme göre sırala
        .map((file) => path.join(folderPath, file));

    console.log(`Birleştirilecek video dosyaları: ${videoFilesToMerge.join(', ')}`);

    assert.strictEqual(
        videoFilesToMerge.length > 0,
        true,
        `"${folderName}" klasöründe birleştirilecek video bulunamadı. Desteklenen formatlar: ${VIDEO_EXTENSIONS.join(', ')}`
    );

    // Her dosyanın varlığını kontrol et
    videoFilesToMerge.forEach((filePath) => {
        const exists = fs.existsSync(filePath);
        assert.strictEqual(exists, true, `Video dosyası bulunamadı: ${filePath}`);
        console.log(`✅ Dosya mevcut: ${filePath}`);
    });
});

// ==========================================
// 2. WHEN ADIMLARI (EYLEMLER)
// ==========================================

// A) Video Kesme İşlemi
When(
    'Videonun ilk {int} saniyesi kesilip {string} ismiyle kaydedildiğinde',
    { timeout: 300000 }, // Uzun videolar için 5 dakika timeout
    async function (durationSeconds: number, targetFileName: string) {
        outputFile = path.join(ASSETS_DIR, targetFileName);

        if (fs.existsSync(outputFile)) {
            try {
                fs.unlinkSync(outputFile);
            } catch (e) {
                console.warn(`[Uyarı] ${targetFileName} dosyası kilitli olabilir, üzerine yazılacak.`);
            }
        }

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                .setStartTime(0)
                .setDuration(durationSeconds)
                .output(outputFile)
                .on('end', () => {
                    console.log(`Video kesme tamamlandı: ${outputFile}`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('FFmpeg Kesme Hatası:', err);
                    reject(err);
                })
                .run();
        });
    }
);

// B) Ses Yükseltme İşlemi
When(
    'Video icindeki insan sesleri {int} katina cikarilip {string} kaydedildiginde',
    { timeout: 300000 }, // Uzun videolar için 5 dakika timeout
    async function (multiplier: number, targetFileName: string) {
        outputFile = path.join(ASSETS_DIR, targetFileName);

        if (fs.existsSync(outputFile)) {
            try {
                fs.unlinkSync(outputFile);
            } catch (e) {
                console.warn(`[Uyarı] ${targetFileName} dosyası kilitli olabilir, üzerine yazılacak.`);
            }
        }

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                .audioFilters(`volume=${multiplier}`)
                .output(outputFile)
                .on('end', () => {
                    console.log(`Ses yükseltme tamamlandı: ${outputFile}`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('FFmpeg Ses Yükseltme Hatası:', err);
                    reject(err);
                })
                .run();
        });
    }
);

// ==========================================
// 3. THEN ADIMLARI (DOĞRULAMA)
// ==========================================

// US001 İçin Türkçe Karakterli Adım
Then('{string} dosyası başarıyla oluşturulmuş olmalı', function (expectedFileName: string) {
    validateFileCreation(expectedFileName);
});

// US002 İçin Karakter Uyumlu Adım
Then('{string} dosyasi basari ile olusmus olmalı', function (expectedFileName: string) {
    validateFileCreation(expectedFileName);
});

// Videonun Belirli İki Saniye Aralığını Kesme Adımı (Örn: 1 ile 5 saniye arası)
When(
    'Videonun {int} ile {int} saniyesi araligi kesilip {string} ismiyle kaydedildiğinde',
    { timeout: 300000 },
    async function (startSecond: number, endSecond: number, targetFileName: string) {
        outputFile = path.join(ASSETS_DIR, targetFileName);

        // Çıkarılacak toplam süre hesaplanıyor (5 - 1 = 4 saniye)
        const duration = endSecond - startSecond;

        if (fs.existsSync(outputFile)) {
            try {
                fs.unlinkSync(outputFile);
            } catch (e) {
                console.warn(`[Uyarı] ${targetFileName} kilitli olabilir, üzerine yazılacak.`);
            }
        }

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                .setStartTime(startSecond) // Başlangıç saniyesi (Örn: 1)
                .setDuration(duration)     // İşlenecek süre (Örn: 4 saniye)
                .output(outputFile)
                .on('end', () => {
                    console.log(`Video ${startSecond}-${endSecond} saniyeleri arası kesildi: ${outputFile}`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('FFmpeg Aralık Kesme Hatası:', err);
                    reject(err);
                })
                .run();
        });
    }
);

When(
    'Videonun {int}-{int} ve {int}-{int} saniye araliklari kesilip tek parca {string} olarak kaydedildiginde',
    { timeout: 300000 },
    async function (start1: number, end1: number, start2: number, end2: number, targetFileName: string) {
        outputFile = path.join(ASSETS_DIR, targetFileName);

        if (fs.existsSync(outputFile)) {
            try { fs.unlinkSync(outputFile); } catch (e) {}
        }

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                .complexFilter([
                    // 1. Parça: start1 - end1 arasını kes
                    `[0:v]trim=start=${start1}:end=${end1},setpts=PTS-STARTPTS[v1]`,
                    `[0:a]atrim=start=${start1}:end=${end1},asetpts=PTS-STARTPTS[a1]`,
                    // 2. Parça: start2 - end2 arasını kes
                    `[0:v]trim=start=${start2}:end=${end2},setpts=PTS-STARTPTS[v2]`,
                    `[0:a]atrim=start=${start2}:end=${end2},asetpts=PTS-STARTPTS[a2]`,
                    // İki parçayı birleştir
                    `[v1][a1][v2][a2]concat=n=2:v=1:a=1[outv][outa]`
                ])
                .outputOptions(['-map [outv]', '-map [outa]'])
                .output(outputFile)
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .run();
        });
    }
);

When(
    'Videonun {int}-{int} araligi {string} ve {int}-{int} araligi {string} olarak ayrildiginda',
    { timeout: 300000 },
    async function (s1: number, e1: number, out1: string, s2: number, e2: number, out2: string) {
        const path1 = path.join(ASSETS_DIR, out1);
        const path2 = path.join(ASSETS_DIR, out2);

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                // 1. Çıktı Dosyası
                .output(path1)
                .setStartTime(s1)
                .setDuration(e1 - s1)
                // 2. Çıktı Dosyası (Tek komutta ikinci çıktı)
                .output(path2)
                .setStartTime(s2)
                .setDuration(e2 - s2)
                .on('end', () => resolve())
                .on('error', (err) => reject(err))
                .run();
        });
    }
);

// Videoyu Tek Komutta 3 Ayrı Dosyaya Bölme Adımı
When(
    'Videonun {int}-{int} araligi {string}, {int}-{int} araligi {string} ve {int}-{int} araligi {string} olarak ayrildiginda',
    { timeout: 300000 },
    async function (
        s1: number, e1: number, out1: string,
        s2: number, e2: number, out2: string,
        s3: number, e3: number, out3: string
    ) {
        const path1 = path.join(ASSETS_DIR, out1);
        const path2 = path.join(ASSETS_DIR, out2);
        const path3 = path.join(ASSETS_DIR, out3);

        // Eski parçalar varsa temizliyoruz
        [path1, path2, path3].forEach((filePath) => {
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) {}
            }
        });

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                // 1. Parça (Örn: 1-5 sn)
                .output(path1)
                .setStartTime(s1)
                .setDuration(e1 - s1)

                // 2. Parça (Örn: 7-11 sn)
                .output(path2)
                .setStartTime(s2)
                .setDuration(e2 - s2)

                // 3. Parça (Örn: 13-17 sn)
                .output(path3)
                .setStartTime(s3)
                .setDuration(e3 - s3)

                .on('end', () => {
                    console.log(`3 parça başarıyla kesildi: ${out1}, ${out2}, ${out3}`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('3 Parçaya Bölme Hatası:', err);
                    reject(err);
                })
                .run();
        });
    }
);

// Videoyu Tek Komutta 4 Ayrı Dosyaya Bölme Adımı
When(
    'Videonun {int}-{int} araligi {string}, {int}-{int} araligi {string}, {int}-{int} araligi {string} ve {int}-{int} araligi {string} olarak ayrildiginda',
    { timeout: 300000 },
    async function (
        s1: number, e1: number, out1: string,
        s2: number, e2: number, out2: string,
        s3: number, e3: number, out3: string,
        s4: number, e4: number, out4: string
    ) {
        const path1 = path.join(ASSETS_DIR, out1);
        const path2 = path.join(ASSETS_DIR, out2);
        const path3 = path.join(ASSETS_DIR, out3);
        const path4 = path.join(ASSETS_DIR, out4);

        // Eski parçalar varsa temizliyoruz
        [path1, path2, path3, path4].forEach((filePath) => {
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) {}
            }
        });

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                // 1. Parça (Örn: 1-4 sn)
                .output(path1)
                .setStartTime(s1)
                .setDuration(e1 - s1)

                // 2. Parça (Örn: 5-8 sn)
                .output(path2)
                .setStartTime(s2)
                .setDuration(e2 - s2)

                // 3. Parça (Örn: 9-12 sn)
                .output(path3)
                .setStartTime(s3)
                .setDuration(e3 - s3)

                // 4. Parça (Örn: 13-16 sn)
                .output(path4)
                .setStartTime(s4)
                .setDuration(e4 - s4)

                .on('end', () => {
                    console.log(`4 parça başarıyla kesildi: ${out1}, ${out2}, ${out3}, ${out4}`);
                    resolve();
                })
                .on('error', (err) => {
                    console.error('4 Parçaya Bölme Hatası:', err);
                    reject(err);
                })
                .run();
        });
    }
);

// 3 Aralığı Kesip Tek Parça Olarak Birleştirme
When(
    'Videonun {int}-{int}, {int}-{int} ve {int}-{int} saniye araliklari kesilip tek parca {string} olarak kaydedildiginde',
    { timeout: 300000 },
    async function (
        s1: number, e1: number,
        s2: number, e2: number,
        s3: number, e3: number,
        targetFileName: string
    ) {
        outputFile = path.join(ASSETS_DIR, targetFileName);

        if (fs.existsSync(outputFile)) {
            try { fs.unlinkSync(outputFile); } catch (e) {}
        }

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                .complexFilter([
                    // 1. Parça
                    `[0:v]trim=start=${s1}:end=${e1},setpts=PTS-STARTPTS[v1]`,
                    `[0:a]atrim=start=${s1}:end=${e1},asetpts=PTS-STARTPTS[a1]`,
                    // 2. Parça
                    `[0:v]trim=start=${s2}:end=${e2},setpts=PTS-STARTPTS[v2]`,
                    `[0:a]atrim=start=${s2}:end=${e2},asetpts=PTS-STARTPTS[a2]`,
                    // 3. Parça
                    `[0:v]trim=start=${s3}:end=${e3},setpts=PTS-STARTPTS[v3]`,
                    `[0:a]atrim=start=${s3}:end=${e3},asetpts=PTS-STARTPTS[a3]`,
                    // 3 parçayı sırayla uca ekle (concat)
                    `[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1[outv][outa]`
                ])
                .outputOptions(['-map [outv]', '-map [outa]'])
                .output(outputFile)
                .on('end', () => {
                    console.log(`3 parça kesilip birleştirildi: ${outputFile}`);
                    resolve();
                })
                .on('error', (err) => reject(err))
                .run();
        });
    }
);
// 4 Aralığı Kesip Tek Parça Olarak Birleştirme
When(
    'Videonun {int}-{int}, {int}-{int}, {int}-{int} ve {int}-{int} saniye araliklari kesilip tek parca {string} olarak kaydedildiginde',
    { timeout: 300000 },
    async function (
        s1: number, e1: number,
        s2: number, e2: number,
        s3: number, e3: number,
        s4: number, e4: number,
        targetFileName: string
    ) {
        outputFile = path.join(ASSETS_DIR, targetFileName);

        if (fs.existsSync(outputFile)) {
            try { fs.unlinkSync(outputFile); } catch (e) {}
        }

        await new Promise<void>((resolve, reject) => {
            ffmpeg(inputFile)
                .complexFilter([
                    // 1. Parça
                    `[0:v]trim=start=${s1}:end=${e1},setpts=PTS-STARTPTS[v1]`,
                    `[0:a]atrim=start=${s1}:end=${e1},asetpts=PTS-STARTPTS[a1]`,
                    // 2. Parça
                    `[0:v]trim=start=${s2}:end=${e2},setpts=PTS-STARTPTS[v2]`,
                    `[0:a]atrim=start=${s2}:end=${e2},asetpts=PTS-STARTPTS[a2]`,
                    // 3. Parça
                    `[0:v]trim=start=${s3}:end=${e3},setpts=PTS-STARTPTS[v3]`,
                    `[0:a]atrim=start=${s3}:end=${e3},asetpts=PTS-STARTPTS[a3]`,
                    // 4. Parça
                    `[0:v]trim=start=${s4}:end=${e4},setpts=PTS-STARTPTS[v4]`,
                    `[0:a]atrim=start=${s4}:end=${e4},asetpts=PTS-STARTPTS[a4]`,
                    // 4 parçayı sırayla uca ekle (concat)
                    `[v1][a1][v2][a2][v3][a3][v4][a4]concat=n=4:v=1:a=1[outv][outa]`
                ])
                .outputOptions(['-map [outv]', '-map [outa]'])
                .output(outputFile)
                .on('end', () => {
                    console.log(`4 parça kesilip birleştirildi: ${outputFile}`);
                    resolve();
                })
                .on('error', (err) => reject(err))
                .run();
        });
    }
);

When(
    'Klasordeki videolar {string} ismiyle tek parca haline getirildiginde',
    { timeout: 600000 },
    async function (targetFileName: string) {
        outputFile = path.join(ASSETS_DIR, targetFileName);
        safeUnlink(outputFile);

        // videoFilesToMerge dizisinin dolu olduğundan emin ol
        if (!videoFilesToMerge || videoFilesToMerge.length === 0) {
            throw new Error('Birleştirilecek video dosyası bulunamadı. Önce Given adımını çalıştırdığınızdan emin olun.');
        }

        console.log(`Birleştirilecek dosyalar: ${videoFilesToMerge.join(', ')}`);

        await new Promise<void>((resolve, reject) => {
            const command = ffmpeg();

            // Tüm dosyaları input olarak ekle
            videoFilesToMerge.forEach((filePath) => {
                if (fs.existsSync(filePath)) {
                    command.input(filePath);
                } else {
                    reject(new Error(`Dosya bulunamadı: ${filePath}`));
                }
            });

            // Alternatif birleştirme yöntemi - concat demuxer kullan
            // Bu yöntem daha kararlı çalışır
            const concatList = videoFilesToMerge.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n');
            const listFilePath = path.join(ASSETS_DIR, 'concat_list.txt');
            fs.writeFileSync(listFilePath, concatList);

            command
                .input(listFilePath)
                .inputOptions(['-f', 'concat', '-safe', '0'])
                .output(outputFile)
                .outputOptions(['-c', 'copy']) // Kopyalama yaparak hızlı birleştirme
                .on('end', () => {
                    console.log(`Video birleştirme tamamlandı: ${outputFile}`);
                    // Geçici dosyayı temizle
                    try { fs.unlinkSync(listFilePath); } catch(e) {}
                    resolve();
                })
                .on('error', (err) => {
                    console.error('FFmpeg Birleştirme Hatası:', err);
                    // Geçici dosyayı temizle
                    try { fs.unlinkSync(listFilePath); } catch(e) {}
                    reject(err);
                })
                .run();
        });
    }
);

// Yardımcı Doğrulama Fonksiyonu
function validateFileCreation(expectedFileName: string) {
    const expectedPath = path.join(ASSETS_DIR, expectedFileName);
    const fileExists = fs.existsSync(expectedPath);

    assert.strictEqual(fileExists, true, `Çıktı dosyası diskte bulunamadı: ${expectedPath}`);

    if (fileExists) {
        const stats = fs.statSync(expectedPath);
        assert.strictEqual(stats.size > 0, true, `Çıktı dosyası oluşturuldu fakat içi boş!`);
    }
}

// ==========================================
// YARDIMCI (HELPER) FONKSİYONLAR
// ==========================================

function safeUnlink(filePath: string) {
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.warn(`[Uyarı] ${filePath} dosyası kilitli olabilir, üstüne yazılacak.`);
        }
    }
}