# React Restaurant Website Project

## Proje Hakkında
React Restaurant Website Project, modern bir restoran web sitesi arayüzü oluşturmak amacıyla geliştirilmiş bir front-end projesidir. Kullanıcıların menüleri görüntülemesine, rezervasyon yapmasına ve iletişim formu aracılığıyla restoran ile iletişim kurmasına olanak tanır. Responsive tasarımı sayesinde hem masaüstü hem de mobil cihazlarda sorunsuz bir deneyim sunar.

## Özellikler
- **Anasayfa**: Proje tanıtımı ve öne çıkan görseller  
- **Menü Sayfası**: Kategorilere göre ayrılmış yemek listeleri  
- **Hakkımızda Sayfası**: Restoran hakkında bilgi  
- **Rezervasyon Sayfası**: Ad, tarih, saat ve kişi sayısı bilgisi ile rezervasyon formu  
- **İletişim Sayfası**: İletişim formu ve iletişim bilgileri  
- **Responsive Tasarım**: Tüm cihaz boyutlarına uyumlu layout  

## Teknolojiler
- React.js (v17 veya üstü)  
- React Router  
- CSS / SCSS  
- Node.js (backend)  
- Express.js (backend)  
- MySQL (veritabanı)  

## Başlarken

### Ön Koşullar
- Node.js ve npm (veya yarn) kurulmuş olmalı  
- MySQL sunucusu kurulmuş ve çalışır durumda olmalı  

### Proje Klonlama
```bash
git clone https://github.com/muhammedaliderindag/react-restaurant-website-project.git
cd react-restaurant-website-project
```

### Frontend Kurulum ve Çalıştırma
```bash
cd frontend
npm install
npm start
```
Tarayıcınızı açarak `http://localhost:5173` adresine gidin.

### Backend Kurulum ve Çalıştırma
```bash
cd backend
npm install
```
Aşağıdaki ortam değişkenlerini bir `.env` dosyası oluşturarak ayarlayın:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=restaurantdb
PORT=3001
```
Sunucuyu başlatın:
```bash
npm run dev
```
API istekleri `http://localhost:3001/api/` altında çalışacaktır.

## Veritabanı
`project sql.sql` dosyası, MySQL için gerekli tablo ve örnek veri oluşturma scriptini içerir. Veritabanınızı hazırlamak için:
```bash
mysql -u root -p < "../project sql.sql"
```

## Proje Yapısı
```
react-restaurant-website-project/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── project sql.sql
```
