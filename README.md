Panduan Deploy di VPS Ubuntu
1. Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```
2. Clone / upload project
```bash
cd ~
git clone <URL_REPO_ANDA> vps-starter
cd vps-starter
npm install
cp .env.example .env
```
3. Test jalan manual dulu
```bash
node server.js
```
Buka `http://IP_VPS_ANDA:3000` — kalau muncul JSON status "ok", berarti aman.
Tekan `Ctrl+C` untuk stop, lanjut ke langkah berikutnya.
4. Install PM2 (biar auto-restart kalau crash / server reboot)
```bash
sudo npm install -g pm2
pm2 start server.js --name vps-starter
pm2 save
pm2 startup
```
Perintah `pm2 startup` akan menampilkan 1 baris command tambahan — copy dan jalankan itu supaya PM2 otomatis start saat VPS reboot.
Cek status & log:
```bash
pm2 status
pm2 logs vps-starter
```
5. (Opsional) Buka firewall
```bash
sudo ufw allow 3000
sudo ufw allow OpenSSH
sudo ufw enable
```
6. (Opsional) Pasang Nginx sebagai reverse proxy + domain
```bash
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/vps-starter
```
Isi dengan:
```nginx
server {
    listen 80;
    server_name domain-anda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Aktifkan:
```bash
sudo ln -s /etc/nginx/sites-available/vps-starter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo ufw allow 'Nginx Full'
```
7. (Opsional) SSL gratis dengan Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d domain-anda.com
```
---
Kalau nanti error lagi, cek ini dulu:
`pm2 logs vps-starter` → lihat pesan error asli dari aplikasi
`sudo lsof -i :3000` → cek apakah port sudah dipakai proses lain
Pastikan `HOST` di server.js tetap `0.0.0.0`, bukan `localhost`
