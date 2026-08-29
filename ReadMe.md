# 🎬 FFmpeg & TypeScript Video Editing Automation Framework

Bu proje; **TypeScript**, **Cucumber (BDD)** ve **FFmpeg** teknolojilerini bir araya getirerek video işleme (kesme, birleştirme, ses yükseltme vb.) işlemlerini BDD (Behavior-Driven Development) yaklaşımıyla otomatize eden bir test ve işleme altyapısıdır.

---

## 🚀 Öne Çıkan Özellikler

* ✂️ **Esnek Video Kesme:** Tekil zaman aralığı (örn: 1-5. sn) veya ilk N saniyeyi otomatik kesme.
* 🧩 **Çoklu Parça Bölme:** Tek komutla 3 veya 4 farklı zaman aralığını ayrı `.mp4` dosyaları olarak çıkarma.
* 🔗 **Parça Birleştirme:** Belirlenen farklı zaman aralıklarını milisaniyelik hassasiyetle kesip tek videoda birleştirme (`complexFilter`).
* 📁 **Klasör Bazlı Otomatik Birleştirme:** Klasör içindeki `.mp4` videolarını alfabetik/sayısal sıraya dizip otomatik tek parça yapma.
* 🔊 **Ses Yükseltme:** Video içerisindeki ses seviyesini istenen kat oranında (Örn: 15x) artırma.
* 🛡️ **Güvenli Dosya Yönetimi:** Windows kilitli dosya (`EBUSY`) hatalarına karşı dirençli yapı ve otomatik boş dosya (`size > 0`) doğrulaması.

---

## 🛠️ Kurulum Adımları

### 1. Gereksinimler
* [Node.js](https://nodejs.org/) (v16 veya üzeri tavsiye edilir)
* WebStorm, VSCode veya tercih ettiğiniz bir IDE

### 2. Projeyi Klonlayın ve Paketleri Yükleyin
```bash
# Bağımlılıkları yükleyin
npm install