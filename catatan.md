Manajemen Produk
Lihat semua product
Lihat satu produk
Tambah produk
Edit/Update Produk
Delete Produk

Manajemen Produk

Melihat Produk

- All Product
- By Id

Menambah Produk

- Request Body harus memiliki atribut : name, category, price, dan in_stock. Untuk description bersifat opsional

Update Produk

- Update berdasarkan id product
- Dapat memasukkan name, category, price, in_stock, dan description.
- Saat update harus memasukkan name, category, dan price

Delete Produk

- Delete produk berdasarkan id

Manajemen Keranjang Belanja

Melihat isi keranjang belanja

- /cart

Memasukkan produk ke keranjang belanja

- Post /cart
- Harus memasukkan product_id dan quantity di dalam request body

Menghapus produk dari keranjang belanja

- Delete /cart/:id
- Menghapus produk di dalam keranjang belanja berdasarkan id di dalam keranjang (produk pertama memiliki id : 1, dst)
- Problem : id autoincrement, jadi saat hapus satu produk, id tetap lanjut

Menghapus semua isi keranjang

- Delete /cart
- Problem : setelah semua terhapus, id masih melanjutkan hitungan untuk produk berikutnya

Memasukkan keranjang ke sesi order

-Post /orders
-Membuat id order baru untuk tiap cart yang dimasukkan di table 'order', kemudian produk-produk akan di list di table 'order_items' yang dipasangkan dengan id order sesuai table 'order'

Menghapus Order

-Delete /orders/id

Register

- Perlu menginput name, email, dan password do body request

Login

- Perlu menginput username yang berupa email dan password

* Nggak bisa pakai findUnique, karena namenya nggak unique

Token

- masukkan token melaui header request dengan key Authorization melalui postman, token digenerate menggunakan crypto milik node.js. token kemudian otomatis tersimpan ke dalam table Token sesuai dengan user_id dari email dan password yang diberikan melalui route login
- token harus disertakan di tiap route, kecuali login dan register

Permission

- Seller dan Regular User memiliki permission yang berbeda

Yang perlu ditambahkan :

- View individual product (Done)
- Kolom User di Cart, agar cart tiap user berbeda (Done)
- kasih permission middleware untuk tiap route
- paygate
- validasi register, memunculkan error message ketika email sudah terdaftar (Done)
- Search (done)

Payment Gateaway

- at port 3000
  ///Yang belum paham

- @@index dan @@id
- withRelation
- Payment Gateway
- authorization-seeds.js
  for (const role in PermissionAssignment) {
  for (const permission of PermissionAssignment[role]) {
  await prisma.permissionRole.create({
  data: {
  permission: {
  connect: {
  name: permission,
  },
  },
  role: {
  connect: {
  name: role,
  },
  },
  },
  });
  }

      kenapa walau di bolak balik, tetap sesuai dengan columnnya

Yang ingin dipelajari :
-jwt
